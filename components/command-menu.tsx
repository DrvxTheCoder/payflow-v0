"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Command as CommandIcon
} from "lucide-react"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { navItems } from "@/lib/navigation"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [isMac, setIsMac] = React.useState(false)
  const router = useRouter()

  // Detect after mount so the badge can't cause a hydration mismatch
  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform ?? navigator.userAgent))
  }, [])

  // ⌘K / Ctrl+K — the universal command-palette shortcut. ⌘F means find-in-page
  // and is likely already claimed by the Tauri webview.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <div className="hidden md:flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
        className="p-2 flex flex-row items-center gap-6 md:gap-12 px-4 rounded-full w-fit border border-muted-foreground/20 cursor-pointer hover:bg-muted-foreground/10 transition-colors"
      >
        <div className="w-fit md:w-full flex justify-between items-center md:gap-8">
        <span className="text-muted-foreground text-sm hidden md:block">Search...</span>
        <Search className="text-muted-foreground size-5 md:hidden" />
        <div className="hidden md:flex flex-row justify-items-center">
            <span className=" flex items-center gap-1 rounded-full bg-card px-3 py-2 text-xs font-medium text-muted-foreground">
              {isMac ? <CommandIcon className="size-3" /> : "Ctrl + "}K
            </span>
        </div>
        </div>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Go to" className="p-4">
              {navItems.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.label}
                  onSelect={() => go(item.href)}
                >
                  {item.hugeicons ? (
                    <HugeiconsIcon icon={item.icon} className="size-4" />
                  ) : (
                    <item.icon className="size-4" />
                  )}
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
