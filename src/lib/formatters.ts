/**
 * Format number to Turkish Lira with proper formatting
 * Example: 1234567.89 => "1.234.567,89 TL"
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') {
    return '0,00 TL'
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return '0,00 TL'
  }

  // Format with Turkish locale
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)

  return `${formatted} TL`
}

/**
 * Format percentage with Turkish formatting
 * Example: 85.5 => "%85,50"
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '%0,00'
  }

  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

  return `%${formatted}`
}

/**
 * Parse Turkish formatted number input to float
 * Example: "1.234.567,89" => 1234567.89
 */
export function parseTurkishNumber(input: string): number {
  if (!input) return 0
  
  // Remove TL suffix if present
  let cleaned = input.replace(/\s*TL\s*/gi, '').trim()
  
  // Replace Turkish decimal separator (,) with dot
  // Remove thousand separators (.)
  cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
