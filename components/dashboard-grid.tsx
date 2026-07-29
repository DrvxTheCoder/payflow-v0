"use client"

import { useEffect, useRef } from "react"
import { GridStack } from "gridstack"
import "gridstack/dist/gridstack.min.css"
import { BalanceCard } from "@/components/widgets/balance-card"
import { RecentContacts } from "@/components/widgets/recent-contacts"
import { TransactionsTable } from "@/components/widgets/transactions-table"
import { AnalyticsPanel } from "@/components/widgets/analytics-panel"
import { FeaturedCardSlider } from "@/components/widgets/featured-card-slider"
import { GlobeDemoContrast } from "@/components/widgets/globe-card"
import MonthlyLimitCard from "@/components/widgets/monthly-limit-card"
import SpendingDataChart from "@/components/widgets/spendings-card"
import { FeatureTipCard } from "@/components/widgets/feature-tip-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquareAddIcon } from "@hugeicons/core-free-icons"
import { VisaLogo } from "@/components/widgets/add-card-dialog"
import { Separator } from "@/components/ui/separator"
import { useWidgetEdit } from "@/components/widget-edit-context"
import { ActionsCard } from "@/components/widgets/actions-card"
import { DashboardGridMobile } from "@/components/dashboard-grid-mobile"
import { useMediaQuery } from "@/hooks/use-media-query"

const MOBILE_QUERY = "(max-width: 1024px)"

/**
 * Desktop dashboard. Below lg the app renders `DashboardGridMobile` instead —
 * see the `DashboardGrid` switcher at the bottom of this file.
 */
function DashboardGridDesktop() {
  const { isEditing, setIsEditing, registerGrid } = useWidgetEdit()

  const gridRef = useRef<HTMLDivElement>(null)
  const gridInstanceRef = useRef<GridStack | null>(null)

  // Tell the shell a grid is on screen so the Topbar can show its edit toggle
  useEffect(() => registerGrid(), [registerGrid])

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

  return (
    <>
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
          <div className="grid-stack-item-content shadow-md">
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
          <div className="grid-stack-item-content shadow-md">
            <AnalyticsPanel />
          </div>
        </div>

        {/* Spendings Chart */}
        <div
          className="grid-stack-item"
          gs-w="2" gs-h="4"
          gs-min-w="2" gs-min-h="4"
          gs-x="0" gs-y="14"
        >
          <div className="grid-stack-item-content shadow-md">
            <SpendingDataChart variant="advanced" />
          </div>
        </div>

        <div
          className="grid-stack-item"
          gs-w="1" gs-h="4"
          gs-min-w="1" gs-min-h="4"
          gs-x="2" gs-y="21"
        >
          <div className="grid-stack-item-content shadow-md">
            <MonthlyLimitCard />
          </div>
        </div>

        {/* --- CENTER COLUMN --- */}
        {/* Transactions Table */}
        <div
          className="grid-stack-item"
          gs-w="6" gs-h="18"
          gs-min-w="3" gs-min-h="14" gs-max-h="20"
          gs-x="3" gs-y="0"
        >
          <div className="grid-stack-item-content shadow-md">
            <TransactionsTable />
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        {/* Recent Contacts */}
        <div
          className="grid-stack-item"
          gs-w="3" gs-h="7"
          gs-min-w="3" gs-min-h="7"
          gs-x="9" gs-y="0"
        >
          <div className="grid-stack-item-content shadow-md">
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
            <FeaturedCardSlider
              duration={10}
              slides={[
                <FeatureTipCard key="one"
                  item={{
                    name: <span className="flex flex-row justify-center items-center gap-1 mb-2"><p className="text-xl tracking-tight font-heading font-black text-black text-shadow-md">payflow<small className="text-xs align-super">™</small></p> <Separator orientation="vertical" className="mx-2 border-l border-white" /> <VisaLogo className="h-6 w-auto" /></span>,
                    description : <small className="text-xs md:text-sm font-medium text-white italic text-shadow-md">Pay from anywhere, anytime.</small>,
                    mediaSrc: "/demos/card-hand-demo.png",
                    mediaClassName: "w-full md:w-1/2 lg:w-full h-auto absolute -left-1 md:left-50 lg:-left-1 -bottom-8 animate-reveal",
                    fadeBottom: true,
                  }}
                />,
                // The Widget Mode tip used to live here. It's now a one-time,
                // dismissible element anchored to the button it describes —
                // see components/widget-mode-tip.tsx.
                <GlobeDemoContrast key="three" />,

              ]}
              showDots={false}
              showArrows={true}
            />
          </div>
        </div>

        {/* Add Widget Button (Fixed non-draggable utility item) */}
        <div
          className="grid-stack-item"
          gs-w="1" gs-h="4"
          gs-min-w="1" gs-min-h="2"
          gs-x="9" gs-y="14"
          gs-no-drag="false" gs-no-resize="true"
        >
          <div className="grid-stack-item-content">
            <button className="cursor-pointer flex flex-col w-full h-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-foreground/10 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
              <HugeiconsIcon icon={DashboardSquareAddIcon} className="size-6" />
              Add widget
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

/**
 * Picks the layout for the current viewport. The two grids are mounted
 * exclusively rather than hidden with CSS, so GridStack never initialises
 * against a display:none container.
 */
export function DashboardGrid() {
  const isMobile = useMediaQuery(MOBILE_QUERY)

  // Unknown until mounted — render nothing rather than flash the wrong layout
  if (isMobile === null) return null

  return isMobile ? <DashboardGridMobile /> : <DashboardGridDesktop />
}
