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

const currencies = [
  { code: "USD", flag: <USAFlagIcon /> },
  { code: "EUR", flag: <EuroFlagIcon /> },
  { code: "GBP", flag: <UKFlagIcon /> },
]

export function BalanceCard() {
  const [currency, setCurrency] = useState(currencies[0])

  return (
    <div className="relative overflow-hidden rounded-[2rem] p-2 shadow-sm bg-card">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-balance-card-foreground/10">
            <PayflowMark className="size-4 text-balance-card-foreground" />
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
                <div aria-hidden="true" className="flex items-center justify-center rounded-full p-0 size-4 overflow-hidden">{currency.flag}</div>
                {currency.code}
                <ChevronDown className="size-4 text-balance-card-foreground/60" />
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {currencies.map((c) => (
                <DropdownMenuItem key={c.code} onClick={() => setCurrency(c)}>
                  <div aria-hidden="true" className="flex items-center justify-center rounded-full p-0 size-3 overflow-hidden">
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
      <div className="rounded-[1.75rem] bg-secondary p-5 text-card-foreground">
        <p className="text-sm text-muted-foreground">Available Funds</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
          $18,248
          <span className="text-muted-foreground/60">.44</span>
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 pt-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors hover:bg-secondary border border-primary/80">
              <HugeiconsIcon icon={CircleArrowUpRightIcon} className="size-6 text-muted-foreground" />
              Send
          </Button> 

          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors hover:bg-secondary border border-primary/80"
          >
            <HugeiconsIcon icon={CircleArrowDownLeftIcon} className="size-6 text-muted-foreground" />
            Request
          </Button>
        </div>
      </div>
    </div>
  )
}
