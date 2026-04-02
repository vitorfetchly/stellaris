const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

/**
 * Format a date string to a short format (e.g., "15 Apr")
 * Uses UTC to avoid hydration mismatches between server and client
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getUTCDate().toString().padStart(2, "0")
  const month = MONTH_NAMES[date.getUTCMonth()]
  return `${day} ${month}`
}

/**
 * Format a date string to ISO date format (YYYY-MM-DD)
 */
export function formatISODate(dateString: string): string {
  const date = new Date(dateString)
  return date.toISOString().split("T")[0]
}
