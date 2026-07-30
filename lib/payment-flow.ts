import { findContact, type Contact } from "@/lib/data"

/* -------------------------------------------------------------------------- */
/*  Currency                                                                   */
/* -------------------------------------------------------------------------- */

export type CurrencyCode = "XOF" | "USD"

export type CurrencyConfig = {
  code: CurrencyCode
  symbol: string
  position: "prefix" | "suffix"
  /** XOF has no minor unit; USD has cents. */
  decimals: number
  feeRate: number
  feeCap: number
  minSend: number
  locale: string
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  XOF: {
    code: "XOF",
    symbol: "F",
    position: "suffix",
    decimals: 0,
    feeRate: 0.01,
    feeCap: 5000,
    minSend: 100,
    locale: "fr-SN",
  },
  USD: {
    code: "USD",
    symbol: "$",
    position: "prefix",
    decimals: 2,
    feeRate: 0.01,
    feeCap: 10,
    minSend: 1,
    locale: "en-US",
  },
}

/** Switch the whole flow to another currency by pointing this at another config. */
export const ACTIVE_CURRENCY = CURRENCIES.XOF

/* -------------------------------------------------------------------------- */
/*  Fee math                                                                   */
/* -------------------------------------------------------------------------- */

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function feeFor(send: number, config: CurrencyConfig = ACTIVE_CURRENCY): number {
  return Math.min(send * config.feeRate, config.feeCap)
}

/**
 * Above this received amount the flat cap binds instead of the percentage, so the
 * inverse has two branches. XOF: 5 000 × (1/0.01 − 1) = 495 000.
 */
export function capReceiveThreshold(config: CurrencyConfig = ACTIVE_CURRENCY): number {
  return config.feeCap * (1 / config.feeRate - 1)
}

/** Sender pays the fee, so the recipient gets less than what was entered. */
export function receiveFromSend(
  send: number,
  config: CurrencyConfig = ACTIVE_CURRENCY
): number {
  return round(send - feeFor(send, config), config.decimals)
}

export function sendFromReceive(
  receive: number,
  config: CurrencyConfig = ACTIVE_CURRENCY
): number {
  const send =
    receive > capReceiveThreshold(config)
      ? receive + config.feeCap
      : receive / (1 - config.feeRate)

  return round(send, config.decimals)
}

/* -------------------------------------------------------------------------- */
/*  Formatting                                                                 */
/* -------------------------------------------------------------------------- */

export function formatAmount(
  value: number,
  config: CurrencyConfig = ACTIVE_CURRENCY
): string {
  const digits = formatNumber(value, config)

  return config.position === "prefix"
    ? `${config.symbol}${digits}`
    : `${digits}${config.symbol}`
}

/** Grouped digits with no symbol — what the amount fields render. */
export function formatNumber(
  value: number,
  config: CurrencyConfig = ACTIVE_CURRENCY
): string {
  return new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(value)
}

/* The keypad only emits digits, so a typed string is read as minor units when
   the currency has any — "123" is 1.23 in USD but 123 in XOF. */
export function digitsToValue(
  digits: string,
  config: CurrencyConfig = ACTIVE_CURRENCY
): number {
  return Number(digits) / 10 ** config.decimals
}

export function valueToDigits(
  value: number,
  config: CurrencyConfig = ACTIVE_CURRENCY
): string {
  return String(Math.round(value * 10 ** config.decimals))
}

/* -------------------------------------------------------------------------- */
/*  QR payload                                                                 */
/* -------------------------------------------------------------------------- */

const PAYLOAD_SCHEME = "payflow://pay"

export function buildPayload(contact: Contact): string {
  return `${PAYLOAD_SCHEME}?id=${encodeURIComponent(contact.id)}`
}

/**
 * Returns null for anything that isn't one of our codes. Callers fall back to
 * `demoRecipient` rather than surfacing an error — the flow has to stay demoable
 * whatever happens to be pointed at the camera.
 */
export function parsePayload(raw: string): Contact | null {
  if (!raw.startsWith(PAYLOAD_SCHEME)) return null

  const query = raw.slice(raw.indexOf("?") + 1)
  const id = new URLSearchParams(query).get("id")

  return id ? findContact(id) : null
}
