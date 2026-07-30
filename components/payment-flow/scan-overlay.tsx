"use client"

import { useCallback, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, FlashIcon, FlashOffIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { demoRecipient } from "@/lib/data"
import { buildPayload } from "@/lib/payment-flow"
import { QrScanner } from "./qr-scanner"
import { MyCard } from "./my-card"
import { SegmentedControl } from "./segmented-control"

type Tab = "scan" | "card"

const TABS = [
  { value: "scan", label: "Scan Code" },
  { value: "card", label: "My Card" },
] as const satisfies readonly { value: Tab; label: string }[]

export function ScanOverlay({
  active,
  detected,
  dimmed,
  onScan,
  onClose,
}: {
  /** False once the flow has moved past scanning — freezes and releases the camera. */
  active: boolean
  /** A code has just decoded, but the next screen has not arrived yet. */
  detected: boolean
  /** True while the Send Money screen is on top. */
  dimmed: boolean
  onScan: (raw: string) => void
  onClose: () => void
}) {
  const reduceMotion = useReducedMotion()
  const [tab, setTab] = useState<Tab>("scan")
  const [torchOn, setTorchOn] = useState(false)
  const [torchSupported, setTorchSupported] = useState(false)

  const isScanning = tab === "scan"

  const handleTorchSupported = useCallback((supported: boolean) => {
    setTorchSupported(supported)
    if (!supported) setTorchOn(false)
  }, [])

  return (
    <motion.div
      animate={
        dimmed
          ? { scale: reduceMotion ? 1 : 0.96, opacity: reduceMotion ? 1 : 0.5 }
          : { scale: 1, opacity: 1 }
      }
      transition={
        reduceMotion
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 300, damping: 30 }
      }
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden transition-colors duration-300",
        isScanning ? "bg-black" : "bg-background"
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Leaving the Scan tab tears the scanner down rather than hiding it, so
          it can't keep decoding — or holding the camera — behind My Card. */}
      {isScanning && (
        <QrScanner
          paused={!active}
          detected={detected}
          torchOn={torchOn}
          onScan={onScan}
          onTorchSupported={handleTorchSupported}
        >
          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={() => onScan(buildPayload(demoRecipient))}
              className="pointer-events-auto relative mt-8 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm"
            >
              Simulate scan (dev)
            </button>
          )}
        </QrScanner>
      )}

      {/* Chrome sits above the video, inset from the notch. */}
      <div className="relative z-10 flex items-start justify-between p-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close scanner"
          className={cn(
            "flex size-11 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2",
            isScanning
              ? "text-white focus-visible:ring-white/50 active:bg-white/15"
              : "text-foreground focus-visible:ring-ring active:bg-foreground/10"
          )}
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-7" />
        </button>

        {isScanning && torchSupported && (
          <button
            type="button"
            onClick={() => setTorchOn((on) => !on)}
            aria-label={torchOn ? "Turn off torch" : "Turn on torch"}
            aria-pressed={torchOn}
            className={cn(
              "flex size-11 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/50",
              torchOn ? "bg-white text-black" : "text-white active:bg-white/15"
            )}
          >
            <HugeiconsIcon
              icon={torchOn ? FlashIcon : FlashOffIcon}
              className="size-6"
            />
          </button>
        )}
      </div>

      {isScanning ? <div className="flex-1" /> : <MyCard />}

      <div className="relative z-10 px-4 pb-8">
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={TABS}
          tone={isScanning ? "onDark" : "onLight"}
        />
      </div>
    </motion.div>
  )
}
