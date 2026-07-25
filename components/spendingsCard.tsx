import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { PieCenter } from "@/components/charts/pie-center";
import { spendingData } from "@/lib/data";

export default function SpendingDataChart() {
  return (
    <div className="flex flex-row justify-start items-center bg-card h-full w-fit p-2 gap-2 rounded-3xl shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
        <PieChart data={spendingData} size={130} innerRadius={40} padAngle={0} hoverOffset={10} startAngle={-95 * Math.PI / 180} endAngle={270 * Math.PI / 180}
            enterTransition={{ type: "tween", duration: 1.1, ease: [0.85, 0, 0.15, 1] }}
            enterStaggerScale={1.00}>
            <PieSlice index={0} hoverEffect="translate" />
            <PieSlice index={1} hoverEffect="translate" />
            <PieSlice index={2} hoverEffect="translate" />
            <PieSlice index={3} hoverEffect="translate" />
            <PieSlice index={4} hoverEffect="translate" />
            <PieCenter defaultLabel="Total" />
        </PieChart>
        <div className="flex flex-col justify-start gap-1 items-center bg-muted p-4 px-3 w-full h-full rounded-2xl inset-shadow-xs">
            {spendingData.map((expense, index) => (
                <span
                key={index}
                className="flex flex-row justify-start items-center w-full gap-1"
                >
                <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: expense.color }}
                />
                <small className="text-md lg:text-[0.65rem] font-medium">
                    {expense.label} 
                </small>
                </span>
            ))}
        </div>
    </div>
  );
}