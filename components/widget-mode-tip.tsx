"use client"

import * as React from "react"
import { X } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquareEditIcon } from "@hugeicons/core-free-icons"

const STORAGE_KEY = "payflow.widget-mode-tip.dismissed"

/**
 * One-time onboarding tip for Widget Mode, anchored to the control it describes.
 * It used to rotate through the promo carousel, where feature education competed
 * with marketing and could be missed entirely.
 */
export function WidgetModeTip() {
  const [visible, setVisible] = React.useState(false)

  // Read after mount so the server and client markup agree
  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "true") setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // Storage unavailable — the tip simply returns next session
    }
  }

  if (!visible) return null

  return (
    <div className="absolute right-0 top-full z-30 mt-2 hidden w-64 rounded-3xl bg-card p-5 shadow-md shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5 md:block">
      <div className="flex items-start justify-between gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-sidebar-foreground/5 text-muted-foreground">
          <HugeiconsIcon icon={DashboardSquareEditIcon} className="size-4" />
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss Widget Mode tip"
          className="flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      <p className="mt-3 text-sm font-medium">Widget Mode</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Use this button to drag your widgets into the layout you want.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-4 w-full cursor-pointer rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Got it
      </button>
    </div>
  )
}
