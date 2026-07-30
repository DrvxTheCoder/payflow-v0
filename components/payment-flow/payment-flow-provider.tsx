"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { demoRecipient, type Contact } from "@/lib/data"
import { parsePayload } from "@/lib/payment-flow"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ScanOverlay } from "./scan-overlay"
import { SendMoneyScreen } from "./send-money-screen"
import { TransactionModal } from "./transaction-modal"

export type FlowStep =
  | "idle"
  | "scanning"
  | "detected"
  | "amount"
  | "submitting"
  | "success"

/** Beat between decoding a payload and the Send Money screen springing up. */
const DETECTED_BEAT_MS = 350
const SUBMIT_MS = 3000
const SUCCESS_MS = 3000

type Amount = { send: number; receive: number }

type PaymentFlowValue = {
  step: FlowStep
  /** Opens the scanner, revealing from the trigger's rect when given one. */
  open: (origin?: DOMRect) => void
  close: () => void
}

const PaymentFlowContext = createContext<PaymentFlowValue | null>(null)

export function usePaymentFlow() {
  const context = useContext(PaymentFlowContext)
  if (!context) {
    throw new Error("usePaymentFlow must be used within a PaymentFlowProvider")
  }
  return context
}

export function PaymentFlowProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  /* Null until measured, so nothing renders (and no camera is requested) during
     the server pass or before we know the viewport. */
  const isMobile = useMediaQuery("(max-width: 1023.98px)")

  const [step, setStep] = useState<FlowStep>("idle")
  const [recipient, setRecipient] = useState<Contact | null>(null)
  const [amount, setAmount] = useState<Amount | null>(null)
  const [origin, setOrigin] = useState<DOMRect | null>(null)
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }, [])

  const schedule = useCallback((fn: () => void, delay: number) => {
    timers.current.push(window.setTimeout(fn, delay))
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const open = useCallback((rect?: DOMRect) => {
    setOrigin(rect ?? null)
    setRecipient(null)
    setAmount(null)
    setStep("scanning")
  }, [])

  const close = useCallback(() => {
    clearTimers()
    setStep("idle")
  }, [clearTimers])

  /* Decoding fires on every frame that resolves a code, so the guard has to be
     a ref — a state check would let a burst through before React re-renders. */
  const stepRef = useRef<FlowStep>(step)
  stepRef.current = step

  const handleScan = useCallback(
    (raw: string) => {
      if (stepRef.current !== "scanning") return
      stepRef.current = "detected"

      setRecipient(parsePayload(raw) ?? demoRecipient)
      setStep("detected")
      schedule(() => setStep("amount"), DETECTED_BEAT_MS)
    },
    [schedule]
  )

  const submit = useCallback(
    (next: Amount) => {
      setAmount(next)
      setStep("submitting")
      schedule(() => setStep("success"), SUBMIT_MS)
      schedule(() => setStep("idle"), SUBMIT_MS + SUCCESS_MS)
    },
    [schedule]
  )

  /* Desktop must never hold this open — if the viewport crosses lg while the
     flow is running, tear it down rather than leaving a camera live. */
  useEffect(() => {
    if (isMobile === false && step !== "idle") close()
  }, [isMobile, step, close])

  const isOpen = step !== "idle"
  const cancellable = step === "scanning" || step === "detected" || step === "amount"

  /* Hold the last live step through the exit wipe, so the overlay doesn't
     un-dim or drop the modal in the split second before it's gone. */
  const lastActiveStep = useRef<FlowStep>("scanning")
  if (step !== "idle") lastActiveStep.current = step
  const renderStep = isOpen ? step : lastActiveStep.current

  useEffect(() => {
    if (!isOpen) return

    /* The body isn't the scroller in this app — <main> is — so locking body
       alone would be a no-op. Lock both: body for iOS rubber-banding, the
       scroll container so nothing shifts underneath the overlay. */
    const scroller = document.querySelector("main")
    const previous = {
      body: document.body.style.overflow,
      scroller: scroller?.style.overflow ?? "",
    }
    document.body.style.overflow = "hidden"
    if (scroller) scroller.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && cancellable) close()
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previous.body
      if (scroller) scroller.style.overflow = previous.scroller
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, cancellable, close])

  /* Circular clip-path wipe from the FAB. A layoutId morph onto the video
     element janks — the stream starts mid-flight — so the overlay is revealed
     as a whole instead. */
  const clip = useMemo(() => {
    if (!origin || typeof window === "undefined") return null

    const x = origin.left + origin.width / 2
    const y = origin.top + origin.height / 2
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    return {
      closed: `circle(0px at ${x}px ${y}px)`,
      open: `circle(${Math.ceil(radius)}px at ${x}px ${y}px)`,
    }
  }, [origin])

  const value = useMemo<PaymentFlowValue>(() => ({ step, open, close }), [step, open, close])

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Scan to pay"
          initial={
            reduceMotion || !clip
              ? { opacity: 0 }
              : { clipPath: clip.closed, opacity: 1 }
          }
          animate={
            reduceMotion || !clip
              ? { opacity: 1 }
              : { clipPath: clip.open, opacity: 1 }
          }
          exit={
            reduceMotion || !clip
              ? { opacity: 0 }
              : { clipPath: clip.closed, opacity: 1 }
          }
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
          className="fixed inset-0 z-60 overflow-hidden overscroll-none bg-black"
        >
          {/* Stays mounted underneath so the camera teardown never competes
              with the Send Money transition. */}
          <ScanOverlay
            active={renderStep === "scanning" || renderStep === "detected"}
            detected={renderStep === "detected"}
            dimmed={renderStep !== "scanning" && renderStep !== "detected"}
            onScan={handleScan}
            onClose={close}
          />

          <AnimatePresence>
            {recipient && renderStep !== "scanning" && renderStep !== "detected" && (
              <SendMoneyScreen
                recipient={recipient}
                busy={renderStep === "submitting" || renderStep === "success"}
                onBack={() => setStep("scanning")}
                onSubmit={submit}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {recipient &&
              amount &&
              (renderStep === "submitting" || renderStep === "success") && (
                <TransactionModal
                  phase={renderStep}
                  recipient={recipient}
                  send={amount.send}
                />
              )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <PaymentFlowContext.Provider value={value}>
      {children}
      {/* Portalled to body, not the app's dialog container — that one is scoped
          to <main>, which would clip a fullscreen overlay. */}
      {isMobile === true && createPortal(overlay, document.body)}
    </PaymentFlowContext.Provider>
  )
}
