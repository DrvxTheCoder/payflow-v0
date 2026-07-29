import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home04Icon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = {
  title: "Payflow — Page not found",
}

/**
 * Inside a Tauri window there is no address bar and no back button, so this
 * page must always offer a way back to the dashboard.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-[2rem] bg-card p-6 text-center shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
        <p className="text-sm font-medium tabular-nums text-muted-foreground">404</p>
        <h1 className="mt-2 text-2xl font-heading font-extrabold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That page doesn&apos;t exist, or it moved somewhere else.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <HugeiconsIcon icon={Home04Icon} className="size-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
