import { ChevronRight, Plus, Pencil, LayoutGrid, CirclePlus, UserRoundPen } from "lucide-react"
import {
  AvatarGroup,
  AvatarGroupTooltip,
} from '@/components/animate-ui/components/animate/avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { recentContacts } from "@/lib/data"
import { DashboardSquareAddIcon, AddCircleHalfDotIcon, UserStoryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "./ui/button";

export function RecentContacts() {
  return (
      <div className="rounded-3xl flex flex-col justify-between bg-card p-5 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
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

        <AvatarGroup className="mt-5 flex flex-wrap gap-2">
          {recentContacts.map((c) => (
            <Avatar
              key={c.name}
              className="size-12 ring-2 ring-card cursor-pointer"
            >
              <AvatarImage src={c.avatar || "/placeholder.svg"} alt={c.name} />
              <AvatarFallback>{c.name[0]}</AvatarFallback>
              <AvatarGroupTooltip>{c.name}</AvatarGroupTooltip>
            </Avatar>
          ))}
        </AvatarGroup>

        <div className="mt-5 flex gap-3">
          <Button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <HugeiconsIcon icon={AddCircleHalfDotIcon} className="size-4" />
            Add new
          </Button>
          <Button variant={"outline"} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-5 text-sm font-medium transition-colors hover:bg-secondary">
            <HugeiconsIcon icon={UserStoryIcon} className="size-4" />
            Manage
          </Button>
        </div>
      </div>
  )
}
