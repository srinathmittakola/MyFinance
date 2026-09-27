import { format, parseISO, isValid } from "date-fns"

const CURRENCY_CONFIG: Record<string, { locale: string; symbol: string }> = {
  INR: { locale: "en-IN", symbol: "₹" },
  USD: { locale: "en-US", symbol: "$" },
  EUR: { locale: "de-DE", symbol: "€" },
  GBP: { locale: "en-GB", symbol: "£" },
  AED: { locale: "ar-AE", symbol: "د.إ" },
  AUD: { locale: "en-AU", symbol: "A$" },
  CAD: { locale: "en-CA", symbol: "C$" },
}

export function formatCurrency(amount: number, currency = "INR"): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))
}

export function formatCurrencyWithSign(amount: number, currency = "INR"): string {
  const formatted = formatCurrency(Math.abs(amount), currency)
  return amount < 0 ? `-${formatted}` : formatted
}

export function formatCurrencyCompact(amount: number, currency = "INR"): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR
  const abs = Math.abs(amount)
  const sign = amount < 0 ? "-" : ""
  if (currency === "INR") {
    if (abs >= 10000000) return `${sign}${config.symbol}${(abs / 10000000).toFixed(1)}Cr`
    if (abs >= 100000) return `${sign}${config.symbol}${(abs / 100000).toFixed(1)}L`
    if (abs >= 1000) return `${sign}${config.symbol}${(abs / 1000).toFixed(0)}K`
  } else {
    if (abs >= 1000000) return `${sign}${config.symbol}${(abs / 1000000).toFixed(1)}M`
    if (abs >= 1000) return `${sign}${config.symbol}${(abs / 1000).toFixed(0)}K`
  }
  return formatCurrency(amount, currency)
}

export function getCurrencySymbol(currency = "INR"): string {
  return CURRENCY_CONFIG[currency]?.symbol || currency
}

export function formatDate(dateStr: string, fmt = "dd MMM yyyy"): string {
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return dateStr
    return format(date, fmt)
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  return formatDate(dateStr, "dd MMM")
}

export function formatDateMonth(dateStr: string): string {
  return formatDate(dateStr, "MMM yyyy")
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value)
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + "…"
}

export function getDaysRemaining(targetDate: string): number {
  const target = parseISO(targetDate)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function getCurrentDate(): string {
  return format(new Date(), "EEEE, dd MMMM yyyy")
}
