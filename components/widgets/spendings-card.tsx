import { useState } from "react";
import { PieChart } from "@/components/vendor/charts/pie-chart";
import { PieSlice } from "@/components/vendor/charts/pie-slice";
import { PieCenter } from "@/components/vendor/charts/pie-center";
import { spendingData } from "@/lib/data";
import { cn } from "@/lib/utils";

interface SpendingCardProps {
  variant : "simple" | "advanced",
}

export default function SpendingDataChartTwo({variant}:SpendingCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("flex flex-row", variant==="simple" ? "justify-center" : "justify-start", "items-center bg-card h-full w-fit p-2 gap-1 rounded-3xl shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5")}>
      <PieChart
        data={spendingData}
        size={130}
        innerRadius={40}
        padAngle={0}
        hoverOffset={10}
        startAngle={-95 * Math.PI / 180}
        endAngle={270 * Math.PI / 180}
        hoveredIndex={hoveredIndex}
        onHoverChange={setHoveredIndex}
        enterTransition={{ type: "tween", duration: 1.1, ease: [0.85, 0, 0.15, 1] }}
        enterStaggerScale={1.0}
      >
        {spendingData.map((_, index) => (
          <PieSlice key={index} index={index} hoverEffect="translate" />
        ))}
        <PieCenter defaultLabel="Total" />
      </PieChart>
      <div className={cn("flex flex-col", variant==="simple" ? "bg-card justify-center gap-0 items-center" : "bg-muted justify-start gap-0 items-center p-4 px-2 w-full h-full rounded-2xl inset-shadow-xs" )}>
        {spendingData.map((expense, index) => {
          const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
          const isActive = hoveredIndex === index;
          return (
            <button
              key={expense.label ?? index}
              type="button"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              className={cn(
                "inline-flex w-full items-center  gap-1 p-0 text-left text-[0.65rem] font-medium transition duration-150 hover:bg-muted-foreground/10 rounded-sm md:px-1.5 md:py-0.5 cursor-pointer",
                isActive ? "text-foreground" : "text-foreground-muted",
                isDimmed && "opacity-30"
              )}
            >
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: expense.color }}
              />
              <span className="truncate">{expense.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
