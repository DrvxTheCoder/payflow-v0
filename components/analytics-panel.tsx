"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { expensesData, incomeData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { BarXAxis } from "@/components/charts/bar-x-axis"
import { Grid } from "@/components/charts/grid"
import { BarChart } from "@/components/charts/bar-chart"
import { Bar } from "@/components/charts/bar"
import { ChartTooltip } from "@/components/charts/tooltip"
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
    label: "Expenses",
    amount: "$72,421",
    decimals: ".84",
    badge: "-8% vs Prev year",
    positive: false,
    data: expensesData,
    color: "var(--chart-1)",
  },
  {
    value: "income",
    label: "Income",
    amount: "$98,248",
    decimals: ".44",
    badge: "+14% vs Prev year",
    positive: true,
    data: incomeData,
    color: "var(--chart-3)",
  },
]

export function AnalyticsPanel() {
  const [activeTab, setActiveTab] = useState("expenses")
  const tab = tabs.find((t) => t.value === activeTab)!

  return (
    <div className="rounded-3xl bg-card p-8 pt-4 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-5">
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
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
                  "rounded-md px-1.5 py-0.5 text-xs font-medium",
                  tab.positive
                    ? "bg-success-muted text-success-muted-foreground"
                    : "bg-destructive-muted text-destructive-muted-foreground",
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
