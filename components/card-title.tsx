import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * The one display treatment for titles across the app. `PageHeader` reuses this
 * at a larger size so page and card titles can't drift apart again.
 */
export const headingTreatment = "font-heading font-extrabold"

/**
 * Title for a card surface. Always an <h2>, so the hierarchy stays
 * h1 (page, via PageHeader) → h2 (cards).
 */
export function CardTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <h2 className={cn("text-lg", headingTreatment, className)}>{children}</h2>
}
