'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell } from 'recharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6']

export default function Analytics() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  async function fetchAlerts() {
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    setAlerts(data || [])
    setLoading(false)
  }

  function getDailyData() {
    const days: Record<string, { date: string, P1: number, P2: number, P3: number }> = {}
    const last7 = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })
    last7.forEach(d => { days[d] = { date: d.slice(5), P1: 0, P2: 0, P3: 0 } })
    alerts.forEach(a => {
      const d = a.created_at.split('T')[0]
      if (days[d]) {
        const label = a.severity_label as 'P1' | 'P2' | 'P3'
        if (label in days[d]) days[d][label]++
      }
    })
    return Object.values(days)
  }

  function getServiceData() {
    const services: Record<string, number> = {}
    alerts.forEach(a => {
      const name = a.service.replace(' (prod)', '')
      services[name] = (services[name] || 0) + 1
    })
    return Object.entries(services)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
  }

  function getSeverityData() {
    const counts: Record<string, number> = { P1: 0, P2: 0, P3: 0 }
    alerts.forEach(a => { if (a.severity_label in counts) counts[a.severity_label]++ })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }

  function getConfidenceData() {
    const counts: Record<string, number> = { high: 0, medium: 0, low: 0 }
    alerts.forEach(a => { if (a.confidence in counts) counts[a.confidence]++ })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }

  const p1Count = alerts.filter(a => a.severity_label === 'P1').length
  const deployCount = alerts.filter(a => a.deploy_correlated).length
  const commitCount = alerts.filter(a => a.guilty_commit).length
  const highConfidence = alerts.filter(a => a.confidence === 'high').length
  const resolved = alerts.filter(a => a.mttr_minutes)
  const avgMTTR = resolved.length
    ? Math.round(resolved.reduce((sum: number, a: any) => sum + a.mttr_minutes, 0) / resolved.length)
    : 0

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-400 mt-1">Alert trends and patterns</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Alerts', value: alerts.length, color: 'text-white' },
          { label: 'P1 Critical', value: p1Count, color: 'text-red-400' },
          { label: 'Deploy Correlated', value: `${deployCount}`, color: 'text-orange-400' },
          { label: 'High Confidence', value: `${highConfidence}`, color: 'text-emerald-400' },
          { label: 'Avg MTTR', value: avgMTTR ? `${avgMTTR}m` : '—', color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/3 border border-white/5 rounded-xl p-5">
          <p className="text-sm font-medium mb-4">Alerts over last 7 days</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={getDailyData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #ffffff10', borderRadius: 8 }} />
              <Line type="monotone" dataKey="P1" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="P2" stroke="#f97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="P3" stroke="#eab308" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/3 border border-white/5 rounded-xl p-5">
          <p className="text-sm font-medium mb-4">Top services by alert count</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getServiceData()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#6b7280' }} width={110} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #ffffff10', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/3 border border-white/5 rounded-xl p-5">
          <p className="text-sm font-medium mb-4">Severity breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={getSeverityData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {getSeverityData().map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #ffffff10', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/3 border border-white/5 rounded-xl p-5">
          <p className="text-sm font-medium mb-4">AI confidence distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getConfidenceData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #ffffff10', borderRadius: 8 }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
