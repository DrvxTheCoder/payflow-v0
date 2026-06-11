import { useState } from "react"
import { Search, SlidersHorizontal, MoreHorizontal } from "lucide-react"
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

export function TransactionsTable() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

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
          <ExpandableSearchBar placeholder="Search transactions..." expandDirection="left" />
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
              : transactions.map((tx) => (
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

      <div className="mt-4 flex justify-end">
        {/* <button className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
          View all transactions
        </button> */}
        <RefreshButton label="Refresh" className="p-4 bg-white" onClick={handleRefresh} variant="outline" />
      </div>
    </div>
  )
}
