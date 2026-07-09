"use client"

/**
 * AddCardDialog — interactive "add a card" dialog for Payflow.
 *
 * - Single 3D card that live-mirrors the form (name, number, expiry)
 * - Card network logo (Visa / Mastercard) fades in from the card number
 * - Card flips to its back while the CVC input is focused
 * - Errors appear ONLY on blur, and clear instantly once the input is valid
 * - Auto-advance to the next field when the current one is complete
 * - On submit: form fades out, card glides horizontally to center,
 *   loading state, then an animated check mark + success message
 *
 * Deps already in payflow-v0: motion v12 (`motion/react`), lucide-react,
 * Tailwind v4, shadcn (dialog, button, input, label).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { CreditCardAddIcon } from "@hugeicons/core-free-icons"

/* ------------------------------------------------------------------ */
/* Card network detection (BIN prefix only — template mode)             */
/* ------------------------------------------------------------------ */

export type CardNetwork =
  | "Visa"
  | "Mastercard"
  | "American Express"
  | "Discover"
  | "Unknown"

export const detectNetwork = (num: string): CardNetwork => {
  if (/^4/.test(num)) return "Visa"
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[0-1]\d|2720)/.test(num))
    return "Mastercard"
  if (/^3[47]/.test(num)) return "American Express"
  if (
    /^(6011|65|64[4-9]|622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5]))/.test(
      num,
    )
  )
    return "Discover"
  return "Unknown"
}

const networkLength = (network: CardNetwork): number =>
  network === "American Express" ? 15 : 16

/** Complete = expected length for the detected network. No Luhn check. */
const isCardNumberComplete = (digits: string): boolean =>
  digits.length === networkLength(detectNetwork(digits))

/* ------------------------------------------------------------------ */
/* Types & helpers                                                      */
/* ------------------------------------------------------------------ */

export interface NewCard {
  name: string
  number: string // digits only
  network: CardNetwork
  expMonth: string
  expYear: string
  cvc: string
}

type Phase = "form" | "processing" | "success"

const onlyDigits = (v: string) => v.replace(/\D/g, "")

const formatCardNumber = (v: string) =>
  onlyDigits(v)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")

/** "0000 0000 0000 0000" template with typed digits merged in */
const displayNumber = (digits: string) => {
  const padded = (digits + "0".repeat(16)).slice(0, 16)
  return padded.replace(/(\d{4})(?=\d)/g, "$1 ")
}

interface FieldErrors {
  name?: string
  number?: string
  expiry?: string
  cvc?: string
}

/* ------------------------------------------------------------------ */
/* Field validators (pure — always called with the freshest values)     */
/* ------------------------------------------------------------------ */

const nameError = (v: string) => (!v.trim() ? "Can't be blank" : undefined)

const numberError = (digits: string) => {
  if (!digits) return "Can't be blank"
  if (!isCardNumberComplete(digits)) return "Card number is incomplete"
  return undefined
}

const expiryError = (m: string, y: string) => {
  if (!m && !y) return "Can't be blank"
  const month = Number(m)
  if (m.length !== 2 || month < 1 || month > 12 || y.length !== 2)
    return "Invalid date"
  const now = new Date()
  const fullYear = 2000 + Number(y)
  if (
    fullYear < now.getFullYear() ||
    (fullYear === now.getFullYear() && month < now.getMonth() + 1)
  )
    return "Card has expired"
  return undefined
}

const cvcError = (v: string) => {
  if (!v) return "Can't be blank"
  if (v.length < 3) return "Too short"
  return undefined
}

/* ------------------------------------------------------------------ */
/* Brand logos (inlined from official marks)                            */
/* ------------------------------------------------------------------ */

function VisaLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 324.68"
      className={className}
      role="img"
      aria-label="Visa"
    >
      <path
        fill="#fff"
        d="m651.19.5c-70.93,0-134.32,36.77-134.32,104.69,0,77.9,112.42,83.28,112.42,122.42,0,16.48-18.88,31.23-51.14,31.23-45.77,0-79.98-20.61-79.98-20.61l-14.64,68.55s39.41,17.41,91.73,17.41c77.55,0,138.58-38.57,138.58-107.66,0-82.32-112.89-87.54-112.89-123.86,0-12.91,15.5-27.05,47.66-27.05,36.29,0,65.89,14.99,65.89,14.99l14.33-66.2S696.61.5,651.18.5h0ZM2.22,5.5L.5,15.49s29.84,5.46,56.72,16.36c34.61,12.49,37.07,19.77,42.9,42.35l63.51,244.83h85.14L379.93,5.5h-84.94l-84.28,213.17-34.39-180.7c-3.15-20.68-19.13-32.48-38.68-32.48,0,0-135.41,0-135.41,0Zm411.87,0l-66.63,313.53h81L494.85,5.5h-80.76Zm451.76,0c-19.53,0-29.88,10.46-37.47,28.73l-118.67,284.8h84.94l16.43-47.47h103.48l9.99,47.47h74.95L934.12,5.5h-68.27Zm11.05,84.71l25.18,117.65h-67.45l42.28-117.65h0Z"
      />
    </svg>
  )
}

function MastercardLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 999.2 776"
      className={className}
      role="img"
      aria-label="Mastercard"
    >
      {/* Wordmark — recolored white */}
      <path
        fill="#fff"
        d="M181.1,774.3v-51.5c0-19.7-12-32.6-32.6-32.6c-10.3,0-21.5,3.4-29.2,14.6c-6-9.4-14.6-14.6-27.5-14.6c-8.6,0-17.2,2.6-24,12v-10.3h-18v82.4h18v-45.5c0-14.6,7.7-21.5,19.7-21.5s18,7.7,18,21.5v45.5h18v-45.5c0-14.6,8.6-21.5,19.7-21.5c12,0,18,7.7,18,21.5v45.5H181.1z M448.1,691.9h-29.2V667h-18v24.9h-16.3v16.3h16.3v37.8c0,18.9,7.7,30,28.3,30c7.7,0,16.3-2.6,22.3-6l-5.2-15.5c-5.2,3.4-11.2,4.3-15.5,4.3c-8.6,0-12-5.2-12-13.7v-36.9h29.2V691.9z M600.9,690.1c-10.3,0-17.2,5.2-21.5,12v-10.3h-18v82.4h18v-46.4c0-13.7,6-21.5,17.2-21.5c3.4,0,7.7,0.9,11.2,1.7l5.2-17.2C609.4,690.1,604.3,690.1,600.9,690.1L600.9,690.1z M370,698.7c-8.6-6-20.6-8.6-33.5-8.6c-20.6,0-34.3,10.3-34.3,26.6c0,13.7,10.3,21.5,28.3,24l8.6,0.9c9.4,1.7,14.6,4.3,14.6,8.6c0,6-6.9,10.3-18.9,10.3c-12,0-21.5-4.3-27.5-8.6l-8.6,13.7c9.4,6.9,22.3,10.3,35.2,10.3c24,0,37.8-11.2,37.8-26.6c0-14.6-11.2-22.3-28.3-24.9l-8.6-0.9c-7.7-0.9-13.7-2.6-13.7-7.7c0-6,6-9.4,15.5-9.4c10.3,0,20.6,4.3,25.8,6.9L370,698.7L370,698.7z M848.9,690.1c-10.3,0-17.2,5.2-21.5,12v-10.3h-18v82.4h18v-46.4c0-13.7,6-21.5,17.2-21.5c3.4,0,7.7,0.9,11.2,1.7L861,691C857.5,690.1,852.4,690.1,848.9,690.1L848.9,690.1z M618.9,733.1c0,24.9,17.2,42.9,43.8,42.9c12,0,20.6-2.6,29.2-9.4l-8.6-14.6c-6.9,5.2-13.7,7.7-21.5,7.7c-14.6,0-24.9-10.3-24.9-26.6c0-15.5,10.3-25.8,24.9-26.6c7.7,0,14.6,2.6,21.5,7.7l8.6-14.6c-8.6-6.9-17.2-9.4-29.2-9.4C636.1,690.1,618.9,708.2,618.9,733.1L618.9,733.1L618.9,733.1z M785.4,733.1v-41.2h-18v10.3c-6-7.7-14.6-12-25.8-12c-23.2,0-41.2,18-41.2,42.9c0,24.9,18,42.9,41.2,42.9c12,0,20.6-4.3,25.8-12v10.3h18V733.1L785.4,733.1z M719.3,733.1c0-14.6,9.4-26.6,24.9-26.6c14.6,0,24.9,11.2,24.9,26.6c0,14.6-10.3,26.6-24.9,26.6C728.8,758.8,719.3,747.6,719.3,733.1L719.3,733.1z M503.9,690.1c-24,0-41.2,17.2-41.2,42.9c0,25.8,17.2,42.9,42.1,42.9c12,0,24-3.4,33.5-11.2l-8.6-12.9c-6.9,5.2-15.5,8.6-24,8.6c-11.2,0-22.3-5.2-24.9-19.7h60.9c0-2.6,0-4.3,0-6.9C542.5,707.3,527,690.1,503.9,690.1L503.9,690.1L503.9,690.1z M503.9,705.6c11.2,0,18.9,6.9,20.6,19.7h-42.9C483.3,714.2,491,705.6,503.9,705.6L503.9,705.6z M951.1,733.1v-73.8h-18v42.9c-6-7.7-14.6-12-25.8-12c-23.2,0-41.2,18-41.2,42.9c0,24.9,18,42.9,41.2,42.9c12,0,20.6-4.3,25.8-12v10.3h18V733.1L951.1,733.1z M885,733.1c0-14.6,9.4-26.6,24.9-26.6c14.6,0,24.9,11.2,24.9,26.6c0,14.6-10.3,26.6-24.9,26.6C894.4,758.8,885,747.6,885,733.1L885,733.1z M282.4,733.1v-41.2h-18v10.3c-6-7.7-14.6-12-25.8-12c-23.2,0-41.2,18-41.2,42.9c0,24.9,18,42.9,41.2,42.9c12,0,20.6-4.3,25.8-12v10.3h18V733.1L282.4,733.1z M215.5,733.1c0-14.6,9.4-26.6,24.9-26.6c14.6,0,24.9,11.2,24.9,26.6c0,14.6-10.3,26.6-24.9,26.6C224.9,758.8,215.5,747.6,215.5,733.1z"
      />
      {/* Interlocking circles — original colors */}
      <rect x="364" y="66.1" fill="#FF5A00" width="270.4" height="485.8" />
      <path
        fill="#EB001B"
        d="M382,309c0-98.7,46.4-186.3,117.6-242.9C447.2,24.9,381.1,0,309,0C138.2,0,0,138.2,0,309s138.2,309,309,309c72.1,0,138.2-24.9,190.6-66.1C428.3,496.1,382,407.7,382,309z"
      />
      <path
        fill="#F79E1B"
        d="M999.2,309c0,170.8-138.2,309-309,309c-72.1,0-138.2-24.9-190.6-66.1c72.1-56.7,117.6-144.2,117.6-242.9S570.8,122.7,499.6,66.1C551.9,24.9,618,0,690.1,0C861,0,999.2,139.1,999.2,309z"
      />
    </svg>
  )
}

function NetworkLogo({ network }: { network: CardNetwork }) {
  return (
    <AnimatePresence mode="wait">
      {(network === "Visa" || network === "Mastercard") && (
        <motion.div
          key={network}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {network === "Visa" ? (
            <VisaLogo className="h-5" />
          ) : (
            <MastercardLogo className="h-9" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Card faces                                                           */
/* ------------------------------------------------------------------ */

function CardFront({
  name,
  numberDigits,
  expMonth,
  expYear,
  network,
}: {
  name: string
  numberDigits: string
  expMonth: string
  expYear: string
  network: CardNetwork
}) {
  const number = displayNumber(numberDigits)

  return (
    <div className="bg-[#ebbd57] absolute inset-0 flex flex-col justify-between rounded-lg p-6 text-white shadow-xl [backface-visibility:hidden]">
      {/* Card network logo — fades in once the number identifies the brand */}
      <div className="flex h-9 w-full items-center justify-end">
        <NetworkLogo network={network} />
      </div>

      <div className="flex flex-col gap-5">
        <p className="font-mono text-md md:text-xl tracking-[0.14em] tabular-nums sm:text-2xl">
          {number.split("").map((char, i) => (
            <motion.span
              key={`${i}-${char}`}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </p>

        <div className="flex items-end justify-between text-xs tracking-[0.2em] uppercase">
          <span className="max-w-[70%] truncate">
            {name.trim() || "JOHN DOE"}
          </span>
          <span className="font-mono">
            {expMonth || "00"}/{expYear || "00"}
          </span>
        </div>
      </div>
    </div>
  )
}

function CardBack({ cvc }: { cvc: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg bg-neutral-200 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
      {/* Mag stripe */}
      <div className="absolute inset-x-0 top-6 h-10 bg-neutral-800" />

      {/* Signature strip + CVC */}
      <div className="absolute inset-x-6 top-[42%] flex h-9 items-center justify-end rounded bg-white pr-3">
        <span className="font-mono text-sm tracking-[0.3em] text-neutral-700">
          {cvc || "000"}
        </span>
      </div>

      {/* Decorative fine print */}
      <div className="absolute inset-x-6 bottom-6 space-y-1.5">
        <div className="h-1.5 w-3/4 rounded bg-neutral-300" />
        <div className="h-1.5 w-1/2 rounded bg-neutral-300" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Success check mark                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCheck() {
  const reduceMotion = useReducedMotion()
  const draw = reduceMotion
    ? { initial: { pathLength: 1 }, animate: { pathLength: 1 } }
    : { initial: { pathLength: 0 }, animate: { pathLength: 1 } }

  return (
    <motion.svg
      viewBox="0 0 52 52"
      className="size-14"
      initial={reduceMotion ? undefined : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.circle
        cx="26"
        cy="26"
        r="23"
        fill="none"
        strokeWidth="3"
        className="stroke-emerald-500"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M15 27l7.5 7.5L37 20"
        fill="none"
        strokeWidth="3.5"
        className="stroke-emerald-500"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.45 }}
      />
    </motion.svg>
  )
}

/* ------------------------------------------------------------------ */
/* Animated inline field error                                          */
/* ------------------------------------------------------------------ */

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-2 text-xs text-destructive"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export interface AddCardDialogProps {
  /** Called once the (simulated) add-card flow succeeds */
  onCardAdded?: (card: NewCard) => void
  /** Optional custom trigger element — defaults to an "Add card" button */
  trigger?: React.ReactElement
  /** Simulated processing time in ms (swap for a real API call) */
  processingMs?: number
}

export function AddCardDialog({
  onCardAdded,
  trigger,
  processingMs = 2200,
}: AddCardDialogProps) {
  const reduceMotion = useReducedMotion()

  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>("form")
  const [isFlipped, setIsFlipped] = useState(false)

  const [name, setName] = useState("")
  const [number, setNumber] = useState("") // formatted, with spaces
  const [expMonth, setExpMonth] = useState("")
  const [expYear, setExpYear] = useState("")
  const [cvc, setCvc] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})

  // Refs for auto-advance + reading fresh values inside blur handlers
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)
  const cvcRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)

  const numberDigits = useMemo(() => onlyDigits(number), [number])
  const network = useMemo(() => detectNetwork(numberDigits), [numberDigits])

  const setFieldError = (field: keyof FieldErrors, message?: string) =>
    setErrors((prev) =>
      prev[field] === message ? prev : { ...prev, [field]: message },
    )

  /**
   * Live clearing only: while typing, an existing error disappears the
   * moment the value becomes valid. Errors are never ADDED here — they
   * only appear on blur (or submit).
   */
  const clearIfValid = (field: keyof FieldErrors, message?: string) =>
    setErrors((prev) =>
      prev[field] && !message ? { ...prev, [field]: undefined } : prev,
    )

  /* ----------------------------- change handlers --------------------- */

  const handleNameChange = (v: string) => {
    const next = v.slice(0, 26)
    setName(next)
    clearIfValid("name", nameError(next))
  }

  const handleNumberChange = (v: string) => {
    const formatted = formatCardNumber(v)
    const digits = onlyDigits(formatted)
    setNumber(formatted)
    clearIfValid("number", numberError(digits))

    if (isCardNumberComplete(digits)) {
      monthRef.current?.focus() // auto-advance
    }
  }

  const handleMonthChange = (v: string) => {
    let next = onlyDigits(v).slice(0, 2)
    // Smart pad: "3" can only mean "03" — pad and advance immediately
    if (next.length === 1 && Number(next) >= 2) next = `0${next}`
    setExpMonth(next)
    clearIfValid("expiry", expiryError(next, expYear))

    if (next.length === 2 && Number(next) >= 1 && Number(next) <= 12) {
      yearRef.current?.focus()
    }
  }

  const handleYearChange = (v: string) => {
    const next = onlyDigits(v).slice(0, 2)
    setExpYear(next)
    clearIfValid("expiry", expiryError(expMonth, next))

    if (next.length === 2 && !expiryError(expMonth, next)) {
      cvcRef.current?.focus() // focusing CVC also flips the card
    }
  }

  const handleCvcChange = (v: string) => {
    const next = onlyDigits(v).slice(0, 4)
    setCvc(next)
    clearIfValid("cvc", cvcError(next))

    if (next.length === 3) {
      submitRef.current?.focus() // blur flips the card back to the front
    }
  }

  /* ----------------------------- blur handlers ----------------------- */

  /**
   * The expiry error is validated at the GROUP level: it only fires when
   * focus leaves the month+year pair entirely. This prevents the error
   * from flashing when auto-advance moves focus from month to year while
   * the year is still empty.
   */
  const handleExpiryGroupBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    // Read fresh values from the DOM — state can lag one keystroke behind
    // when a blur is triggered synchronously by auto-advance focus().
    const m = monthRef.current?.value ?? ""
    const y = yearRef.current?.value ?? ""
    setFieldError("expiry", expiryError(m, y))
  }

  /* ----------------------------- lifecycle --------------------------- */

  const reset = useCallback(() => {
    setPhase("form")
    setIsFlipped(false)
    setName("")
    setNumber("")
    setExpMonth("")
    setExpYear("")
    setCvc("")
    setErrors({})
  }, [])

  const handleOpenChange = (next: boolean) => {
    // Don't allow closing mid-processing
    if (!next && phase === "processing") return
    setOpen(next)
    if (!next) setTimeout(reset, 250) // let the close animation finish
  }

  // Auto-close the dialog 5s after the success state is shown
  useEffect(() => {
    if (phase !== "success") return
    const timer = setTimeout(() => handleOpenChange(false), 5000)
    return () => clearTimeout(timer)
  }, [phase])

  const validateAll = (): boolean => {
    const next: FieldErrors = {
      name: nameError(name),
      number: numberError(numberDigits),
      expiry: expiryError(expMonth, expYear),
      cvc: cvcError(cvc),
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAll()) return

    setIsFlipped(false)
    setPhase("processing")

    // Simulated API call — replace with your mutation
    setTimeout(() => {
      setPhase("success")
      onCardAdded?.({
        name: name.trim(),
        number: numberDigits,
        network,
        expMonth,
        expYear,
        cvc,
      })
    }, processingMs)
  }

  const flipTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.32, 0.72, 0.22, 1] as const }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" size="icon" className="flex items-center rounded-full">
              <HugeiconsIcon icon={CreditCardAddIcon} className="size-4" />
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-3xl pt-6 h-fit max-h-[40rem] md:min-h-[32rem] md:max-h-[32rem] rounded-3xl overflow-clip">
        <DialogHeader className={cn(phase !== "form" && "sr-only", "gap-0 px-4")}>
          <DialogTitle className="text-lg font-semibold">
            Add a new card
          </DialogTitle>
          <DialogDescription>
            Link a card to your Payflow account.
          </DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            // `relative` anchors the popped-out exiting form (popLayout)
            "relative grid items-center gap-4 p-2 md:py-6 md:px-8 rounded-xl",
            phase === "form"
              ? "md:grid-cols-2 md:border md:border-muted"
              : "grid-cols-1 justify-items-center",
          )}
        >
          {/* ------------------------------------------------ card side */}
          <motion.div
            layout="position"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { layout: { duration: 0.55, ease: "easeInOut" } }
            }
            className="flex w-full max-w-sm flex-col items-center gap-6"
          >
            <div
              className={cn(
                "w-full",
                phase !== "form" && "mt-6",
              )}
              style={{ perspective: 1200 }}
              aria-hidden="true"
            >
              <motion.div
                className="relative aspect-[1.586] w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={flipTransition}
              >
                <CardFront
                  name={name}
                  numberDigits={numberDigits}
                  expMonth={expMonth}
                  expYear={expYear}
                  network={network}
                />
                <CardBack cvc={cvc} />
              </motion.div>
            </div>

            {/*
              Status area — height is RESERVED on desktop in every phase so
              the card's vertical center never changes between form and
              processing. This keeps the layout animation purely horizontal.
            */}
            <div
              className={cn(
                "relative w-full",
                phase === "form" ? "h-0 md:h-28" : "h-28",
              )}
            >
              <AnimatePresence mode="wait">
                {phase === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute inset-x-0 top-0 flex flex-col items-center gap-2 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Adding your card securely…
                    </p>
                  </motion.div>
                )}

                {phase === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-0 top-0 flex flex-col items-center gap-3 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <AnimatedCheck />
                    <div className="w-full">
                      <p className="font-semibold text-lg">Card linked successfully.</p>
                      <p className="hidden md:block text-sm text-muted-foreground w-full">
                        Your card has successfully been linked to your account.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ------------------------------------------------ form side */}
          {/*
            popLayout removes the exiting form from layout flow immediately,
            so the grid reflows once — concurrently with the exit animation —
            instead of snapping after it finishes.
          */}
          <AnimatePresence mode="popLayout">
            {phase === "form" && (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={false}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: 32, transition: { duration: 0.3 } }
                }
                className="flex w-full flex-col gap-2"
                noValidate
              >
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="card-name"
                    className="px-2 text-xs font-semibold tracking-[0.2em] uppercase"
                  >
                    Cardholder name
                  </Label>
                  <Input
                    id="card-name"
                    placeholder="JOHN DOE"
                    autoComplete="cc-name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={(e) =>
                      setFieldError("name", nameError(e.target.value))
                    }
                    aria-invalid={!!errors.name}
                  />
                  <FieldError message={errors.name} />
                </div>

                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="card-number"
                    className="px-2 text-xs font-semibold tracking-[0.2em] uppercase"
                  >
                    Card number
                  </Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9123 0000"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className="font-mono"
                    value={number}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    onBlur={(e) =>
                      setFieldError(
                        "number",
                        numberError(onlyDigits(e.target.value)),
                      )
                    }
                    aria-invalid={!!errors.number}
                  />
                  <FieldError message={errors.number} />
                </div>

                <div className="flex flex-row gap-3 justify-between">
                  <div
                    className="col-span-2 flex flex-col gap-2"
                    onBlur={handleExpiryGroupBlur}
                  >
                    <Label
                      htmlFor="card-exp-month"
                      className="px-2 text-xs font-semibold tracking-[0.2em] uppercase"
                    >
                      Exp. date
                    </Label>
                    <div className="flex gap-0">
                      <Input
                        ref={monthRef}
                        id="card-exp-month"
                        placeholder="MM"
                        inputMode="numeric"
                        autoComplete="cc-exp-month"
                        className="font-mono rounded-r-none max-w-12"
                        maxLength={2}
                        value={expMonth}
                        onChange={(e) => handleMonthChange(e.target.value)}
                        aria-invalid={!!errors.expiry}
                      />
                      <Input
                        ref={yearRef}
                        aria-label="Expiry year"
                        placeholder="YY"
                        inputMode="numeric"
                        autoComplete="cc-exp-year"
                        className="font-mono rounded-l-none max-w-12 border-l-0 items-center"
                        maxLength={2}
                        value={expYear}
                        onChange={(e) => handleYearChange(e.target.value)}
                        aria-invalid={!!errors.expiry}
                      />
                    </div>
                    <FieldError message={errors.expiry} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="card-cvc"
                      className="px-2 text-xs font-semibold tracking-[0.2em] uppercase"
                    >
                      CVC
                    </Label>
                    <Input
                      ref={cvcRef}
                      id="card-cvc"
                      placeholder="e.g. 123"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      className="font-mono max-w-20"
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => handleCvcChange(e.target.value)}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={(e) => {
                        setIsFlipped(false)
                        setFieldError("cvc", cvcError(onlyDigits(e.target.value)))
                      }}
                      aria-invalid={!!errors.cvc}
                    />
                    <FieldError message={errors.cvc} />
                  </div>
                </div>

                <Button
                  ref={submitRef}
                  type="submit"
                  size="lg"
                  className="mt-2 w-full rounded-full p-6 text-sm font-medium"
                >
                  Add card
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCardDialog