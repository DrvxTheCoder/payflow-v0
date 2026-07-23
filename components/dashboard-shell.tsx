"use client"

import { useLayoutEffect, useRef, useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { BalanceCard } from "@/components/balance-card"
import { RecentContacts } from "@/components/recent-contacts"
import { TransactionsTable } from "@/components/transactions-table"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { DialogPortalContainerProvider } from "@/components/ui/dialog"
import { FeatureTipCard } from "./feature-tip-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquareAddIcon, DashboardSquareEditIcon } from "@hugeicons/core-free-icons"

import { GridStack } from "gridstack"
import "gridstack/dist/gridstack.min.css"
import { FeaturedCardSlider } from "./featured-card-slider"
import { GlobeDemo, GlobeDemoContrast } from "./globe-card"
import { Button } from "./ui/button"

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
  const [collapsed, setCollapsed] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const dialogPortalContainerRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const gridInstanceRef = useRef<GridStack | null>(null)

  useLayoutEffect(() => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches
    if (isMobile) {
      setCollapsed(true)
    } else {
      const saved = readSidebarCookie()
      if (saved !== null) setCollapsed(saved)
    }
  }, [])

  useEffect(() => {
    if (!gridRef.current) return

    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const isMobile = mediaQuery.matches

    const grid = GridStack.init(
      {
        column: isMobile ? 1 : 12,
        cellHeight: 40,
        margin: 6,
        float: false,
        animate: true,
        disableResize: true,
        staticGrid: isMobile || !isEditing, // Lock layout by default on desktop
      },
      gridRef.current
    )

    gridInstanceRef.current = grid

    const handleMediaChange = (e: MediaQueryListEvent) => {
      const mobile = e.matches
      if (mobile) {
        setIsEditing(false)
        grid?.setStatic(true)
        grid?.column(1)
      } else {
        grid?.column(12)
        grid?.setStatic(!isEditing)
        grid?.enableMove(isEditing)
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange)
    } else {
      mediaQuery.addListener(handleMediaChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange)
      } else {
        mediaQuery.removeListener(handleMediaChange)
      }
      gridInstanceRef.current = null
      grid?.destroy(false)
    }
  }, [])

  // Sync dynamic edit mode state with GridStack instance
  useEffect(() => {
    if (!gridInstanceRef.current) return
    const isMobile = window.matchMedia(MOBILE_QUERY).matches

    if (!isMobile) {
      gridInstanceRef.current.setStatic(!isEditing)
      gridInstanceRef.current.enableMove(isEditing)
    }
  }, [isEditing])

  const toggleSidebar = () => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches
    setCollapsed(prev => {
      const next = !prev
      if (!isMobile) saveSidebarCookie(next)
      return next
    })
  }

  const toggleEditMode = () => {
    setIsEditing(prev => !prev)
  }

  return (
    <div className="h-svh bg-sidebar md:p-3 lg:pl-0">
      {/* Dynamic Styles for iOS Wobble, Dragging Cursors, and Interaction Locks */}
      <style jsx global>{`
        @keyframes ios-wobble-even {
          0% { transform: rotate(-0.2deg) translateY(0px); }
          50% { transform: rotate(0.2deg) translateY(-0.5px); }
          100% { transform: rotate(-0.2deg) translateY(0px); }
        }

        @keyframes ios-wobble-odd {
          0% { transform: rotate(0.2deg) translateY(-0.2px); }
          50% { transform: rotate(-0.2deg) translateY(0px); }
          100% { transform: rotate(0.2deg) translateY(-0.2px); }
        }

        /* Wobble & Grab Cursor Styles during Edit Mode */
        .grid-stack-editing .grid-stack-item:not([gs-no-drag="true"]) > .grid-stack-item-content {
          animation: ios-wobble-even 0.28s ease-in-out infinite;
          cursor: grab;
          user-select: none;
        }

        .grid-stack-editing .grid-stack-item:not([gs-no-drag="true"]):nth-child(odd) > .grid-stack-item-content {
          animation-name: ios-wobble-odd;
          animation-duration: 0.32s;
        }

        /* Disable all child element interactions inside draggable widgets while editing */
        .grid-stack-editing .grid-stack-item:not([gs-no-drag="true"]) > .grid-stack-item-content * {
          pointer-events: none;
        }

        /* Pause wobble animation when widget is being dragged */
        .grid-stack-editing .grid-stack-item > .grid-stack-item-content:active,
        .grid-stack-editing .grid-stack-item.ui-draggable-dragging > .grid-stack-item-content,
        .grid-stack-editing .grid-stack-item.grid-stack-item-dragging > .grid-stack-item-content {
          animation: none !important;
        }

        /* Force 'grabbing' cursor globally across the entire viewport while any item is being dragged */
        body:has(.grid-stack-placeholder),
        body:has(.grid-stack-item-dragging),
        body:has(.ui-draggable-dragging),
        body:has(.grid-stack-placeholder) *,
        body:has(.grid-stack-item-dragging) *,
        body:has(.ui-draggable-dragging) * {
          cursor: grabbing !important;
        }
      `}</style>

      <div className="flex h-full overflow-hidden bg-sidebar z-50">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

        <main
          ref={dialogPortalContainerRef}
          className="md:rounded-3xl relative flex-1 max-lg:min-w-full overflow-y-auto bg-background pb-5 md:pb-6 no-scrollbar"
        >
          <DialogPortalContainerProvider container={dialogPortalContainerRef}>
            <Topbar
              collapsed={collapsed}
              onToggle={toggleSidebar}
              isEditingWidget={isEditing}
              onToggleEditWidget={toggleEditMode}
            />

            <div
              ref={gridRef}
              className={`mx-2 grid-stack px-2 md:px-3 pt-3 ${isEditing ? "grid-stack-editing" : ""}`}
            >
              {/* --- LEFT COLUMN --- */}
              {/* Balance Card */}
              <div
                className="grid-stack-item"
                gs-w="3" gs-h="7"
                gs-min-w="3" gs-min-h="7"
                gs-x="0" gs-y="0"
              >
                <div className="grid-stack-item-content">
                  <BalanceCard />
                </div>
              </div>

              {/* Analytics Panel */}
              <div
                className="grid-stack-item"
                gs-w="3" gs-h="7"
                gs-min-w="3" gs-min-h="7"
                gs-x="0" gs-y="7"
              >
                <div className="grid-stack-item-content">
                  <AnalyticsPanel />
                </div>
              </div>

              {/* --- CENTER COLUMN --- */}
              {/* Transactions Table */}
              <div
                className="grid-stack-item"
                gs-w="6" gs-h="20"
                gs-min-w="3" gs-min-h="14" gs-max-h="20"
                gs-x="3" gs-y="0"
              >
                <div className="grid-stack-item-content">
                  <TransactionsTable />
                </div>
              </div>

              {/* --- RIGHT COLUMN --- */}
              {/* Recent Contacts */}
              <div
                className="grid-stack-item"
                gs-w="3" gs-h="6"
                gs-min-w="3" gs-min-h="6"
                gs-x="9" gs-y="0"
              >
                <div className="grid-stack-item-content">
                  <RecentContacts />
                </div>
              </div>

              {/* Hover Feature Card */}
              <div
                className="grid-stack-item"
                gs-w="3" gs-h="7"
                gs-min-w="3" gs-min-h="7"
                gs-x="9" gs-y="6"
              >
                <div className="grid-stack-item-content">
                  {/* <HoverFeatureCard
                    item={{ 
                      name: "Widget Mode is here! ", 
                      description: "Click the widget icon in the top right corner to drag and arrange widgets to your liking.",
                      img: "/demos/widget-mode-demo.webp", 
                      // imgLight: "https://ui.unlumen.com/blocks-light.png",
                      imgClassName: "h-auto absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 rounded-lg",
                      fadeBottom: true,
                      containerClassName: "rounded-3xl bg-gradient-to-b from-[#ebbd57]/70 to-[#ebbd57] dark:from-[#ebbd57] dark:to-[#ebbd57]/80",
                    }} 
                  /> */}

                  <FeaturedCardSlider
                      slides={[
                        <FeatureTipCard key="one" 
                          item={{ 
                            // name: "Widget Mode now available !", 
                            description: <>
                                          <span className="flex flex-row justify-center items-center text-xs md:text-sm font-medium text-white">
                                            Click the
                                            <div className="flex justify-center items-center mx-1 rounded-full border border-white/50 bg-white/20 size-7">
                                              <HugeiconsIcon icon={DashboardSquareEditIcon} className="size-3 text-white" />
                                            </div> 
                                            icon in the top right corner to try
                                          </span> 
                                          <b className="text-lg font-bold text-black">Widget Mode.</b>
                                        </>,
                            mediaSrc: "/demos/widget-mode-demo.mp4", 
                            mediaClassName: "h-auto w-80 absolute -bottom-15 left-1/2 -translate-x-1/2 rounded-lg border-3 border-black shadow-md",
                            containerClassName: "bg-[#ebbd57]",
                            fadeBottom: false
                          }}  
                        />,
                        <GlobeDemoContrast key="two" />,
                        
                      ]}
                      showDots={false}
                      showArrows={true}
                    />
                </div>
              </div>

              {/* Add Widget Button (Fixed non-draggable utility item) */}
              <div
                className="grid-stack-item"
                gs-w="3" gs-h="2"
                gs-min-w="3" gs-min-h="2"
                gs-x="9" gs-y="14"
                gs-no-drag="false" gs-no-resize="true"
              >
                <div className="grid-stack-item-content">
                  <button className="cursor-pointer flex w-full h-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-foreground/10 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
                    <HugeiconsIcon icon={DashboardSquareAddIcon} className="size-4" />
                    Add or Manage widgets
                  </button>
                </div>
              </div>

            </div>
          </DialogPortalContainerProvider>
        </main>
      </div>
    </div>
  )
}