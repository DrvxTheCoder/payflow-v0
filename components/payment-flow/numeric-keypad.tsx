"use client"

import { useCallback, useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const

/** Long-pressing backspace clears the field instead of deleting one digit. */
const CLEAR_HOLD_MS = 500

export function NumericKeypad({
  onDigit,
  onBackspace,
  onClear,
}: {
  onDigit: (digit: string) => void
  onBackspace: () => void
  onClear: () => void
}) {
  const reduceMotion = useReducedMotion()
  const holdTimer = useRef<number | null>(null)
  const didClear = useRef(false)

  const cancelHold = useCallback(() => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
  }, [])

  useEffect(() => cancelHold, [cancelHold])

  const startHold = useCallback(() => {
    didClear.current = false
    cancelHold()
    holdTimer.current = window.setTimeout(() => {
      didClear.current = true
      onClear()
    }, CLEAR_HOLD_MS)
  }, [cancelHold, onClear])

  const endHold = useCallback(() => {
    cancelHold()
    if (!didClear.current) onBackspace()
    didClear.current = false
  }, [cancelHold, onBackspace])

  const tap = reduceMotion ? undefined : { scale: 0.94 }
  const transition = { type: "spring", stiffness: 500, damping: 32 } as const

  return (
    <div
      className="grid grid-cols-3 gap-2 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      role="group"
      aria-label="Amount keypad"
    >
      {KEYS.slice(0, 9).map((key) => (
        <motion.button
          key={key}
          type="button"
          whileTap={tap}
          transition={transition}
          onClick={() => onDigit(key)}
          className="rounded-2xl bg-card py-3.5 font-heading text-2xl text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring active:bg-muted"
        >
          {key}
        </motion.button>
      ))}

      <span aria-hidden="true" />

      <motion.button
        type="button"
        whileTap={tap}
        transition={transition}
        onClick={() => onDigit("0")}
        className="rounded-2xl bg-card py-3.5 font-heading text-2xl text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring active:bg-muted"
      >
        0
      </motion.button>

      <motion.button
        type="button"
        whileTap={tap}
        transition={transition}
        aria-label="Delete — hold to clear"
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
        onContextMenu={(event) => event.preventDefault()}
        className="flex items-center justify-center rounded-2xl py-3.5 text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring active:bg-muted"
      >
        <HugeiconsIcon icon={Delete02Icon} className="size-7" />
      </motion.button>
    </div>
  )
}
