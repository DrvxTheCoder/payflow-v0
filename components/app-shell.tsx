"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { BottomNav } from "@/components/bottom-nav"
import { DialogPortalContainerProvider } from "@/components/ui/dialog"
import { WidgetEditProvider } from "@/components/widget-edit-context"
import { PaymentFlowProvider } from "@/components/payment-flow/payment-flow-provider"

const MOBILE_QUERY = "(max-width: 1024px)"
const COOKIE_NAME = "sidebar-collapsed"

function readSidebarCookie(): boolean | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return match ? match[1] === "true" : null
}

function saveSidebarCookie(collapsed: boolean) {
  document.cookie = `${COOKIE_NAME}=${collapsed}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true)

  const dialogPortalContainerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches
    if (isMobile) {
      setCollapsed(true)
    } else {
      const saved = readSidebarCookie()
      if (saved !== null) setCollapsed(saved)
    }
  }, [])

  const toggleSidebar = () => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches
    setCollapsed(prev => {
      const next = !prev
      if (!isMobile) saveSidebarCookie(next)
      return next
    })
  }

  return (
    <div className="h-svh bg-sidebar md:p-3 lg:pl-0">
      <WidgetEditProvider>
        <div className="flex h-full overflow-hidden bg-sidebar z-50">
          <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

          <main
            ref={dialogPortalContainerRef}
            /* Bottom padding below lg clears the floating nav pill (32px offset +
               ~80px pill) plus the scan FAB that sits 80px above it, so the last
               row of any page can scroll past both. */
            className="md:rounded-3xl relative flex-1 max-lg:min-w-full overflow-y-auto bg-background pb-[calc(12rem+env(safe-area-inset-bottom))] lg:pb-0 no-scrollbar"
          >
            <DialogPortalContainerProvider container={dialogPortalContainerRef}>
              <Topbar collapsed={collapsed} onToggle={toggleSidebar} />

              {children}

              {/* Wraps only the nav that triggers it; the overlay itself
                  portals to <body> so <main> can't clip it. */}
              <PaymentFlowProvider>
                <BottomNav />
              </PaymentFlowProvider>
            </DialogPortalContainerProvider>
          </main>
        </div>
      </WidgetEditProvider>
    </div>
  )
}
