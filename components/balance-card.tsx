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
import { USAFlagIcon } from "@/components/country-flag-icons/usa"
import { UKFlagIcon } from "@/components/country-flag-icons/uk"
import { EuroFlagIcon } from "@/components/country-flag-icons/euro"
import { AnimatedNumber } from "./motion-primitives/animated-number"

const currencies = [
  { code: "USD", flag: <USAFlagIcon width={20} /> },
  { code: "EUR", flag: <EuroFlagIcon width={20} /> },
  { code: "GBP", flag: <UKFlagIcon width={20} /> },
]

export function BalanceCard() {
  const [currency, setCurrency] = useState(currencies[0])

  return (
    <div className="relative overflow-hidden rounded-[2rem] p-2 shadow-sm bg-card">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary">
            <PayflowMark className="size-4 text-secondary" />
          </span>
          <div>
            <p className="text-base font-semibold">Total Balance</p>
            <p className="text-sm text-balance-card-foreground/50">Available for use</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2 rounded-full bg-balance-card-foreground/10 px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-balance-card-foreground/15">
                {currency.flag}
                {currency.code}
                <ChevronDown className="size-4 text-balance-card-foreground/60" />
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {currencies.map((c) => (
                <DropdownMenuItem key={c.code} onClick={() => setCurrency(c)}>
                  <div aria-hidden="true" className="flex items-center justify-center p-0 size-3 overflow-hidden">
                    {c.flag}
                  </div>
                  {c.code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Inner white card */}
      <div className="rounded-[1.75rem] bg-muted p-5 text-card-foreground">
        <p className="text-sm text-muted-foreground">Available Funds</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
          $18,248.44
        </p>

        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button
            variant="outline"
            className="flex flex-row items-center justify-between rounded-xl text-sm font-medium transition-colors border border-muted-foreground/50">
              <HugeiconsIcon icon={CircleArrowUpRightIcon} className="size-6 text-muted-foreground/50" />
              Send
              <span />
          </Button> 

          <Button
            variant="outline"
            className="flex flex-row items-center justify-between rounded-xl text-sm font-medium transition-colors border border-muted-foreground/50"
          >
            <HugeiconsIcon icon={CircleArrowDownLeftIcon} className="size-6 text-muted-foreground/50" />
            Request
            <span />
          </Button>
        </div>
      </div>
    </div>
  )
}
