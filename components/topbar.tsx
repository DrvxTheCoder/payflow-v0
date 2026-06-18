"use client"

import { Search, Bell, Mail, Command, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu09Icon } from "@hugeicons/core-free-icons"
import { BellIconAnimated } from "./animated/icons/animated-bell-icon"
import { ModeToggle } from "@/components/theme-toggle"
import { CommandMenu } from "@/components/command-menu"

export function Topbar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <header className="flex items-center justify-between gap-4 p-6 px-4 sticky top-0 z-30 bg-background/50 backdrop-blur rounded-t-3xl">
      <div className="flex flex-1 items-center gap-3">
        {collapsed && (
          <button
            onClick={onToggle}
            className="flex shrink-0 items-center justify-center p-2 rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Expand sidebar"
          >
            <HugeiconsIcon icon={Menu09Icon} className="size-5 text-primary" />
          </button>
        )}
        <CommandMenu />
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
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
