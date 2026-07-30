"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import type { Contact } from "@/lib/data"
import { formatAmount } from "@/lib/payment-flow"

export function TransactionModal({
  phase,
  recipient,
  send,
}: {
  phase: "submitting" | "success"
  recipient: Contact
  send: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* `layout` animates the container's height as the two states swap, so the
          card grows into the success content instead of snapping. */}
      <motion.div
        layout
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 300, damping: 30 }
        }
        className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-card p-8 shadow-2xl"
      >
        <AnimatePresence mode="wait" initial={false}>
          {phase === "submitting" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center gap-5"
            >
              <span className="size-12 rounded-full border-[3px] border-muted border-t-foreground motion-safe:animate-spin" />
              <p className="text-base font-bold text-muted-foreground">Sending…</p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-success/15">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-8 text-success"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M5 12.5 10 17.5 19 7"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: reduceMotion ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.4,
                      ease: "easeOut",
                      delay: reduceMotion ? 0 : 0.08,
                    }}
                  />
                </svg>
              </span>

              <div className="space-y-1">
                <p className="font-heading text-2xl text-foreground">
                  {formatAmount(send)}
                </p>
                <p className="text-sm text-muted-foreground">
                  sent to {recipient.name}
                </p>
              </div>

              <Image
                src={recipient.avatar}
                alt=""
                width={80}
                height={80}
                className="size-10 rounded-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
