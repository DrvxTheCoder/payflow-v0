import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { TransactionsTable } from "@/components/widgets/transactions-table"

export const metadata: Metadata = {
  title: "Payflow — History",
}

export default function HistoryPage() {
  return (
    <div className="mx-2 pb-6 pt-3">
      <PageHeader
        title="History"
        description="Every transaction across your accounts."
      />
      <div className="px-2 md:px-3">
        <TransactionsTable />
      </div>
    </div>
  )
}
