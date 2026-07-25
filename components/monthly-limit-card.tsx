import { Gauge } from "./charts/gauge";

export default function MonthlyLimitCard() {
    return (
        <div className="flex flex-col p-2 py-6 gap-0 justify-between items-center bg-card h-full w-fit rounded-3xl shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
            <small className="text-sm text-center top-3"> Monthly Limit</small>
            <Gauge
            value={60}
            width={100}
            centerValue={0.6}
            orientation="linear"
            defaultLabel=" "
            startAngle={135}
            endAngle={405}
            totalNotches={20}
            spacing={10}
            notchCornerRadius={12}
            notchLengthPercent={100}
            useGradient={false}
            inactiveFillOpacity={0.4}
            activeFillOpacity={1}
            formatOptions={{ style: "percent", compactDisplay: "short"}}
            enterTransition={{ type: "tween", duration: 1.1, ease: [0.85, 0, 0.15, 1] }}
            enterStaggerScale={1.00}
            className="mb-0 pb-0"
            />
        </div>
    );
}