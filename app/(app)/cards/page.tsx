import type { Metadata } from "next"
import { HugeiconsIcon } from "@hugeicons/react"
import { CreditCardAddIcon } from "@hugeicons/core-free-icons"
import { PageHeader } from "@/components/page-header"
import AddCardDialog, { VisaLogo } from "@/components/widgets/add-card-dialog"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Payflow — Cards",
}

const cards = [
  {
    label: "Payflow Platinum",
    holder: "ROBERT DOE",
    last4: "4419",
    expiry: "08/28",
    tone: "primary" as const,
  },
  {
    label: "Payflow Everyday",
    holder: "ROBERT DOE",
    last4: "2087",
    expiry: "11/27",
    tone: "muted" as const,
  },
]

function CardVisual({
  label,
  holder,
  last4,
  expiry,
  tone,
}: (typeof cards)[number]) {
  return (
    <div
      className={cn(
        "flex aspect-[1.586/1] flex-col justify-between rounded-[2rem] p-6 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5",
        tone === "primary"
          ? "bg-balance-card text-balance-card-foreground"
          : "bg-muted text-foreground",
      )}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-heading font-extrabold">{label}</h2>
        <VisaLogo className="h-5 w-auto" />
      </div>
      <div>
        <p className="font-mono text-lg tracking-[0.14em] tabular-nums">
          •••• •••• •••• {last4}
        </p>
        <div className="mt-3 flex items-end justify-between text-xs uppercase tracking-[0.2em] opacity-70">
          <span className="truncate">{holder}</span>
          <span className="font-mono">{expiry}</span>
        </div>
      </div>
    </div>
  )
}

export default function CardsPage() {
  return (
    <div className="mx-2 pb-6 pt-3">
      <PageHeader
        title="Cards"
        description="Your physical and virtual Payflow cards."
        actions={
          <AddCardDialog
            trigger={
              <button className="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <HugeiconsIcon icon={CreditCardAddIcon} className="size-4" />
                Add card
              </button>
            }
          />
        }
      />
      <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 md:px-3 xl:grid-cols-3">
        {cards.map((card) => (
          <CardVisual key={card.last4} {...card} />
        ))}

        <AddCardDialog
          trigger={
            <button className="flex aspect-[1.586/1] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[2rem] border-2 border-dashed border-foreground/10 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
              <HugeiconsIcon icon={CreditCardAddIcon} className="size-6" />
              Add card
            </button>
          }
        />
      </div>
    </div>
  )
}
