import type { Metadata } from "next"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardCircleIcon } from "@hugeicons/core-free-icons"
import { PageHeader } from "@/components/page-header"
import { PlaceholderPanel } from "@/components/placeholder-panel"

export const metadata: Metadata = {
  title: "Payflow — Manage",
}

export default function ManagePage() {
  return (
    <div className="mx-2 pb-6 pt-3">
      <PageHeader
        title="Manage"
        description="Accounts, limits and beneficiaries in one place."
      />
      <div className="px-2 md:px-3">
        <PlaceholderPanel
          icon={<HugeiconsIcon icon={DashboardCircleIcon} className="size-6" />}
          heading="Nothing to manage yet"
          description="Connect an account to start setting limits, rules and beneficiaries."
          actionLabel="Connect an account"
        />
      </div>
    </div>
  )
}
