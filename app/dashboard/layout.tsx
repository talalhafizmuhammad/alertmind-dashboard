'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Zap, LayoutDashboard, BarChart3, Clock, DollarSign, Settings } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Clock, label: 'History', href: '/dashboard/history' },
  { icon: DollarSign, label: 'Pricing', href: '/pricing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/5 flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shrink-0">
              <Zap size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">AlertMind</p>
              <p className="text-xs text-emerald-400 mt-0.5">● Live</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  active
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3">
            <UserButton />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56">
        {children}
      </main>
    </div>
  )
}
