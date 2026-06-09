"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
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
import { 
  TooltipProvider, 
  Tooltip as Ttip, 
  TooltipContent as TtipContent, 
  TooltipTrigger as TtipTrigger } from "@/components/animate-ui/components/animate/tooltip"
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

// 1. Extracted Nav Link element to a clean, isolated component to guarantee state tracking works
interface NavLinkProps {
  item: SidebarNavItem
  collapsed: boolean
  isHovered: boolean
  onMouseEnter: () => void
}

function NavLink({ item, collapsed, isHovered, onMouseEnter }: NavLinkProps) {
  return (
    <a
      href="#"
      onMouseEnter={onMouseEnter}
      className={cn(
        "relative flex items-center gap-3 rounded-2xl p-1 text-sm font-medium transition-colors isolation-auto",
        collapsed && "justify-center px-0 size-12",
        item.active
          ? "bg-linear-to-r from-white/15 to-white/1 text-sidebar-foreground"
          : "text-sidebar-foreground/55 hover:text-sidebar-foreground",
      )}
    >
      {/* 2. The Shared Layout Animation Capsule Layer */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            layoutId="sidebar-hover-pill"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 28,
            }}
            className="absolute inset-0 z-0 rounded-2xl bg-white/5 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 3. Added relative z-10 index layout classes to explicitly push contents forward */}
      <div className={cn("relative z-10 flex items-center justify-center size-10 bg-white/5 rounded-xl text-sidebar-foreground", item.active && "bg-white/20" )}>
        {item.hugeicons ? (
          <HugeiconsIcon icon={item.icon} className="size-5 shrink-0" />
        ) : (
          <item.icon className="size-5 shrink-0" />
        )}
      </div>
      {!collapsed && <span className="relative z-10">{item.label}</span>}
    </a>
  )
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col gap-3 px-3 text-sidebar-foreground transition-[width] duration-400 md:flex ",
        collapsed ? "w-28" : "w-68",
      )}
    >
      {/* Inner capsule: branding + nav */}
      <div className="flex flex-col rounded-[1.75rem] bg-linear-to-b from-white/8 to-white/2 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-white/5 overflow-hidden">
        {/* Logo + hamburger */}
        <div
          className={cn(
            "flex items-center px-3 py-3 min-w-fit",
            collapsed ? "" : "justify-between",
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
        <nav 
          onMouseLeave={() => setHoveredItem(null)}
          className={cn(
            "mt-5 flex flex-col gap-1 min-w-fit px-2",
            collapsed && "pl-2"
          )}
        >
          {navItems.map((item) => {
            return collapsed ? (
              <Tooltip key={item.label}>
                <TooltipTrigger>
                  <div>
                    <NavLink
                      item={item}
                      collapsed={collapsed}
                      isHovered={hoveredItem === item.label}
                      onMouseEnter={() => setHoveredItem(item.label)}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.label}>
                <NavLink
                  item={item}
                  collapsed={collapsed}
                  isHovered={hoveredItem === item.label}
                  onMouseEnter={() => setHoveredItem(item.label)}
                />
              </div>
            )
          })}
        </nav>
      </div>

      {/* Add a section (outside capsule) */}
      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <button
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-3 py-3 text-sm font-medium text-sidebar-foreground/55 transition-colors hover:border-white/30 hover:text-sidebar-foreground overflow-hidden cursor-pointer",
              collapsed && "px-0",
            )}
          >
            <Link2 className="size-4 shrink-0" />
            {/* {!collapsed && <span className="text-nowrap">Add quick-link</span>} */}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Add quick-link</p>
        </TooltipContent>
      </Tooltip>
      </TooltipProvider>

      {/* Profile (outside capsule, bottom) */}
      <div className="mt-auto">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl p-6",
            collapsed ? "" : "bg-white/5",
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