"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { expensesData, incomeData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { BarXAxis } from "@/components/vendor/charts/bar-x-axis"
import { Grid } from "@/components/vendor/charts/grid"
import { BarChart } from "@/components/vendor/charts/bar-chart"
import { Bar } from "@/components/vendor/charts/bar"
import { ChartTooltip } from "@/components/vendor/charts/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/animated-tabs"

function MiniBarChart({
  data,
  color,
  gridLines,
}: {
  data: { month: string; value: number }[]
  color: string
  gridLines?: number
}) {
  return (
    <div className="w-full h-fit p-0">
      <BarChart
        data={data}
        xDataKey="month"
        animationDuration={1100}
        animationEasing="cubic-bezier(0.85, 0, 0.15, 1)"
        barGap={0.4}
        barWidth={20}
        className="px-0 h-36 w-full"
      >
        <Grid horizontal numTicksRows={gridLines} />
        <Bar dataKey="value" lineCap="round" fill={color} fadedOpacity={0.3} groupGap={4} />
        <BarXAxis />
        <ChartTooltip showCrosshair={false} showDots={true} />
      </BarChart>
    </div>
  )
}

const tabs = [
  {
    value: "expenses",
    label: "Sent",
    amount: "$72,421",
    decimals: ".84",
    badge: "-8% under last month",
    positive: true,
    data: expensesData,
    color: "var(--chart-1)",
  },
  {
    value: "income",
    label: "Received",
    amount: "$98,248",
    decimals: ".44",
    badge: "+14% over last month",
    positive: true,
    data: incomeData,
    color: "var(--chart-2)",
  },
]

export function AnalyticsPanel() {
  const [activeTab, setActiveTab] = useState("expenses")
  const tab = tabs.find((t) => t.value === activeTab)!

  return (
    <div className="rounded-3xl bg-card p-8 pt-4 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-5">
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className={cn( activeTab === t.value && "text-chart-1")}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <button
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="More options"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </Tabs>

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {tab.amount}
                <span className="text-muted-foreground/60">{tab.decimals}</span>
              </p>
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium",
                  tab.positive
                    ? "bg-green-100 dark:bg-green-500/5 text-success"
                    : "bg-red-100 dark:bg-red-500/5 text-destructive",
                )}
              >
                {tab.badge}
              </span>
            </div>
            <MiniBarChart data={tab.data} color={tab.color} gridLines={4} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
