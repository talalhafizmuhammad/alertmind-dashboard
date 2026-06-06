'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchAlerts() {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) console.error(error)
    else setAlerts(data || [])
    setLoading(false)
  }

  function severityColor(label: string) {
    if (label === 'P1') return 'bg-red-500'
    if (label === 'P2') return 'bg-orange-500'
    return 'bg-yellow-500'
  }

  function confidenceColor(c: string) {
    if (c === 'high') return 'text-green-400'
    if (c === 'medium') return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">AlertMind</h1>
            <p className="text-gray-400 mt-1">On-call AI for engineering teams</p>
          </div>
          <button
            onClick={fetchAlerts}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm border border-gray-700"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Alerts</p>
            <p className="text-2xl font-bold">{alerts.length}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">P1 Alerts</p>
            <p className="text-2xl font-bold text-red-400">
              {alerts.filter(a => a.severity_label === 'P1').length}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Deploy Correlated</p>
            <p className="text-2xl font-bold text-orange-400">
              {alerts.filter(a => a.deploy_correlated).length}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Commits Identified</p>
            <p className="text-2xl font-bold text-blue-400">
              {alerts.filter(a => a.guilty_commit).length}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading alerts...</p>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-gray-900 rounded-lg p-5 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`${severityColor(alert.severity_label)} text-white text-xs font-bold px-2 py-1 rounded`}>
                      {alert.severity_label}
                    </span>
                    <span className="font-semibold">{alert.service}</span>
                    <span className="text-gray-400 text-sm">{alert.metric} · {alert.value}</span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(alert.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{alert.most_likely_cause}</p>
                {alert.guilty_commit && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 text-xs">Guilty commit:</span>
                    <code className="bg-gray-800 text-yellow-400 text-xs px-2 py-1 rounded">
                      {alert.guilty_commit}
                    </code>
                    <span className="text-gray-400 text-xs">by</span>
                    <span className="text-white text-xs font-medium">{alert.guilty_author}</span>
                  </div>
                )}
                <code className="block bg-gray-800 text-green-400 text-sm p-2 rounded mb-2">
                  {alert.suggested_fix}
                </code>
                <div className="flex gap-2 text-xs">
                  <span className={`font-medium ${confidenceColor(alert.confidence)}`}>
                    Confidence: {alert.confidence?.toUpperCase()}
                  </span>
                  {alert.deploy_correlated && (
                    <span className="text-blue-400">· Deploy correlated</span>
                  )}
                  {alert.deployer && (
                    <span className="text-gray-400">· {alert.deployer}</span>
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
