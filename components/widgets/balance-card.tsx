"use client"

import { useState } from "react"
import { EyeIcon } from "../vendor/animated/icons/eye"
import { EyeOffIcon } from "../vendor/animated/icons/eye-off"
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
import {  CircleArrowDownLeftIcon, CircleArrowUpRightIcon, CoinsDollarIcon } from '@hugeicons/core-free-icons'
import { USAFlagIcon } from "@/components/vendor/country-flag-icons/usa"
import { UKFlagIcon } from "@/components/vendor/country-flag-icons/uk"
import { EuroFlagIcon } from "@/components/vendor/country-flag-icons/euro"
import { AnimatedNumber } from "../vendor/motion-primitives/animated-number"
import { TrustKycMark } from "../trustkyc-mark"
import AddCardDialog from "./add-card-dialog"

const currencies = [
  { code: "USD", flag: <USAFlagIcon width={20} /> },
  { code: "EUR", flag: <EuroFlagIcon width={20} /> },
  { code: "GBP", flag: <UKFlagIcon width={20} /> },
]

export function BalanceCard() {
  const [currency, setCurrency] = useState(currencies[0])
  const [showBalance, setShowBalance] = useState(true)
  const balance = "$18,248.44"
  const hiddenBalance = "********"

  return (
    <div className="flex flex-col justify-between items-center rounded-[2rem] p-2 bg-[#171717] shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
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
      <div className="flex flex-col justify-between gap-4 rounded-[1.75rem] bg-muted p-6 pt-4 text-card-foreground h-fit w-full inset-shadow-sm">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Available Funds</p>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance((prev) => !prev)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-secondary"
          >
            {showBalance ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </Button>
        </div>

        <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums font-mono">
          ${showBalance ? "18,248.44" : "********"}
        </p>
      </div>


        <div className="w-full flex flex-row gap-2 justify-center items-center">
          <Button
            className="py-6 bg-card hover:bg-card/80 text-primary flex flex-row items-center justify-between rounded-full border border-muted-foreground/10 text-sm font-medium transition-colors">
              <HugeiconsIcon icon={CoinsDollarIcon} className="size-4 md:size-6 text-primary" />
              Top Up
              <span />
          </Button>
          <div className="flex flex-row gap-0 justify-center">
            <Button
              className="py-6 bg-secondary hover:bg-muted-foreground/10 text-primary flex flex-row items-center justify-between rounded-none rounded-l-full border border-muted-foreground/10 text-sm font-medium transition-colors">
                <HugeiconsIcon icon={CircleArrowUpRightIcon} className="size-4 md:size-6 text-muted-foreground/50" />
                Send
                <span />
            </Button> 

            <Button
              className="py-6 bg-secondary hover:bg-muted-foreground/10 text-primary flex flex-row items-center justify-between rounded-none rounded-r-full border border-muted-foreground/10 border-l-0 text-sm font-medium transition-colors"
            >
              <HugeiconsIcon icon={CircleArrowDownLeftIcon} className="size-4 md:size-6 text-muted-foreground/50" />
              Request
              <span />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
