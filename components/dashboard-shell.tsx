"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { BalanceCard } from "@/components/balance-card"
import { RecentContacts } from "@/components/recent-contacts"
import { TransactionsTable } from "@/components/transactions-table"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { ExchangeCard } from "@/components/exchange-card"
import { DialogPortalContainerProvider } from "@/components/ui/dialog"
import { Map } from "@/components/ui/map"
import { GlobeDemo, GlobeDemoContrast } from "./globe-card"
import { HoverFeatureCard } from "./hover-featured-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquareAddIcon } from "@hugeicons/core-free-icons"

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

  const dialogPortalContainerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="h-svh bg-sidebar py-3 p-3 md:pl-0">
      <div className="flex h-full overflow-hidden bg-sidebar z-50">
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        <main
          ref={dialogPortalContainerRef}
          className="relative flex-1 max-lg:min-w-full overflow-y-auto rounded-3xl bg-background pb-5 md:pb-6 no-scrollbar"
        >
          <DialogPortalContainerProvider container={dialogPortalContainerRef}>
            <Topbar collapsed={collapsed} onToggle={toggle} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 px-2 md:px-3 pt-3">
              <div className="flex flex-col gap-4 xl:col-span-3">
                <BalanceCard />
                <AnalyticsPanel />
                {/* <RecentContacts /> */}
              </div>

              <div className="xl:col-span-6">
                <TransactionsTable />
              </div>

              <div className="flex flex-col gap-4 xl:col-span-3">
                {/* <div className="relative mx-auto h-60 w-full max-w-150 overflow-hidden rounded-2xl shadow-sm">
                  <GlobeDemoContrast />
                </div> */}
                {/* <ExchangeCard /> */}
                <RecentContacts />
                <HoverFeatureCard item={{ 
                  name: "Tip of the day", 
                  description: "Press Ctrl + F to quickly search for anything in Payflow.",
                  img: "https://ui.unlumen.com/blocks.png", 
                  imgLight: "https://ui.unlumen.com/blocks-light.png",
                  imgClassName: "h-auto absolute -bottom-10 left-1/2 -translate-x-1/2 w-80",
                  fadeBottom: true,
                  containerClassName: "rounded-3xl bg-gradient-to-b from-[#ebbd57]/70 to-[#ebbd57] dark:from-[#ebbd57]/80 dark:to-[#ebbd57]/20",
                
                }} />

                <button className="flex items-center justify-center gap-2 rounded-3xl border border-dashed border-foreground/20 py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
                  <HugeiconsIcon icon={DashboardSquareAddIcon} className="size-4" />
                  Add or Manage widgets
                </button>
                
              </div>
            </div>
          </DialogPortalContainerProvider>
        </main>
      </div>
    </div>
  )
}
