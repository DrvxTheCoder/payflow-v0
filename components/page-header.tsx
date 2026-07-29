import type { ReactNode } from "react"
import { headingTreatment } from "@/components/card-title"
import { cn } from "@/lib/utils"

/**
 * Per-page header. Supplies the single <h1> for a route, using the same
 * `font-heading` treatment as CardTitle at a larger size.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-4 px-2 pb-4 md:px-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className={cn("text-2xl tracking-tight", headingTreatment)}>
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
