"use client"

import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

type QuickAction = {
  label: string
  /** Path to the PNG in /public/icons. */
  icon: string
}

/** The first three are the ones that stay visible on mobile. */
const actions: QuickAction[] = [
  { label: "Payments", icon: "/icons/payment.png" },
  { label: "Airtime", icon: "/icons/airtime.png" },
  { label: "Vault", icon: "/icons/vault.png" },
  { label: "Cards", icon: "/icons/cards.png" },
  { label: "Bank", icon: "/icons/bank.png" },
  { label: "Budget", icon: "/icons/budget.png" },
  { label: "Invest", icon: "/icons/invest.png" },
  { label: "Analytics", icon: "/icons/stats.png" },
]

const MOBILE_VISIBLE = 3

/* Shared between the plain action buttons, the drawer trigger and the drawer's
   own buttons so every tile lines up at exactly the same size. */
const buttonClass =
  "group flex cursor-pointer flex-col items-center gap-2 rounded-2xl p-1 text-center transition-colors"
const tileClass =
  "flex size-18 items-center justify-center rounded-full dark:bg-muted bg-muted-foreground/15 transition-colors group-hover:bg-muted-foreground/20"
const labelClass = "w-full truncate text-sm font-bold"

function ActionIcon({ action }: { action: QuickAction }) {
  return (
    <Image
      src={action.icon}
      alt=""
      width={120}
      height={120}
      className="size-18" 
    />
  )
}

function ActionButton({
  action,
  className,
}: {
  action: QuickAction
  className?: string
}) {
  return (
    <button type="button" className={cn(buttonClass, className)}>
      <span className={tileClass}>
        <ActionIcon action={action} />
      </span>
      <span className={labelClass}>{action.label}</span>
    </button>
  )
}

export function ActionsCard() {
  return (
    <div className="flex h-full flex-col justify-between bg-none pb-6 md:pt-4">
      {/* Desktop: all eight actions, 4 x 2 */}
      <div className="hidden grid-cols-4 gap-3 lg:grid">
        {actions.map((action) => (
          <ActionButton key={action.label} action={action} />
        ))}
      </div>

      {/* Mobile: three actions plus a "More" drawer holding all eight */}
      <div className="mt-5 flex items-start justify-between gap-2 lg:hidden">
        {actions.slice(0, MOBILE_VISIBLE).map((action) => (
          <ActionButton key={action.label} action={action} className="flex-1" />
        ))}

        <Drawer showSwipeHandle>
          <DrawerTrigger className={cn(buttonClass, "flex-1")}>
            <span className={tileClass}>
              <HugeiconsIcon
                icon={MoreHorizontalIcon}
                className="size-8 text-muted-foreground"
              />
            </span>
            <span className={labelClass}>More</span>
          </DrawerTrigger>

          <DrawerContent className="pb-28">
            {/* <DrawerHeader className="pb-6">
              <DrawerTitle>Services</DrawerTitle>
              <DrawerDescription>
                Pick an action to get started.
              </DrawerDescription>
            </DrawerHeader> */}
            <div className="grid grid-cols-3 gap-3 p-6 pt-16 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {actions.map((action) => (
                <DrawerClose key={action.label} className={buttonClass}>
                  <span className={tileClass}>
                    <ActionIcon action={action} />
                  </span>
                  <span className={labelClass}>{action.label}</span>
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
