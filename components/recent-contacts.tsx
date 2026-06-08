import { ChevronRight, Plus, Pencil, LayoutGrid, CirclePlus, UserRoundPen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { recentContacts } from "@/lib/data"
import { DashboardSquareAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function RecentContacts() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[2rem] bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Contacts</h2>
            <p className="text-sm text-muted-foreground">
              Send or Request from your contact list
            </p>
          </div>
          <button
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="View all contacts"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {recentContacts.map((c) => (
            <Avatar
              key={c.name}
              className="size-12 ring-2 ring-card"
            >
              <AvatarImage src={c.avatar || "/placeholder.svg"} alt={c.name} />
              <AvatarFallback>{c.name[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <CirclePlus className="size-4" />
            Add new
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
            <UserRoundPen className="size-4" />
            Manage
          </button>
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 rounded-3xl border border-dashed border-foreground/20 py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
        <HugeiconsIcon icon={DashboardSquareAddIcon} className="size-4" />
        Add or Manage widgets
      </button>
    </div>
  )
}
