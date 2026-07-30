import { ChevronRight } from "lucide-react"
import {
  AvatarGroup,
  AvatarGroupTooltip,
} from '@/components/vendor/animate-ui/components/animate/avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { recentContacts } from "@/lib/data"
import { CardTitle } from "@/components/card-title"
import { AddCircleHalfDotIcon, UserStoryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "../ui/button";

export function RecentContacts() {
  return (
      <div className="rounded-3xl flex flex-col justify-between bg-card p-5 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-sans">Recent Contacts</CardTitle>
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

        <AvatarGroup className="flex flex-wrap gap-2 w-full justify-center">
          {recentContacts.map((c) => (
            /* Focusable wrapper: the Avatar is a div, so keyboard users could
               never reach it and the name was hover-only. */
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <Avatar className="size-16 ring-4 ring-card cursor-pointer hover:-translate-y-1 ease-in-out transition-all">
                <AvatarImage src={c.avatar || "/placeholder.svg"} alt="" />
                <AvatarFallback>{c.name[0]}</AvatarFallback>
                <AvatarGroupTooltip>{c.name}</AvatarGroupTooltip>
              </Avatar>
            </button>
          ))}
        </AvatarGroup>

        <div className="mt-5 flex gap-3">
          <Button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <HugeiconsIcon icon={AddCircleHalfDotIcon} className="size-4" />
            Add new
          </Button>
          <Button variant={"outline"} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-6 text-sm font-medium transition-colors hover:bg-secondary">
            <HugeiconsIcon icon={UserStoryIcon} className="size-4" />
            Manage
          </Button>
        </div>
      </div>
  )
}
