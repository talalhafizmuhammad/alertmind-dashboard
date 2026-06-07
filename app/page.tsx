'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { AlertTriangle, CheckCircle, Clock, GitCommit, RefreshCw, Search, Zap } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Alert {
  id: string
  service: string
  severity: string
  metric: string
  value: string
  alert_time: string
  most_likely_cause: string
  confidence: string
  suggested_fix: string
  severity_label: string
  deploy_correlated: boolean
  deployer: string
  guilty_commit: string
  guilty_author: string
  created_at: string
}

export default function Dashboard() {
  const { user } = useUser()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filtered, setFiltered] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let result = alerts
    if (search) {
      result = result.filter(a =>
        a.service.toLowerCase().includes(search.toLowerCase()) ||
        a.most_likely_cause?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (severityFilter !== 'ALL') {
      result = result.filter(a => a.severity_label === severityFilter)
    }
    setFiltered(result)
  }, [alerts, search, severityFilter])

  async function fetchAlerts() {
    setRefreshing(true)
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (!error) setAlerts(data || [])
    setLoading(false)
    setRefreshing(false)
  }

  function severityBg(label: string) {
    if (label === 'P1') return 'bg-red-500/10 text-red-400 border-red-500/20'
    if (label === 'P2') return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  }

  function confidenceColor(c: string) {
    if (c === 'high') return 'text-emerald-400'
    if (c === 'medium') return 'text-yellow-400'
    return 'text-red-400'
  }

  function timeAgo(date: string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const p1count = alerts.filter(a => a.severity_label === 'P1').length
  const deployCount = alerts.filter(a => a.deploy_correlated).length
  const commitCount = alerts.filter(a => a.guilty_commit).length

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AlertMind</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Live</span>
          </div>
          <a href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors mr-4">Pricing</a>
          <UserButton  />
          <button
            onClick={fetchAlerts}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/3 border border-white/5 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Alerts</p>
            <p className="text-3xl font-bold">{alerts.length}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
            <p className="text-red-400/70 text-xs uppercase tracking-wider mb-1">P1 Critical</p>
            <p className="text-3xl font-bold text-red-400">{p1count}</p>
          </div>
          <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4">
            <p className="text-orange-400/70 text-xs uppercase tracking-wider mb-1">Deploy Correlated</p>
            <p className="text-3xl font-bold text-orange-400">{deployCount}</p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
            <p className="text-blue-400/70 text-xs uppercase tracking-wider mb-1">Commits Identified</p>
            <p className="text-3xl font-bold text-blue-400">{commitCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by service or cause..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/3 border border-white/5 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-white/20"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'P1', 'P2', 'P3'].map(s => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  severityFilter === s
                    ? 'bg-white text-black'
                    : 'bg-white/3 border border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Alert List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-2/3 mb-2" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <AlertTriangle size={32} className="mx-auto mb-3 opacity-30" />
            <p>No alerts found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(alert => (
              <div key={alert.id} className="bg-white/3 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${severityBg(alert.severity_label)}`}>
                      {alert.severity_label}
                    </span>
                    <span className="font-semibold text-white">{alert.service}</span>
                    <span className="text-gray-500 text-sm">{alert.metric} · {alert.value}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs shrink-0">
                    <Clock size={11} />
                    {timeAgo(alert.created_at)}
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-3 leading-relaxed">{alert.most_likely_cause}</p>

                {alert.guilty_commit && (
                  <div className="flex items-center gap-2 mb-3">
                    <GitCommit size={13} className="text-yellow-500" />
                    <code className="text-yellow-400 text-xs bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
                      {alert.guilty_commit}
                    </code>
                    <span className="text-gray-500 text-xs">by</span>
                    <span className="text-gray-300 text-xs font-medium">{alert.guilty_author}</span>
                  </div>
                )}

                <div className="bg-black/30 border border-white/5 rounded-lg p-3 mb-3">
                  <p className="text-emerald-400 text-xs font-mono">{alert.suggested_fix}</p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className={`font-medium ${confidenceColor(alert.confidence)}`}>
                    {alert.confidence?.toUpperCase()} confidence
                  </span>
                  {alert.deploy_correlated && (
                    <span className="flex items-center gap-1 text-blue-400">
                      <CheckCircle size={11} />
                      Deploy correlated
                    </span>
                  )}
                  {alert.deployer && (
                    <span className="text-gray-600">{alert.deployer}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
