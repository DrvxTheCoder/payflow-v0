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
  color,
  gridLines,
}: {
  data: { month: string; value: number }[]
  color: string
  gridLines?: number
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
          animationEasing="cubic-bezier(0.85, 0, 0.15, 1)" barGap={0.4} barWidth={20} className="px-0 h-36 w-full">
          <Grid horizontal numTicksRows={gridLines} />
          <Bar dataKey="value" lineCap="round" fill={color} fadedOpacity={0.3} groupGap={4} />
          <BarXAxis />
          <ChartTooltip showCrosshair={false} showDots={true} />
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
  color,
}: {
  title: string
  value: string
  decimals: string
  badge: string
  positive: boolean
  data: { month: string; value: number }[]
  color: string
}) {
  return (
    <div className="rounded-3xl bg-card p-8 shadow-sm">
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
              ? "bg-success-muted text-success-muted-foreground"
              : "bg-destructive-muted text-destructive-muted-foreground",
          )}
        >
          {badge}
        </span>
      </div>

      <div className="relative">
        <MiniBarChart
          data={data}
          color={color}
          gridLines={4}
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
        color="var(--chart-1)"
      />
      <StatCard
        title="Total Income"
        value="$98,248"
        decimals=".44"
        badge="+14% vs Prev year"
        positive
        data={incomeData}
        color="var(--chart-3)"
      />
    </div>
  )
}
