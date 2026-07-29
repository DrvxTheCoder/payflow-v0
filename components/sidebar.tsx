"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Link2, Power } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from '@hugeicons/react'
import { Menu09Icon } from '@hugeicons/core-free-icons'
import { cn } from "@/lib/utils"
import { sidebarNavItems, isNavItemActive, type NavItem } from "@/lib/navigation"
import { TrustKycMark } from "./trustkyc-mark"

// 1. Extracted Nav Link element to a clean, isolated component to guarantee state tracking works
interface NavLinkProps {
  item: NavItem
  active: boolean
  collapsed: boolean
  isHovered: boolean
  onMouseEnter: () => void
}

function NavLink({ item, active, collapsed, isHovered, onMouseEnter }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      onMouseEnter={onMouseEnter}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-2xl p-1 text-sm font-medium transition-colors isolation-auto",
        collapsed && "justify-center px-0 size-12",
        active
          ? "bg-linear-to-r from-sidebar-foreground/15 to-sidebar-foreground/1 text-sidebar-foreground"
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
            className="absolute inset-0 z-0 rounded-2xl bg-sidebar-foreground/5 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 3. Added relative z-10 index layout classes to explicitly push contents forward */}
      <div className={cn("relative z-10 flex items-center justify-center size-10 bg-sidebar-foreground/5 rounded-xl text-sidebar-foreground", active && "bg-sidebar-foreground/20" )}>
        {item.hugeicons ? (
          <HugeiconsIcon icon={item.icon} className="size-5 shrink-0" />
        ) : (
          <item.icon className="size-5 shrink-0" />
        )}
        {/* Not-yet-built destination: subtle muted dot, never a disabled state */}
        {item.status === "placeholder" && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-sidebar-foreground/30"
          />
        )}
      </div>
      {!collapsed && <span className="relative z-10">{item.label}</span>}
    </Link>
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
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "dark:bg-background md:dark:bg-sidebar h-full shrink-0 flex-col gap-3 text-sidebar-foreground transition-[width] duration-300 ease-in-out overflow-hidden flex py-3 md:py-0",
        collapsed
          ? "w-0 px-0 lg:w-28 lg:px-3"
          : "w-72 px-3 lg:w-68",
      )}
    >
      {/* Inner capsule: branding + nav */}
      <div className="flex flex-col rounded-3xl bg-linear-to-b from-sidebar-foreground/8 to-sidebar-foreground/2 p-3 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5 overflow-hidden">
        {/* Logo + hamburger */}
        <div
          className={cn(
            "flex items-center px-3 py-3 min-w-fit",
            collapsed ? "" : "justify-between",
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <TrustKycMark variant="filled" className="size-10" />
            {!collapsed && (
              <span className="text-lg tracking-tight font-heading">
                payflow<small className="text-xs align-super">™</small>
              </span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="rounded-full p-2 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground cursor-pointer"
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
            "mt-5 flex flex-col gap-1 min-w-fit px-2 cursor-pointer",
            collapsed && "pl-2"
          )}
        >
          {sidebarNavItems.map((item) => {
            const active = isNavItemActive(pathname, item.href)
            return collapsed ? (
            <Tooltip key={item.label}>
              <TooltipTrigger
                render={
                  <div>
                    <NavLink
                      item={item}
                      active={active}
                      collapsed={collapsed}
                      isHovered={hoveredItem === item.label}
                      onMouseEnter={() => setHoveredItem(item.label)}
                    />
                  </div>
                }
              />
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
            ) : (
              <div key={item.label}>
                <NavLink
                  item={item}
                  active={active}
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
      <Tooltip>
        <TooltipTrigger className="w-full" render={
          <button
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-sidebar-foreground/15 px-3 py-3 text-sm font-medium text-sidebar-foreground/55 transition-colors hover:border-sidebar-foreground/30 hover:text-sidebar-foreground overflow-hidden cursor-pointer",
              collapsed && "px-0",
            )}
            aria-label="Add quick-link"
          >
            <Link2 className="size-4 shrink-0" />
          </button>
        }>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Add quick-link</p>
        </TooltipContent>
      </Tooltip>

      {/* Profile (outside capsule, bottom) */}
      <div className="mt-auto">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl p-6",
            collapsed ? "" : "bg-sidebar-foreground/5",
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
                className="size-10 text-sidebar-foreground/60 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground rounded-full"
                aria-label="Sign out"
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
