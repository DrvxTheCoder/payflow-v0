"use client"

import { ResponsiveContainer } from "recharts"
import { MoreHorizontal } from "lucide-react"
import { expensesData, incomeData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid"
import { BarChart, BarChartProps } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { ChartTooltip } from "@/components/charts/tooltip"

function MiniBarChart({
  data,
  highlightIndex,
  color,
}: {
  data: { month: string; value: number }[]
  highlightIndex: number
  color: string
}) {
  return (

    <>
      {/* <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            dy={6}
          />
          <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={18}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === highlightIndex ? color : `${color}`}
                fillOpacity={i === highlightIndex ? 1 : 0.35}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer> */}
      <div className="w-full h-fit z-10 p-0">
        <BarChart data={data} xDataKey="month" animationDuration={1100}
          animationEasing="cubic-bezier(0.85, 0, 0.15, 1)" barGap={0.4} barWidth={13} className="p-0 h-36">
          <Grid horizontal />
          <Bar dataKey="value" lineCap="round" fill="var(--chart-1)" fadedOpacity={0.3} groupGap={4} />
          <BarXAxis />
          <ChartTooltip showCrosshair={false} showDots={false} />
        </BarChart>
      </div>
    </>
  )
}

function StatCard({
  title,
  value,
  decimals,
  badge,
  positive,
  data,
  highlightIndex,
  highlightLabel,
  color,
}: {
  title: string
  value: string
  decimals: string
  badge: string
  positive: boolean
  data: { month: string; value: number }[]
  highlightIndex: number
  highlightLabel: string
  color: string
}) {
  return (
    <div className="rounded-3xl bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <button
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="More options"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
          <span className="text-muted-foreground/60">{decimals}</span>
        </p>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-xs font-medium",
            positive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600",
          )}
        >
          {badge}
        </span>
      </div>

      <div className="relative">
        <MiniBarChart
          data={data}
          highlightIndex={highlightIndex}
          color={color}
        />
      </div>
    </div>
  )
}

export function AnalyticsPanel() {
  return (
    <div className="flex flex-col gap-4">
      <StatCard
        title="Total Expenses"
        value="$72,421"
        decimals=".84"
        badge="-8% vs Prev year"
        positive={false}
        data={expensesData}
        highlightIndex={3}
        highlightLabel="$12,243.23"
        color="oklch(0.82 0.13 85)"
      />
      <StatCard
        title="Total Income"
        value="$98,248"
        decimals=".44"
        badge="+14% vs Prev year"
        positive
        data={incomeData}
        highlightIndex={3}
        highlightLabel="$16,243.23"
        color="oklch(0.45 0.005 70)"
      />
    </div>
  )
}
