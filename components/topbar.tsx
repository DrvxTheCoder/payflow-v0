"use client"

import { Search, Bell, Mail, Command, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu09Icon } from "@hugeicons/core-free-icons"
import { BellIconAnimated } from "./animated/icons/animated-bell-icon"

export function Topbar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <header className="flex items-center justify-between gap-4 p-6 sticky top-0 z-10 bg-background/50 backdrop-blur rounded-t-3xl">
      <div className="flex flex-1 items-center gap-3">
        {collapsed && (
          <button
            onClick={onToggle}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Expand sidebar"
          >
            <HugeiconsIcon icon={Menu09Icon} className="size-5 text-primary" />
          </button>
        )}
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search anything..."
            aria-label="Search"
            className="h-11 w-full rounded-full border border-primary/10 pl-11 pr-20 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-card px-3 py-2 text-xs font-medium text-muted-foreground">
            <Command className="size-3" />F
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-lg"
          className="relative rounded-full bg-card"
          aria-label="Notifications"
        >
          {/* <Bell className="size-4" /> */}
          <BellIconAnimated className="size-4" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-destructive ring-1 ring-card" />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          className="rounded-full bg-card"
          aria-label="Messages"
        >
          <Mail className="size-4" />
        </Button>
      </div>
    </header>
  )
}
