"use client"

import { QRCodeSVG } from "qrcode.react"
import { motion, useReducedMotion } from "motion/react"
import { PayflowMark } from "@/components/payflow-mark"
import { myCard } from "@/lib/data"
import { buildPayload } from "@/lib/payment-flow"

export function MyCard() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex flex-1 items-center justify-center px-8">
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 300, damping: 30 }
        }
        className="relative w-full max-w-xs overflow-hidden rounded-[2rem] bg-chart-1 p-6 shadow-xl"
      >
        {/* Repeating diagonal weave, kept low-contrast so it never competes
            with the code's quiet zone. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(45deg,transparent_0_14px,rgba(0,0,0,0.28)_14px_20px),repeating-linear-gradient(-45deg,transparent_0_14px,rgba(0,0,0,0.16)_14px_20px)]"
        />

        <div className="relative flex flex-col gap-6">
          <div className="rounded-3xl bg-white p-5">
            <QRCodeSVG
              value={buildPayload(myCard)}
              level="M"
              marginSize={0}
              className="h-auto w-full"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <div className="flex items-end justify-between gap-3">
            <PayflowMark className="size-8 text-black" />
            <div className="text-right">
              <p className="font-heading text-base leading-tight text-black">
                {myCard.name}
              </p>
              <p className="text-sm text-black/60">{myCard.phone}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
