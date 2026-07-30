"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export type SegmentedOption<T extends string> = {
  value: T
  label: string
}

/**
 * Two-up switch with a sliding thumb. `tone` follows the surface it sits on —
 * the scanner is black, My Card is the app background — so the control inverts
 * with the shell rather than carrying its own colours.
 */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  tone,
  className,
}: {
  value: T
  onChange: (value: T) => void
  options: readonly SegmentedOption<T>[]
  tone: "onDark" | "onLight"
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      role="tablist"
      className={cn(
        "relative flex w-full rounded-full p-1",
        tone === "onDark" ? "bg-white/12" : "bg-foreground/10",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className="relative z-10 flex-1 rounded-full px-4 py-3 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-current/40"
          >
            {isActive && (
              <motion.span
                layoutId="segmented-control-thumb"
                aria-hidden="true"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 30 }
                }
                className={cn(
                  "absolute inset-0 -z-10 rounded-full",
                  tone === "onDark" ? "bg-white" : "bg-background"
                )}
              />
            )}
            <span
              className={cn(
                "transition-colors",
                isActive
                  ? tone === "onDark"
                    ? "text-black"
                    : "text-foreground"
                  : tone === "onDark"
                    ? "text-white/70"
                    : "text-muted-foreground"
              )}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
