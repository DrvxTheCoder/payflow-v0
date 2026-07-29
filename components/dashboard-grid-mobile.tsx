"use client"

import { BalanceCard } from "@/components/widgets/balance-card"
import { ActionsCard } from "@/components/widgets/actions-card"
import { TransactionsTable } from "@/components/widgets/transactions-table"
import { AnalyticsPanel } from "@/components/widgets/analytics-panel"
import { FeaturedCardSlider } from "@/components/widgets/featured-card-slider"
import { FeatureTipCard } from "@/components/widgets/feature-tip-card"
import { GlobeDemoContrast } from "@/components/widgets/globe-card"
import { VisaLogo } from "@/components/widgets/add-card-dialog"
import { Separator } from "@/components/ui/separator"

/**
 * Mobile dashboard.
 *
 * Deliberately not GridStack: widget rearranging is desktop-only, and a plain
 * stack lets each card size to its own content instead of being quantised to
 * GridStack's 40px cell height. Spendings and Monthly Limit are dropped here —
 * both are dense charts that don't survive a 390px column.
 */
export function DashboardGridMobile() {
  return (
    <div className="flex flex-col gap-3 px-4 pt-3">
      <BalanceCard />
      {/* <ActionsCard /> */}
      <TransactionsTable />
      <AnalyticsPanel />
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
          <GlobeDemoContrast key="three" />,
        ]}
        showDots={false}
        showArrows={true}
      />
    </div>
  )
}
