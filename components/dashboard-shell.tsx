"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { BalanceCard } from "@/components/balance-card"
import { RecentContacts } from "@/components/recent-contacts"
import { TransactionsTable } from "@/components/transactions-table"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { ExchangeCard } from "@/components/exchange-card"
import { Map } from "@/components/ui/map"

export function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => setCollapsed((c) => !c)

  useEffect(() => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setCollapsed(true)
    }
  }, [])

  return (
    <div className="h-svh bg-sidebar py-3 p-3 md:pl-0">
      <div className="flex h-full overflow-hidden rounded-[2.5rem] bg-sidebar">
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        <main className="flex-1 max-lg:min-w-full overflow-y-auto rounded-[2rem] bg-background pb-5 md:pb-6 no-scrollbar">
          <Topbar collapsed={collapsed} onToggle={toggle} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 px-4 md:px-6 pt-3">
            <div className="flex flex-col gap-4 xl:col-span-3">
              <BalanceCard />
              <RecentContacts />
              <div className="relative mx-auto h-50 w-full max-w-150 overflow-hidden rounded-xl border">
                <Map />
              </div>
            </div>

            <div className="xl:col-span-6">
              <TransactionsTable />
            </div>

            <div className="flex flex-col gap-4 xl:col-span-3">
              <AnalyticsPanel />
              <ExchangeCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
