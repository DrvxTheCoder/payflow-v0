"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PayflowMark } from "@/components/payflow-mark"

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const hideTimer = setTimeout(() => setVisible(false), 3000)
    // Let the bar grow on the next tick so the CSS transition has a
    // 0% starting frame to animate from (avoids a mobile-browser jump-cut).
    const startTimer = setTimeout(() => setProgress(100), 16)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(startTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-100 flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background"
          initial={{ opacity: 1, }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          // initial={{ y: 0 }}
          // exit={{ y: "-100%" }}
          // transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-secondary">
            <PayflowMark className="size-10" />
          </span>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-foreground/15">
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-2900 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
