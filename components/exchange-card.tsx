"use client"

import { useState } from "react"
import { ArrowDownUp, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const currencies = [
  { code: "USD", flag: "🇺🇸" },
  { code: "EUR", flag: "🇪🇺" },
  { code: "GBP", flag: "🇬🇧" },
]

function CurrencySelect({
  value,
  onChange,
}: {
  value: (typeof currencies)[number]
  onChange: (c: (typeof currencies)[number]) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-secondary">
            <span aria-hidden="true">{value.flag}</span>
            {value.code}
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {currencies.map((c) => (
            <DropdownMenuItem key={c.code} onClick={() => onChange(c)}>
              <span aria-hidden="true">{c.flag}</span>
              {c.code}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ExchangeCard() {
  const [from, setFrom] = useState(currencies[0])
  const [to, setTo] = useState(currencies[1])

  return (
    <div className="rounded-[2rem] bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Exchange</h3>
        <button
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="More options"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="relative mt-4 flex flex-col gap-0">
        <div className="flex items-center justify-between rounded-t-2xl border-2 border-primary/10 px-4 py-3">
          <CurrencySelect value={from} onChange={setFrom} />
          <input
            type="text"
            defaultValue="300"
            aria-label="Amount to exchange"
            className="w-24 bg-transparent text-right text-lg font-semibold tabular-nums "
          />
        </div>
        <div className="flex items-center justify-between rounded-b-2xl border-2 border-t-0 border-primary/10 px-4 py-3">
          <CurrencySelect value={to} onChange={setTo} />
          <input
            type="text"
            defaultValue="275.68"
            aria-label="Converted amount"
            readOnly
            className="w-24 bg-transparent text-right text-lg font-semibold tabular-nums outline-none"
          />
        </div>

        <button
          className="absolute right-6 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary/10 bg-card text-foreground hover:bg-secondary hover:size-11 transition-all ease-in-out cursor-pointer"
          aria-label="Swap currencies"
        >
          <ArrowDownUp className="size-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>1.00 USD = 0.92 Euro</span>
        <span>Exchange Fee: $12.44</span>
      </div>

      <button className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        Exchange
      </button>
    </div>
  )
}
