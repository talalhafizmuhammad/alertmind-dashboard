'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Save, Copy, Check, Bell, Webhook, Globe, MessageSquare } from 'lucide-react'

export default function Settings() {
  const { user } = useUser()
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [repoMappings, setRepoMappings] = useState([
    { service: 'api-service (prod)', repo: 'alertmind' },
    { service: 'auth-service (prod)', repo: 'alertmind' },
    { service: 'payment-service (prod)', repo: 'alertmind' },
    { service: 'checkout-service (prod)', repo: 'alertmind' },
  ])
  const [settings, setSettings] = useState({
    notifyP1Only: true,
    notifyOnResolve: false,
    githubRepo: 'alertmind',
    slackChannel: '#alert',
    emailNotifications: false,
  })

  const webhookUrl = 'https://alertmind-backend.vercel.app/webhook/alert'

  function copyWebhook() {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function saveSettings() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="px-6 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-1">Configure your AlertMind workspace</p>
      </div>

      {/* Profile */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">👤</div>
          Profile
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Name</p>
            <p className="text-sm text-white">{user?.fullName || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm text-white">{user?.emailAddresses[0]?.emailAddress || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Plan</p>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full">Free</span>
          </div>
        </div>
      </div>

      {/* Webhook URL */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <Webhook size={16} />
          Webhook URL
        </h2>
        <p className="text-gray-500 text-sm mb-4">Connect PagerDuty, OpsGenie, or any monitoring tool to this URL</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-emerald-400 font-mono truncate">
            {webhookUrl}
          </code>
          <button
            onClick={copyWebhook}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {['PagerDuty', 'OpsGenie', 'Datadog', 'Grafana', 'Prometheus', 'CloudWatch'].map(tool => (
            <div key={tool} className="bg-white/3 border border-white/5 rounded-lg px-3 py-2 text-xs text-gray-400 text-center">
              {tool}
            </div>
          ))}
        </div>
      </div>

      {/* GitHub */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <Globe size={16} />
          GitHub Integration
        </h2>
        <p className="text-gray-500 text-sm mb-4">Repository mapped for commit correlation</p>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Default repository</label>
          <input
            type="text"
            value={settings.githubRepo}
            onChange={e => setSettings({...settings, githubRepo: e.target.value})}
            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <Bell size={16} />
          Notifications
        </h2>
        <p className="text-gray-500 text-sm mb-4">Control when and how you get notified</p>
        <div className="space-y-4">
          {[
            { key: 'notifyP1Only', label: 'P1 alerts only', desc: 'Only notify for critical P1 alerts' },
            { key: 'notifyOnResolve', label: 'Notify on resolve', desc: 'Send confirmation when alert is resolved' },
            { key: 'emailNotifications', label: 'Email notifications', desc: 'Backup email in addition to Slack' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings({...settings, [item.key]: !settings[item.key as keyof typeof settings]})}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings[item.key as keyof typeof settings] ? 'bg-emerald-500' : 'bg-white/10'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Slack */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <MessageSquare size={16} />
          Slack Integration
        </h2>
        <p className="text-gray-500 text-sm mb-4">Configure your Slack alert channel</p>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Alert channel</label>
          <input
            type="text"
            value={settings.slackChannel}
            onChange={e => setSettings({...settings, slackChannel: e.target.value})}
            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* Repo Mappings */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <Globe size={16} />
          GitHub Repo Mappings
        </h2>
        <p className="text-gray-500 text-sm mb-4">Map each service to its GitHub repository for commit correlation</p>
        <div className="space-y-2 mb-4">
          {repoMappings.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={m.service}
                onChange={e => {
                  const updated = [...repoMappings]
                  updated[i].service = e.target.value
                  setRepoMappings(updated)
                }}
                className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-white/20"
                placeholder="service name"
              />
              <span className="text-gray-600">→</span>
              <input
                type="text"
                value={m.repo}
                onChange={e => {
                  const updated = [...repoMappings]
                  updated[i].repo = e.target.value
                  setRepoMappings(updated)
                }}
                className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-white/20"
                placeholder="repo name"
              />
              <button
                onClick={() => setRepoMappings(repoMappings.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-300 text-xs px-2"
              >✕</button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setRepoMappings([...repoMappings, { service: '', repo: '' }])}
          className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add mapping
        </button>
      </div>

      <button
        onClick={saveSettings}
        className="flex items-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
      >
        {saved ? <Check size={16} className="text-emerald-600" /> : <Save size={16} />}
        {saved ? 'Saved!' : 'Save settings'}
      </button>
    </div>
  )
}
