"use client"

import {
  LayoutDashboard,
  CreditCard,
  ReceiptText,
  LayoutGrid,
  History,
  Menu,
  Settings,
  Plus,
  Power,
  Link,
  Link2,
  type LucideIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PayflowMark } from "@/components/payflow-mark"
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Menu09Icon, Home04Icon, CreditCardIcon, Invoice01Icon, DashboardCircleIcon, HistoryIcon } from '@hugeicons/core-free-icons'
import { cn } from "@/lib/utils"

type SidebarNavItem =
  | {
      label: string
      icon: IconSvgElement
      hugeicons: true
      active: boolean
    }
  | {
      label: string
      icon: LucideIcon
      hugeicons?: false
      active: boolean
    }

const navItems: SidebarNavItem[] = [
  { label: "Dashboard", icon: Home04Icon, hugeicons: true, active: true },
  { label: "Cards", icon: CreditCardIcon, hugeicons: true, active: false },
  { label: "Receipts", icon: Invoice01Icon, hugeicons: true, active: false },
  { label: "Manage", icon: DashboardCircleIcon, hugeicons: true, active: false },
  { label: "History", icon: HistoryIcon, hugeicons: true, active: false },
]

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col gap-3 px-3 text-sidebar-foreground transition-[width] duration-400 md:flex ",
        collapsed ? "w-28" : "min-w-46 w-68",
      )}
    >
      {/* Inner capsule: branding + nav */}
      <div className="flex flex-col rounded-[1.75rem] bg-linear-to-b from-white/8 to-white/2 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-white/5">
        {/* Logo + hamburger */}
        <div
          className={cn(
            "flex items-center px-1 py-3",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-sidebar">
              <PayflowMark className="size-6" />
            </span>
            {!collapsed && (
              <span className="text-lg font-semibold tracking-tight">
                payflow<small className="text-xs align-super">™</small>
              </span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="rounded-full p-2 text-sidebar-foreground/60 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
              aria-label="Collapse sidebar"
            >
              <HugeiconsIcon icon={Menu09Icon} className="size-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className={cn(
            "mt-5 flex flex-col gap-1",
            collapsed && "items-center justify-items-center "
          )}>
          {navItems.map((item) => {
            const link = (
              <a
                href="#"
                className={cn(
                  "flex items-center gap-3 rounded-2xl p-1 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0 size-12",
                  item.active
                    ? "bg-linear-to-r from-white/15 to-white/1 text-sidebar-foreground"
                    : "text-sidebar-foreground/55 hover:bg-white/5 hover:text-sidebar-foreground",
                )}
              >
                <div className={cn("flex items-center justify-center size-10 bg-white/5 rounded-xl text-sidebar-foreground", item.active && "bg-white/20" )}>
                  {item.hugeicons ? (
                    <HugeiconsIcon icon={item.icon} className="size-5 shrink-0" />
                  ) : (
                    <item.icon className="size-5 shrink-0" />
                  )}
                </div>
                {!collapsed && <span>{item.label}</span>}
              </a>
            )

            return collapsed ? (
              <Tooltip key={item.label}>
                <TooltipTrigger render={link} />
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.label}>{link}</div>
            )
          })}
        </nav>
      </div>

      {/* Add a section (outside capsule) */}
      <button
        className={cn(
          "flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-3 py-3 text-sm font-medium text-sidebar-foreground/55 transition-colors hover:border-white/30 hover:text-sidebar-foreground",
          collapsed && "px-0",
        )}
      >
        <Link2 className="size-4 shrink-0" />
        {!collapsed && <span className="text-nowrap">Add quick-link</span>}
      </button>

      {/* Profile (outside capsule, bottom) */}
      <div className="mt-auto">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl p-6",
            collapsed ? "justify-center p-0" : "bg-white/5",
          )}
        >
          <Avatar className="size-10 shrink-0">
            <AvatarImage src="/avatars/robert.png" alt="Robert Doe" />
            <AvatarFallback>RD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Robert Doe</p>
                <p className="truncate text-xs text-sidebar-foreground/50">
                  rob.doe@brisk.com
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 text-sidebar-foreground/60 hover:bg-white/10 hover:text-sidebar-foreground rounded-full"
                aria-label="Settings"
              >
                <Power className="size-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
