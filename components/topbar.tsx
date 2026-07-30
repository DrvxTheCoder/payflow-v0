"use client"

import * as React from "react"
import { Mail, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { CustomerSupportIcon, DashboardSquareEditIcon, Menu09Icon } from "@hugeicons/core-free-icons"
import { BellIconAnimated } from "./vendor/animated/icons/animated-bell-icon"
import { CommandMenu } from "@/components/command-menu"
import { ThemeTogglerButton } from "./vendor/animate-ui/components/buttons/theme-toggler"
import { useWidgetEdit } from "@/components/widget-edit-context"
import { WidgetModeTip } from "@/components/widget-mode-tip"
import { UserAvatarDropDown } from "./user-avatar-dropdown"

// Mirrors the default cycle in ThemeTogglerButton so the label can name what
// clicking will actually do.
const THEME_CYCLE = ["light", "dark", "system"] as const

export function Topbar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const { isEditing: isEditingWidget, setIsEditing, hasGrid } = useWidgetEdit()
  const toggleEditWidget = () => setIsEditing((prev) => !prev)

  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const current = mounted && theme ? theme : "system"
  const nextTheme =
    THEME_CYCLE[(THEME_CYCLE.indexOf(current as (typeof THEME_CYCLE)[number]) + 1) % THEME_CYCLE.length]
  const themeLabel = `Switch theme`

  return (
    <header className="flex items-center justify-between gap-4 py-3 md:py-6 px-4 sticky top-0 z-20 bg-background md:rounded-t-3xl">
      <div className="flex flex-row items-center gap-3">
        {collapsed && (
          <button
            onClick={onToggle}
            className="hidden md:flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground cursor-pointer"
            aria-label="Expand sidebar"
          >
            <HugeiconsIcon icon={Menu09Icon} className="size-5 text-primary" />
          </button>
        )}
        <CommandMenu />
        <span className="md:hidden">
          <UserAvatarDropDown />
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Desktop-only Widget Drag/Edit Toggle Button — only on routes with a grid */}
        {hasGrid && (
          <div className="relative">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant={isEditingWidget ? "default" : "outline"}
                    size="icon-lg"
                    onClick={toggleEditWidget}
                    className={`hidden md:flex rounded-full transition-all ${
                      isEditingWidget
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label={
                      isEditingWidget ? "Done arranging widgets" : "Arrange widgets"
                    }
                  >
                    {isEditingWidget ? (
                      <Check className="size-4" />
                    ) : (
                      <HugeiconsIcon icon={DashboardSquareEditIcon} className="size-4" />
                    )}
                  </Button>
                }
              />
              <TooltipContent side="bottom">
                {isEditingWidget ? "Done arranging widgets" : "Arrange widgets"}
              </TooltipContent>
            </Tooltip>
            <WidgetModeTip />
          </div>
        )}
        {/* Outlined: secondary to the notification bell, which carries an unread state */}
        <Tooltip>
          <TooltipTrigger
            render={
              <ThemeTogglerButton
                variant="outline"
                size="lg"
                className="rounded-full cursor-pointer hidden md:flex"
                direction="btt"
                aria-label={themeLabel}
              />
            }
          />
          <TooltipContent side="bottom">{themeLabel}</TooltipContent>
        </Tooltip>
        <Button
          variant="default"
          size="icon-lg"
          className="relative rounded-full"
          aria-label="Notifications, 1 unread"
        >
          <BellIconAnimated className="size-4" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-destructive ring-1 ring-primary" />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          className="relative rounded-full"
          aria-label="Support"
        >
          <HugeiconsIcon icon={CustomerSupportIcon} className="size-4" />
        </Button>
      </div>
    </header>
  )
}