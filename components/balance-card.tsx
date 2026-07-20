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
import { TrustKycMark } from "./trustkyc-mark"
import AddCardDialog from "./add-card-dialog"

const currencies = [
  { code: "USD", flag: <USAFlagIcon width={20} /> },
  { code: "EUR", flag: <EuroFlagIcon width={20} /> },
  { code: "GBP", flag: <UKFlagIcon width={20} /> },
]

export function BalanceCard() {
  const [currency, setCurrency] = useState(currencies[0])

  return (
    <div className="relative overflow-hidden rounded-[2rem] p-2 bg-sidebar shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">

            {/* <TrustKycMark variant="filled" className="size-6 text-white" /> */}

          <div>
            <p className="text-lg font-heading font-extrabold text-white">Total Balance</p>
          </div>
        </div>

        <AddCardDialog />

        {/* <DropdownMenu>
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
        </DropdownMenu> */}
      </div>

      {/* Inner white card */}
      <div className="rounded-[1.75rem] bg-card dark:bg-muted p-5 text-card-foreground">
        <p className="text-sm text-muted-foreground">Available Funds</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
          $18,248.44
        </p>

        <div className="w-full flex flex-row gap-0 pt-4 justify-center">
          <Button
            className="bg-card hover:bg-secondary text-primary flex flex-row items-center justify-between rounded-none rounded-l-xl border border-muted-foreground/10 text-sm font-medium transition-colors">
              <HugeiconsIcon icon={CircleArrowUpRightIcon} className="size-6 text-muted-foreground/50" />
              Send
              <span />
          </Button> 

          <Button
            className="bg-card hover:bg-secondary text-primary flex flex-row items-center justify-between rounded-none rounded-r-xl border border-muted-foreground/10 border-l-0 text-sm font-medium transition-colors"
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
