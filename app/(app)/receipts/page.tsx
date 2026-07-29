import type { Metadata } from "next"
import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice01Icon } from "@hugeicons/core-free-icons"
import { PageHeader } from "@/components/page-header"
import { PlaceholderPanel } from "@/components/placeholder-panel"

export const metadata: Metadata = {
  title: "Payflow — Receipts",
}

export default function ReceiptsPage() {
  return (
    <div className="mx-2 pb-6 pt-3">
      <PageHeader
        title="Receipts"
        description="Proof of payment for every transaction."
      />
      <div className="px-2 md:px-3">
        <PlaceholderPanel
          icon={<HugeiconsIcon icon={Invoice01Icon} className="size-6" />}
          heading="No receipts yet"
          description="Receipts will collect here as soon as your transactions are settled."
          actionLabel="Import receipts"
        />
      </div>
    </div>
  )
}
