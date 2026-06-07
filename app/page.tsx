'use client'

import { useRouter } from 'next/navigation'
import { Zap, GitCommit, Bell, BarChart3, Shield, Clock, ChevronRight, Check } from 'lucide-react'

export default function Landing() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AlertMind</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-red-400 text-sm mb-8">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          AI-powered on-call assistant
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Stop waking up at<br />
          <span className="text-red-400">3 AM</span> confused.
        </h1>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          AlertMind receives your server alerts, fetches real GitHub commit history,
          identifies the guilty commit and author using AI, and posts a diagnosis
          to Slack in under 60 seconds.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Open Dashboard <ChevronRight size={16} />
          </button>
          
            href="/pricing"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            View Pricing
          </a>
        </div>
      </section>

      {/* Slack message demo */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-[#1a1d21] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-semibold">AlertMind</span>
            <span className="text-gray-500 text-sm">3:44 AM</span>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <p className="font-bold text-red-400 mb-1">🚨 P1 Alert — api-service (prod)</p>
            <p className="text-gray-300 text-sm mb-3">CPU hit 94% at 3:44 AM</p>
            <p className="text-gray-400 text-sm mb-1"><span className="text-white font-medium">Most likely cause:</span></p>
            <p className="text-gray-300 text-sm mb-3">Commit <code className="bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">57040e2</code> by <strong>Talal</strong> removed a DB index on orders.user_id causing full table scans.</p>
            <p className="text-gray-400 text-sm mb-1"><span className="text-white font-medium">Suggested fix:</span></p>
            <code className="block bg-black/40 text-emerald-400 text-sm p-3 rounded-lg mb-4">
              Revert deploy #247 and re-add the missing index on orders.user_id
            </code>
            <div className="flex gap-2">
              <button className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg">✅ Acknowledge</button>
              <button className="bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg">🔇 Snooze 30min</button>
              <button className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg">✅ Resolve</button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
        <p className="text-gray-400 text-center mb-12">From alert to diagnosis in under 60 seconds</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {[
            { icon: Bell, label: "Alert fires", sub: "PagerDuty / OpsGenie" },
            { icon: GitCommit, label: "Fetch commits", sub: "Real GitHub history" },
            { icon: Zap, label: "AI analysis", sub: "LLM correlates cause" },
            { icon: Shield, label: "Slack message", sub: "Diagnosis + fix" },
            { icon: Check, label: "Engineer acts", sub: "In under 2 mins" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-3">
                <step.icon size={20} className="text-white" />
              </div>
              <p className="font-medium text-sm">{step.label}</p>
              <p className="text-gray-500 text-xs mt-1">{step.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: GitCommit, title: "Guilty Commit Detection", desc: "Fetches real GitHub commit history and identifies the exact commit SHA and author that caused the alert." },
            { icon: Bell, title: "Slack Interactive Buttons", desc: "Acknowledge, Snooze, or Resolve alerts directly in Slack. Message updates in place — no context switching." },
            { icon: BarChart3, title: "Real-time Dashboard", desc: "Live alert feed with search, severity filters, confidence scoring, and deploy correlation tracking." },
            { icon: Shield, title: "Duplicate Suppression", desc: "Smart 10-minute deduplication window prevents alert spam while still catching new incidents." },
            { icon: Clock, title: "Slash Commands", desc: "Use /alertmind status and /alertmind history directly in Slack to query your alert history." },
            { icon: Zap, title: "Multi-alert Support", desc: "Handles CPU, memory, latency, error rate alerts — each with AI-powered root cause analysis." },
          ].map((f, i) => (
            <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4">
                <f.icon size={18} className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-4">Built with modern stack</h2>
        <p className="text-gray-400 text-center mb-10">Production-grade infrastructure from day one</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Supabase', 'Slack SDK', 'GitHub API', 'Gemini AI', 'Stripe', 'Docker', 'GitHub Actions', 'Vercel', 'Clerk'].map(t => (
            <span key={t} className="bg-white/5 border border-white/10 text-gray-300 text-sm px-4 py-2 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24 text-center">
        <div className="bg-white/3 border border-white/5 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to sleep through the night?</h2>
          <p className="text-gray-400 mb-8">Join engineering teams using AlertMind to cut MTTR from 20 minutes to under 2.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => router.push('/pricing')}
              className="bg-white text-black font-medium px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Get started
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-white/5 border border-white/10 text-white font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              View live demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm text-gray-400">AlertMind — Built by Hafiz Muhammad Talal</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="https://github.com/talalhafizmuhammad/alertmind-backend" target="_blank" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
