"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BrandIcon } from "@/components/brand-icon"
import { transactions, type Transaction, type TxStatus } from "@/lib/data"
import { cn } from "@/lib/utils"
import { RefreshButton } from "../vendor/unlumen-ui/refresh"
import { ShimmerSkeleton } from "../vendor/unlumen-ui/shimmer-skeleton"
import ExpandableSearchBar from "../expandable-search-bar"

// Tinted pill: token background at low opacity + token text colour. Hue is never
// the only signal — the label is always rendered alongside the dot.
const statusStyles: Record<TxStatus, string> = {
  Received: "bg-success/10 text-success",
  Sent: "bg-status-sent/10 text-status-sent",
  Payment: "bg-status-payment/10 text-status-payment",
}

/** Avatar / brand mark for a transaction. */
function TxAvatar({ tx }: { tx: Transaction }) {
  if (tx.brand) return <BrandIcon className="hidden md:flex size-12 md:size-9" brand={tx.brand} />
  return (
    <Avatar className="hidden md:flex flex-row items-center justify-center size-12 md:size-9">
      <AvatarImage src={tx.avatar || "/placeholder.svg"} alt={tx.name} />
      <AvatarFallback>{tx.name[0]}</AvatarFallback>
    </Avatar>
  )
}

/** Status indicator — dot plus an always-visible text label. */
function StatusBadge({
  status,
  className,
}: {
  status: TxStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      <span className="size-1 shrink-0 rounded-full bg-current" />
      {status}
    </span>
  )
}

function formatAmount(amount: number) {
  const sign = amount >= 0 ? "+" : "-"
  return `${sign} $${Math.abs(amount).toFixed(2)}`
}

const PAGE_SIZE = 8

export function TransactionsTable() {
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return transactions
    return transactions.filter(
      (tx) =>
        tx.name.toLowerCase().includes(q) ||
        tx.account.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q),
    )
  }, [query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  return (
    <div className="flex h-fit flex-col rounded-[2rem] bg-card py-6 lg:p-6 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
      <div className="flex items-start justify-between px-6 lg:px-0">
        <div>
          <h2 className="text-lg font-heading font-extrabold">Transactions</h2>
          <p className="text-sm text-muted-foreground">
            Transaction history
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <button
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Search transactions"
          >
            <Search className="size-4" />
          </button> */}
          <ExpandableSearchBar
            placeholder="Search transactions..."
            expandDirection="left"
            onChange={handleSearch}
          />
          <button
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Filter transactions"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              {/* Below lg the table collapses to Description + Amount; the date,
                  status and row menu fold into (or off) the first column. */}
              <TableHead className="text-xs font-normal text-muted-foreground px-6 lg:px-0">
                <span className="lg:hidden">Description</span>
                <span className="hidden lg:inline">Name</span>
              </TableHead>
              <TableHead className="hidden text-xs font-normal text-muted-foreground lg:table-cell">
                Date
              </TableHead>
              <TableHead className="hidden text-xs font-normal text-muted-foreground lg:table-cell">
                Status
              </TableHead>
              <TableHead className="text-right text-xs font-normal text-muted-foreground px-6 lg:px-0">
                Amount
              </TableHead>
              <TableHead className="hidden w-10 lg:table-cell" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="border-border/40 group" tabIndex={0}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <ShimmerSkeleton
                          className="size-9 h-9 w-9"
                          rounded="full"
                        />
                        <div className="min-w-0 space-y-2">
                          <ShimmerSkeleton className="h-4 w-32" />
                          <ShimmerSkeleton className="hidden h-3 w-24 lg:block" />
                          <ShimmerSkeleton className="h-4 w-20 lg:hidden" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <ShimmerSkeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="inline-flex items-center gap-2">
                        <ShimmerSkeleton className="h-3 w-3 rounded-full" rounded="full" />
                        <ShimmerSkeleton className="h-4 w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ShimmerSkeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <button
                        className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-opacity duration-150 opacity-100 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-secondary"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              : paginated.length === 0
                ? (
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No transactions found{query ? ` for "${query}"` : ""}.
                    </TableCell>
                  </TableRow>
                )
                : paginated.map((tx) => (
                  <TableRow key={tx.id} className="border-border/40 group" tabIndex={0}>
                    <TableCell className="py-3 px-6 lg:px-0">
                      <div className="flex items-center gap-3">
                        <TxAvatar tx={tx} />
                        <div className="min-w-0 gap-1">
                          <p className="truncate text-base lg:text-sm font-bold">{tx.name}</p>
                          <p className="hidden truncate text-xs text-muted-foreground lg:block">
                            {tx.account}
                          </p>
                          <p className="text-sm text-muted-foreground lg:hidden">{tx.date}</p>
                          <StatusBadge
                            status={tx.status}
                            className="mt-1 lg:hidden"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground lg:table-cell">
                      {tx.date}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <StatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell
                      className={cn(
                        "whitespace-nowrap text-right text-sm font-medium tabular-nums px-6 lg:px-0",
                        tx.amount >= 0 ? "text-success" : "text-foreground",
                      )}
                    >
                      {formatAmount(tx.amount)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <button
                        className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-opacity duration-150 opacity-100 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-secondary"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination is desktop-only; below lg it's replaced by the link below */}
      <div className="mt-4 hidden items-center justify-between lg:flex">
        <p className="text-xs text-muted-foreground">
          {filtered.length === 0
            ? "0 results"
            : `${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, filtered.length)} / ${filtered.length}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-xs tabular-nums text-muted-foreground">
            {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage >= pageCount}
            aria-label="Next page"
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
          <RefreshButton label="Refresh" className="p-4 bg-card" onClick={handleRefresh} variant="outline" disabled={isLoading} />
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <Link
          href="/history"
          className="mt-4 flex w-fit items-center justify-center gap-1.5 rounded-full border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
        >
          View all transactions
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
