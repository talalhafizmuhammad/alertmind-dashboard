'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { GitCommit, Clock } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function History() {
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

  function severityBg(label: string) {
    if (label === 'P1') return 'bg-red-500/10 text-red-400 border-red-500/20'
    if (label === 'P2') return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  }

  function timeAgo(date: string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Alert History</h1>
        <p className="text-gray-400 mt-1">Complete log of all alerts</p>
      </div>

      <div className="bg-white/3 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider">Severity</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider">Service</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider">Guilty Commit</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider">Confidence</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, i) => (
              <tr key={alert.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${i % 2 === 0 ? '' : 'bg-white/1'}`}>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${severityBg(alert.severity_label)}`}>
                    {alert.severity_label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium">{alert.service}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{alert.metric} · {alert.value}</td>
                <td className="px-4 py-3">
                  {alert.guilty_commit ? (
                    <div className="flex items-center gap-1.5">
                      <GitCommit size={12} className="text-yellow-500" />
                      <code className="text-yellow-400 text-xs">{alert.guilty_commit}</code>
                      <span className="text-gray-500 text-xs">by {alert.guilty_author}</span>
                    </div>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${
                    alert.confidence === 'high' ? 'text-emerald-400' :
                    alert.confidence === 'medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {alert.confidence?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock size={11} />
                    {timeAgo(alert.created_at)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
