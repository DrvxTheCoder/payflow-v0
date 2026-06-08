"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PayflowMark } from "@/components/payflow-mark"
import { HugeiconsIcon } from '@hugeicons/react'
import { CircleArrowDownLeftIcon, CircleArrowUpRightIcon } from '@hugeicons/core-free-icons'

const currencies = [
  { code: "USD", flag: "🇺🇸" },
  { code: "EUR", flag: "🇪🇺" },
  { code: "GBP", flag: "🇬🇧" },
]

export function BalanceCard() {
  const [currency, setCurrency] = useState(currencies[0])

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(120%_120%_at_30%_0%,theme(colors.neutral.700)_0%,theme(colors.neutral.900)_55%,theme(colors.neutral.950)_100%)] p-2 text-white shadow-sm">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
            <PayflowMark className="size-4 text-white" />
          </span>
          <div>
            <p className="text-base font-semibold">Total Balance</p>
            <p className="text-sm text-white/50">Available for use</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-white/15">
                <span aria-hidden="true">{currency.flag}</span>
                {currency.code}
                <ChevronDown className="size-4 text-white/60" />
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {currencies.map((c) => (
                <DropdownMenuItem key={c.code} onClick={() => setCurrency(c)}>
                  <span aria-hidden="true">{c.flag}</span>
                  {c.code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Inner white card */}
      <div className="rounded-[1.75rem] bg-card p-5 text-card-foreground">
        <p className="text-sm text-muted-foreground">Available Funds</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
          $18,248
          <span className="text-muted-foreground/60">.44</span>
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4">
          <button className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors hover:bg-secondary">
              <HugeiconsIcon icon={CircleArrowUpRightIcon} className="size-6" />
            Send
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors hover:bg-secondary">
              <HugeiconsIcon icon={CircleArrowDownLeftIcon} className="size-6" />
            Request
          </button>
        </div>
      </div>
    </div>
  )
}
