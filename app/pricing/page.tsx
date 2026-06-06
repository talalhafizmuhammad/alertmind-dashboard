'use client'

import { useState } from 'react'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    id: 'solo',
    name: 'Solo Dev',
    price: 29,
    description: 'For freelancers running client infra alone',
    features: ['1 Slack workspace', '100 alerts/mo', 'CloudWatch + PagerDuty', 'Community support'],
    popular: false
  },
  {
    id: 'team',
    name: 'Team',
    price: 149,
    description: 'For engineering teams where MTTR is a KPI',
    features: ['Up to 20 engineers', 'Unlimited alerts', 'All integrations', 'Runbook auto-draft', 'Email support'],
    popular: true
  },
  {
    id: 'house',
    name: 'Software House',
    price: 299,
    description: 'For agencies managing 10+ client deployments',
    features: ['Unlimited teams', 'Multi-client workspaces', 'White-label option', 'Priority support', 'SLA'],
    popular: false
  }
]

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(planId: string) {
    setLoading(planId)
    try {
      const res = await fetch('https://alertmind-backend.vercel.app/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId })
      })
      const data = await res.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(null)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">AlertMind</span>
          <a href="/" className="ml-auto text-sm text-gray-400 hover:text-white transition-colors">Dashboard</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-400 text-lg">Stop waking up at 3 AM. Let AI handle the diagnosis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 border ${
                plan.popular
                  ? 'bg-white/5 border-white/20'
                  : 'bg-white/2 border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">\${plan.price}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                  plan.popular
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? 'Redirecting...' : 'Get started'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Need something bigger?{' '}
            <span className="text-gray-400">Enterprise plan with on-premise deploy, SSO, and dedicated support available.</span>
          </p>
        </div>
      </div>
    </main>
  )
}
