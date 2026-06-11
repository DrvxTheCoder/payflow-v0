"use client"

import { useEffect, useState } from "react"
import { ArrowDownUp, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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
  const [amountFrom, setAmountFrom] = useState<number>(300)
  const [amountTo, setAmountTo] = useState<number>(275.68)
  const [rotated, setRotated] = useState(false)

  const rates: Record<string, Record<string, number>> = {
    USD: { EUR: 0.87, GBP: 0.75, USD: 1 },
    EUR: { USD: 1.16, GBP: 0.86, EUR: 1 },
    GBP: { USD: 1.34, EUR: 1.16, GBP: 1 },
  }

  function getRate(fromCode: string, toCode: string) {
    return rates[fromCode]?.[toCode] ?? 1
  }

  useEffect(() => {
    setAmountTo(Number((amountFrom * getRate(from.code, to.code)).toFixed(2)))
  }, [amountFrom, from, to])

  return (
    <div className="rounded-[2rem] bg-card p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Exchange</h3>
        <Button variant="outline" size="icon-sm" className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      <div className="relative mt-4 flex flex-col gap-0">
        <div className="flex items-center justify-between rounded-t-2xl border-2 border-primary/10 px-4 py-3">
          <CurrencySelect value={from} onChange={setFrom} />
          <input
            type="number"
            value={amountFrom}
            onChange={(e) => setAmountFrom(Number(e.target.value || 0))}
            aria-label="Amount to exchange"
            className="w-24 bg-transparent text-right text-lg font-semibold tabular-nums outline-none focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between rounded-b-2xl border-2 border-t-0 border-primary/10 px-4 py-3">
          <CurrencySelect value={to} onChange={setTo} />
          <input
            type="number"
            value={amountTo}
            aria-label="Converted amount"
            readOnly
            className="w-24 bg-transparent text-right text-lg font-semibold tabular-nums outline-none focus:outline-none"
          />
        </div>

        <Button
          onClick={() => {
            // animate rotation briefly
            setRotated((r) => !r)

            // swap currencies
            setFrom((prev) => to)
            setTo((prev) => from)

            // swap amounts so the visible numbers flip as well
            setAmountFrom((prev) => amountTo)
            setAmountTo((prev) => amountFrom)
          }}
          className="absolute right-6 top-1/2 flex -translate-y-1/2 rounded-full items-center justify-center border-2 border-primary/10 bg-card cursor-pointer"
          aria-label="Swap currencies"
          variant="outline"
          size="icon"
        >
          <ArrowDownUp
            className="size-4 text-primary/20 transform transition-transform"
            style={{ transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>1.00 {from.code} = {getRate(from.code, to.code).toFixed(2)} {to.code}</span>
        <span>Exchange Fee: $12.44</span>
      </div>

      <Button className="mt-4 w-full rounded-full bg-primary p-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        Exchange
      </Button>
    </div>
  )
}
