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
          className="absolute inset-0 opacity-25 bg-chart-1"
        />

        <div className="relative flex flex-col gap-6">
          <div className="relative rounded-xl bg-white p-5">
            {/* Level H so the modules hidden behind the centred mark stay recoverable. */}
            <QRCodeSVG
              value={buildPayload(myCard)}
              level="H"
              marginSize={0}
              className="h-auto w-full"
              bgColor="#ffffff"
              fgColor="#000000"
            />
            {/* inset-5 matches the wrapper padding, so percentages below are
                relative to the code itself rather than the padded box. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-5 flex items-center justify-center"
            >
              <span className="flex aspect-square w-[22%] items-center justify-center rounded-lg bg-white">
                <PayflowMark
                  variant="filled"
                  className="h-auto w-[78%] text-black"
                />
              </span>
            </span>
          </div>

          <div className="text-center">
            <p className="font-heading text-base leading-tight text-black">
              {myCard.name}
            </p>
            <p className="text-sm text-black/60">{myCard.phone}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
