"use client"

import { useState } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Payment01Icon,
  SmartPhone01Icon,
  SafeIcon,
  Bus01Icon,
  BankIcon,
  PiggyBankIcon,
  AnalyticsUpIcon,
  GiftIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import GooeyPopover from "@/components/smoothui/gooey-popover"
import { CardTitle } from "@/components/card-title"
import { cn } from "@/lib/utils"

type QuickAction = {
  label: string
  icon: IconSvgElement
}

/** The first four are the ones that stay visible on mobile. */
const actions: QuickAction[] = [
  { label: "Payments", icon: Payment01Icon },
  { label: "Airtime", icon: SmartPhone01Icon },
  { label: "Vault", icon: SafeIcon },
  { label: "Transport", icon: Bus01Icon },
  { label: "Bank", icon: BankIcon },
  { label: "Budget", icon: PiggyBankIcon },
  { label: "Invest", icon: AnalyticsUpIcon },
  { label: "Rewards", icon: GiftIcon },
]

const MOBILE_VISIBLE = 3

function ActionButton({
  action,
  className,
  tileClassName,
}: {
  action: QuickAction
  className?: string
  tileClassName?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded-2xl p-1 text-center transition-colors group",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-18 items-center group-hover:bg-sidebar-foreground/15 justify-center rounded-full bg-chart-1 text-foreground transition-colors",
          tileClassName,
        )}
      >
        <HugeiconsIcon icon={action.icon} className="size-8 md:size-6 text-black" />
      </span>
      <span className="w-full truncate text-sm font-bold text-muted-foreground">
        {action.label}
      </span>
    </button>
  )
}

export function ActionsCard() {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="flex h-full flex-col justify-between rounded-[2rem] bg-none">

      {/* Desktop: all eight actions, 4 x 2 */}
      <div className="hidden grid-cols-4 gap-3 lg:grid">
        {actions.map((action) => (
          <ActionButton
            key={action.label}
            action={action}
          />
        ))}
      </div>

      {/* Mobile: four actions plus a gooey "More" popover holding all eight */}
      <div className="mt-5 flex items-start justify-between gap-2 lg:hidden">
        {actions.slice(0, MOBILE_VISIBLE).map((action) => (
          <ActionButton key={action.label} action={action} className="flex-1" />
        ))}

        <div className="flex flex-1 flex-col items-center gap-2">
          <GooeyPopover
            isOpen={moreOpen}
            onOpenChange={setMoreOpen}
            triggerSize={48}
            contentWidth={264}
            side="bottom"
            sideOffset={16}
            bgClassName="bg-balance-card"
            contentClassName="p-4"
            trigger={
              <HugeiconsIcon icon={MoreHorizontalIcon} className="size-5" />
            }
          >
            <div className="grid grid-cols-4 gap-3">
              {actions.map((action) => (
                <ActionButton
                  key={action.label}
                  action={action}
                  tileClassName="bg-balance-card-foreground/10 text-balance-card-foreground"
                  className="[&_span:last-child]:text-balance-card-foreground/70"
                />
              ))}
            </div>
          </GooeyPopover>
          <span className="w-full truncate text-center text-[0.7rem] font-medium text-muted-foreground">
            More
          </span>
        </div>
      </div>
    </div>
  )
}
