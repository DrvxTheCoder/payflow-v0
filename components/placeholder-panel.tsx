import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/card-title"
import { cn } from "@/lib/utils"

/**
 * Empty-state card for routes that are structured but not yet wired up.
 * Visual sibling of the dashed "Add widget" tile on the dashboard — same restraint.
 */
export function PlaceholderPanel({
  icon,
  heading,
  description,
  actionLabel,
  className,
}: {
  icon: ReactNode
  heading: string
  description: string
  actionLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-card p-6 py-16 text-center shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-sidebar-foreground/5 text-muted-foreground">
        {icon}
      </div>
      <div className="max-w-sm">
        <CardTitle>{heading}</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && (
        <Button disabled className="rounded-full px-5">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
