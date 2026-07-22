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
    <div className="flex flex-col justify-between items-center rounded-[2rem] p-2 bg-sidebar shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
      <div className="flex items-center justify-between p-4 pb-0 w-full">
        <div className="flex items-center gap-3">
          {/* <TrustKycMark variant="filled" className="size-6 text-white" /> */}
          <div>
            <p className="text-lg font-heading font-extrabold text-white">Total Balance</p>
          </div>
        </div>
        <AddCardDialog />
      </div>

      {/* Inner white card */}
      <div className="flex flex-col justify-between gap-4 rounded-[1.75rem] bg-card dark:bg-muted p-6 pt-4 text-card-foreground h-fit w-full">
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Available Funds</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
            $18,248.44
          </p>
        </div>


        <div className="w-full flex flex-row gap-0 justify-center">
          <Button
            className="py-6 bg-card hover:bg-secondary text-primary flex flex-row items-center justify-between rounded-none rounded-l-full border border-muted-foreground/10 text-sm font-medium transition-colors">
              <HugeiconsIcon icon={CircleArrowUpRightIcon} className="size-6 text-muted-foreground/50" />
              Send
              <span />
          </Button> 

          <Button
            className="py-6 bg-card hover:bg-secondary text-primary flex flex-row items-center justify-between rounded-none rounded-r-full border border-muted-foreground/10 border-l-0 text-sm font-medium transition-colors"
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
