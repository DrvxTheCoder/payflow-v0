"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  CameraOff01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import type {
  IDetectedBarcode,
  IScannerError,
  IScannerHandle,
  ScannerErrorKind,
} from "@yudiel/react-qr-scanner"

/* The package ships a ZXing WASM BarcodeDetector polyfill — Safari has no
   native one — so it must stay out of the server bundle and off the critical
   path until the user actually opens the scanner. */
const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false }
)

type CameraState =
  | { status: "pending" }
  | { status: "live" }
  | { status: "error"; kind: ScannerErrorKind; message: string }

const ERROR_COPY: Partial<
  Record<ScannerErrorKind, { title: string; body: string }>
> = {
  "permission-denied": {
    title: "Camera access needed",
    body: "Allow camera access in your browser settings, then reopen the scanner.",
  },
  "no-camera": {
    title: "No camera found",
    body: "This device has no camera available for scanning.",
  },
  "in-use": {
    title: "Camera busy",
    body: "Another app is using the camera. Close it and try again.",
  },
  "insecure-context": {
    title: "Secure connection required",
    body: "Cameras only work over HTTPS or on localhost. Open the app over a secure origin.",
  },
  unsupported: {
    title: "Scanning unavailable",
    body: "This browser can't decode QR codes.",
  },
}

function ErrorState({
  kind,
  message,
  children,
}: {
  kind: ScannerErrorKind
  message: string
  children?: React.ReactNode
}) {
  const copy = ERROR_COPY[kind] ?? {
    title: "Camera unavailable",
    body: message || "Something went wrong starting the camera.",
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-10 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-white/10">
        <HugeiconsIcon
          icon={kind === "permission-denied" ? CameraOff01Icon : Alert02Icon}
          className="size-7 text-white"
        />
      </span>
      <div className="space-y-1.5">
        <p className="font-heading text-lg text-white">{copy.title}</p>
        <p className="text-sm text-white/70">{copy.body}</p>
      </div>
      {children}
    </div>
  )
}

export function QrScanner({
  paused,
  detected,
  torchOn,
  onScan,
  onTorchSupported,
  children,
}: {
  paused: boolean
  /** A code has just decoded — acknowledge it before the screen changes. */
  detected: boolean
  torchOn: boolean
  onScan: (raw: string) => void
  /** Reports whether the active track can actually drive the torch. */
  onTorchSupported: (supported: boolean) => void
  /** Rendered beneath the viewfinder — the dev simulate-scan affordance. */
  children?: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()
  const handleRef = useRef<IScannerHandle>(null)
  /* Our own handle on the stream. The imperative ref is detached during unmount,
     so reading it from a cleanup is a race — this copy always survives. */
  const streamRef = useRef<MediaStream | null>(null)
  const [camera, setCamera] = useState<CameraState>({ status: "pending" })

  const handleScan = useCallback(
    (codes: IDetectedBarcode[]) => {
      const raw = codes[0]?.rawValue
      if (raw) onScan(raw)
    },
    [onScan]
  )

  const handleError = useCallback(
    (error: IScannerError) => {
      setCamera({ status: "error", kind: error.kind, message: error.message })
      onTorchSupported(false)
    },
    [onTorchSupported]
  )

  /* No onReady callback on the library, so poll the imperative handle until a
     stream exists. That's also the first moment torch capability is knowable. */
  useEffect(() => {
    if (paused) return

    let cancelled = false
    const interval = window.setInterval(() => {
      const stream = handleRef.current?.getStream()
      const track = stream?.getVideoTracks()[0]
      if (!stream || !track || cancelled) return

      window.clearInterval(interval)
      streamRef.current = stream
      setCamera((prev) => (prev.status === "error" ? prev : { status: "live" }))

      const capabilities = track.getCapabilities?.() as
        | (MediaTrackCapabilities & { torch?: boolean })
        | undefined
      onTorchSupported(Boolean(capabilities?.torch))
    }, 200)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [paused, onTorchSupported])

  /* Torch rides on the live track rather than the library's own control, which
     we've disabled in favour of the overlay button. */
  useEffect(() => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track || camera.status !== "live") return

    void track
      .applyConstraints({
        advanced: [{ torch: torchOn } as MediaTrackConstraintSet],
      })
      .catch(() => onTorchSupported(false))
  }, [torchOn, camera.status, onTorchSupported])

  /* Belt and braces: the library stops tracks on unmount and when paused, but
     an orphaned stream leaves the OS camera indicator lit, so stop explicitly. */
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <Scanner
        ref={handleRef}
        onScan={handleScan}
        onError={handleError}
        paused={paused}
        scanDelay={300}
        sound={false}
        constraints={{ facingMode: "environment" }}
        formats={["qr_code"]}
        components={{ finder: false, torch: false, zoom: false, onOff: false }}
        styles={{
          container: { width: "100%", height: "100%", position: "absolute", inset: 0 },
          video: { width: "100%", height: "100%", objectFit: "cover" },
        }}
      >
        {camera.status === "error" ? (
          <ErrorState kind={camera.kind} message={camera.message}>
            {children}
          </ErrorState>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Viewfinder: a transparent square punched out of a dimmed field.
                An outsized ring draws the scrim so there's no second element to
                keep in sync with the cutout. */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              animate={{
                opacity: 1,
                // Snap in on a hit so the beat before the next screen reads as
                // acknowledgement rather than lag.
                scale: reduceMotion || !detected ? 1 : 0.95,
              }}
              transition={
                reduceMotion
                  ? { duration: 0.2 }
                  : { type: "spring", stiffness: 400, damping: 24, delay: detected ? 0 : 0.15 }
              }
              className="relative -mt-16 aspect-square w-[80%] max-w-sm rounded-[2.5rem] shadow-[0_0_0_100vmax_rgba(0,0,0,0.55)]"
            >
              <motion.span
                animate={{ opacity: detected ? 1 : 0.7 }}
                transition={{ duration: 0.15 }}
                className={
                  detected
                    ? "absolute inset-0 rounded-[2.5rem] ring-4 ring-white"
                    : "absolute inset-0 rounded-[2.5rem] ring-2 ring-white"
                }
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.25 }}
              className="relative mt-8 px-10 text-center text-lg font-medium text-white"
            >
              {camera.status === "pending"
                ? "Starting camera…"
                : "Scan a QR code to pay or send"}
            </motion.p>

            {camera.status === "pending" && (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="relative mt-4 size-5 animate-spin text-white/60"
              />
            )}

            {children}
          </div>
        )}
      </Scanner>
    </div>
  )
}
