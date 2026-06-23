import { useMemo, useState } from "react"
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
import { transactions, type TxStatus } from "@/lib/data"
import { cn } from "@/lib/utils"
import { RefreshButton } from "./unlumen-ui/refresh"
import { ShimmerSkeleton } from "./unlumen-ui/shimmer-skeleton"
import ExpandableSearchBar from "./expandable-search-bar"

const statusDot: Record<TxStatus, string> = {
  Received: "bg-emerald-500",
  Sent: "bg-blue-500",
  Payment: "bg-fuchsia-500",
}

function formatAmount(amount: number) {
  const sign = amount >= 0 ? "+" : "-"
  return `${sign} $${Math.abs(amount).toFixed(2)}`
}

const PAGE_SIZE = 9

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
    <div className="flex h-fit flex-col rounded-[2rem] bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Transactions</h2>
          <p className="text-sm text-muted-foreground">
            You can view your transaction history
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
              <TableHead className="text-xs font-normal text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="text-xs font-normal text-muted-foreground">
                Date
              </TableHead>
              <TableHead className="text-xs font-normal text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-normal text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 9 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="border-border/40 group" tabIndex={0}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <ShimmerSkeleton
                          className="size-9 h-9 w-9"
                          rounded="full"
                        />
                        <div className="min-w-0 space-y-2">
                          <ShimmerSkeleton className="h-4 w-32" />
                          <ShimmerSkeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ShimmerSkeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center gap-2">
                        <ShimmerSkeleton className="h-3 w-3 rounded-full" rounded="full" />
                        <ShimmerSkeleton className="h-4 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <ShimmerSkeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
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
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        {tx.brand ? (
                          <BrandIcon brand={tx.brand} />
                        ) : (
                          <Avatar className="size-9">
                            <AvatarImage
                              src={tx.avatar || "/placeholder.svg"}
                              alt={tx.name}
                            />
                            <AvatarFallback>{tx.name[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{tx.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {tx.account}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {tx.date}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            statusDot[tx.status],
                          )}
                        />
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "whitespace-nowrap text-sm font-medium tabular-nums",
                        tx.amount >= 0 ? "text-foreground" : "text-foreground",
                      )}
                    >
                      {formatAmount(tx.amount)}
                    </TableCell>
                    <TableCell>
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

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length === 0
            ? "0 results"
            : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
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
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
          <RefreshButton label="Refresh" className="p-4 bg-card" onClick={handleRefresh} variant="outline" disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}
