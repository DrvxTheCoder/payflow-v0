import type { IconSvgElement } from "@hugeicons/react"
import type { LucideIcon } from "lucide-react"
import {
  Home04Icon,
  CreditCardIcon,
  Invoice01Icon,
  DashboardCircleIcon,
  HistoryIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"

/**
 * Single source of truth for app navigation.
 *
 * Both `components/sidebar.tsx` and `components/bottom-nav.tsx` read from this
 * array, so the two navs can never drift apart again. Active state is always
 * derived from `usePathname()` — never stored here.
 */
export type NavItem =
  | {
      label: string
      href: string
      icon: IconSvgElement
      hugeicons: true
      showInSidebar: boolean
      showInBottomNav: boolean
      status: "ready" | "placeholder"
    }
  | {
      label: string
      href: string
      icon: LucideIcon
      hugeicons?: false
      showInSidebar: boolean
      showInBottomNav: boolean
      status: "ready" | "placeholder"
    }

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home04Icon,
    hugeicons: true,
    showInSidebar: true,
    showInBottomNav: true,
    status: "ready",
  },
  {
    label: "Cards",
    href: "/cards",
    icon: CreditCardIcon,
    hugeicons: true,
    showInSidebar: true,
    showInBottomNav: true,
    status: "ready",
  },
  {
    label: "Receipts",
    href: "/receipts",
    icon: Invoice01Icon,
    hugeicons: true,
    showInSidebar: true,
    showInBottomNav: false,
    status: "placeholder",
  },
  {
    label: "Manage",
    href: "/manage",
    icon: DashboardCircleIcon,
    hugeicons: true,
    showInSidebar: true,
    showInBottomNav: false,
    status: "placeholder",
  },
  {
    label: "History",
    href: "/history",
    icon: HistoryIcon,
    hugeicons: true,
    showInSidebar: true,
    showInBottomNav: true,
    status: "ready",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings01Icon,
    hugeicons: true,
    showInSidebar: true,
    showInBottomNav: true,
    status: "ready",
  },
]

export const sidebarNavItems = navItems.filter((item) => item.showInSidebar)
export const bottomNavItems = navItems.filter((item) => item.showInBottomNav)

/** `/` matches only itself; every other route also matches its subpaths. */
export function isNavItemActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
