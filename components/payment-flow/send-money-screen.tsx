"use client"

import { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/data"
import {
  ACTIVE_CURRENCY,
  digitsToValue,
  formatAmount,
  formatNumber,
  receiveFromSend,
  sendFromReceive,
  valueToDigits,
} from "@/lib/payment-flow"
import { NumericKeypad } from "./numeric-keypad"

type Field = "send" | "receive"

/** Guards against Number precision loss on absurd input. */
const MAX_DIGITS = 12

function AmountField({
  label,
  value,
  isActive,
  animateDigits,
  onActivate,
}: {
  label: string
  value: number | null
  isActive: boolean
  /** The derived side rolls per character; the typed side must not. */
  animateDigits: boolean
  onActivate: () => void
}) {
  const reduceMotion = useReducedMotion()
  const text = value === null ? "" : formatNumber(value)

  return (
    <button
      type="button"
      onClick={onActivate}
      className="w-full space-y-0 p-2  text-left outline-none"
    >
      <span
        className={cn(
          "block text-sm font-bold transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>

      <span
        className={cn(
          "flex h-8 items-center border-b font-heading text-2xl transition-colors py-6",
          isActive ? "border-foreground text-foreground" : "border-border text-foreground/70"
        )}
      >
        {animateDigits && !reduceMotion ? (
          <AnimatePresence mode="popLayout" initial={false}>
            {text.split("").map((char, index) => (
              <motion.span
                // Index-keyed on purpose: a digit's slot is its identity here,
                // so a changing value rolls in place instead of remounting.
                key={`${index}-${char}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
                className="inline-block tabular-nums"
              >
                {/* Intl's fr-SN group separator is a narrow no-break space; an
                    inline-block holding only whitespace would collapse. */}
                {char.trim() === "" ? " " : char}
              </motion.span>
            ))}
          </AnimatePresence>
        ) : (
          <span className="tabular-nums">{text}</span>
        )}

        {isActive && (
          <span
            aria-hidden="true"
            className="ml-0.5 h-8 w-0.5 bg-foreground motion-safe:animate-caret-blink"
          />
        )}
      </span>
    </button>
  )
}

export function SendMoneyScreen({
  recipient,
  busy,
  onBack,
  onSubmit,
}: {
  recipient: Contact
  /** True once submitted — the screen stays put but stops accepting input. */
  busy: boolean
  onBack: () => void
  onSubmit: (amount: { send: number; receive: number }) => void
}) {
  const reduceMotion = useReducedMotion()
  const config = ACTIVE_CURRENCY

  /* One field is edited at a time and only the *other* is ever derived, so the
     two can never chase each other into a rounding loop. */
  const [field, setField] = useState<Field>("send")
  const [digits, setDigits] = useState("")

  const edited = digits === "" ? null : digitsToValue(digits, config)

  const sendValue =
    field === "send" ? edited : edited === null ? null : sendFromReceive(edited, config)
  const receiveValue =
    field === "receive" ? edited : edited === null ? null : receiveFromSend(edited, config)

  const canSubmit = !busy && sendValue !== null && sendValue >= config.minSend

  const switchField = useCallback(
    (next: Field) => {
      if (next === field) return
      const nextValue = next === "send" ? sendValue : receiveValue
      setDigits(nextValue === null ? "" : valueToDigits(nextValue, config))
      setField(next)
    },
    [field, sendValue, receiveValue, config]
  )

  const handleDigit = useCallback((digit: string) => {
    setDigits((prev) => {
      if (prev === "" && digit === "0") return prev
      return prev.length >= MAX_DIGITS ? prev : prev + digit
    })
  }, [])

  const feeCopy = useMemo(
    () => ({
      rate: `Fee = ${config.feeRate * 100}%`,
      cap: `Maximum fee: ${formatAmount(config.feeCap, config)}`,
    }),
    [config]
  )

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
      transition={
        reduceMotion
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 300, damping: 30 }
      }
      className="absolute inset-0 z-20 flex flex-col bg-background"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center px-2 py-3">
        <button
          type="button"
          onClick={onBack}
          disabled={busy}
          aria-label="Back to scanner"
          className="flex size-11 items-center justify-center rounded-full text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring active:bg-muted disabled:opacity-40"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-7" />
        </button>
        <h2 className="flex-1 pr-11 text-center font-heading text-lg">Send Money</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 no-scrollbar">
        {/* Recipient: avatar leads, name and phone follow ~40ms behind it. */}
        <motion.div
          initial="hidden"
          animate="shown"
          variants={{ shown: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            variants={{
              hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 },
              shown: {
                opacity: 1,
                scale: 1,
                transition: reduceMotion
                  ? { duration: 0.2 }
                  : { type: "spring", stiffness: 400, damping: 22 },
              },
            }}
          >
            <Image
              src={recipient.avatar}
              alt=""
              width={128}
              height={128}
              className="size-16 rounded-full object-cover ring-4 ring-muted"
            />
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
              shown: { opacity: 1, y: 0 },
            }}
            className="font-heading text-xl text-foreground"
          >
            {recipient.name}
          </motion.p>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
              shown: { opacity: 1, y: 0 },
            }}
            className="text-sm text-muted-foreground"
          >
            {recipient.phone}
          </motion.p>
        </motion.div>

        <AmountField
          label="Send Amount"
          value={sendValue}
          isActive={field === "send"}
          animateDigits={field !== "send"}
          onActivate={() => switchField("send")}
        />
        <AmountField
          label="Receive Amount"
          value={receiveValue}
          isActive={field === "receive"}
          animateDigits={field !== "receive"}
          onActivate={() => switchField("receive")}
        />

        <div className="pt-4 text-center text-sm font-bold text-muted-foreground">
          <p>{feeCopy.rate}</p>
          <p>{feeCopy.cap}</p>
        </div>
      </div>

      <div className="bg-muted/60 pt-3">
        <div className="px-3">
          <motion.button
            type="button"
            disabled={!canSubmit}
            onClick={() =>
              sendValue !== null &&
              receiveValue !== null &&
              onSubmit({ send: sendValue, receive: receiveValue })
            }
            animate={{ opacity: canSubmit ? 1 : 0.45 }}
            whileTap={canSubmit && !reduceMotion ? { scale: 0.98 } : undefined}
            transition={{ duration: 0.2 }}
            className="w-full rounded-full bg-foreground py-4 font-heading text-lg text-background outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
          >
            Send
          </motion.button>
        </div>

        <NumericKeypad
          onDigit={handleDigit}
          onBackspace={() => setDigits((prev) => prev.slice(0, -1))}
          onClear={() => setDigits("")}
        />
      </div>
    </motion.div>
  )
}
