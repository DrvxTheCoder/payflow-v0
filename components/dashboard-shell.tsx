"use client"

import { useLayoutEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { BalanceCard } from "@/components/balance-card"
import { RecentContacts } from "@/components/recent-contacts"
import { TransactionsTable } from "@/components/transactions-table"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { ExchangeCard } from "@/components/exchange-card"
import { Map } from "@/components/ui/map"
import { GlobeDemo, GlobeDemoContrast } from "./globe-card"

const MOBILE_QUERY = "(max-width: 1024px)"
const COOKIE_NAME = "sidebar-collapsed"

function readSidebarCookie(): boolean | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return match ? match[1] === "true" : null
}

function saveSidebarCookie(collapsed: boolean) {
  document.cookie = `${COOKIE_NAME}=${collapsed}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}

export function DashboardShell() {
  // Always start collapsed — prevents hydration mismatch between SSR and client.
  // useLayoutEffect corrects the state before first paint, so there's no visible flash.
  const [collapsed, setCollapsed] = useState(true)

  useLayoutEffect(() => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches
    if (isMobile) {
      // Mobile always stays collapsed — never persist or restore from cookie
      setCollapsed(true)
    } else {
      // Desktop: restore the last known state from cookie
      const saved = readSidebarCookie()
      if (saved !== null) setCollapsed(saved)
    }
  }, [])

  const toggle = () => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches
    setCollapsed(prev => {
      const next = !prev
      if (!isMobile) saveSidebarCookie(next)
      return next
    })
  }

  return (
    <div className="h-svh bg-sidebar py-3 p-3 md:pl-0">
      <div className="flex h-full overflow-hidden rounded-[2.5rem] bg-sidebar">
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        <main className="flex-1 max-lg:min-w-full overflow-y-auto rounded-3xl bg-background pb-5 md:pb-6 no-scrollbar">
          <Topbar collapsed={collapsed} onToggle={toggle} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 px-4 md:px-6 pt-3">
            <div className="flex flex-col gap-4 xl:col-span-3">
              <BalanceCard />
              <AnalyticsPanel />
              {/* <RecentContacts /> */}
            </div>

            <div className="xl:col-span-6">
              <TransactionsTable />
            </div>

            <div className="flex flex-col gap-4 xl:col-span-3">
              <div className="relative mx-auto h-60 w-full max-w-150 overflow-hidden rounded-2xl shadow-sm">
                {/* <GlobeDemo /> */}
                <GlobeDemoContrast />
              </div>
              <ExchangeCard />
            </div>
            
          </div>
        </main>
      </div>
    </div>
  )
}
