export interface MonthlyData {
  month: number
  target: number
  actual: number
}

export interface QuarterData {
  quarter: number
  target: number
  actual: number
  percentage: number
}

export interface YearData {
  target: number
  actual: number
  percentage: number
}

/**
 * Calculate percentage achievement
 * If target is 0, return 0 to avoid division by zero
 */
export function calculatePercentage(actual: number, target: number): number {
  if (target === 0) return 0
  return (actual / target) * 100
}

/**
 * Get quarter number from month (1-12)
 */
export function getQuarter(month: number): number {
  if (month >= 1 && month <= 3) return 1
  if (month >= 4 && month <= 6) return 2
  if (month >= 7 && month <= 9) return 3
  return 4
}

/**
 * Get months in a quarter
 */
export function getMonthsInQuarter(quarter: number): number[] {
  switch (quarter) {
    case 1:
      return [1, 2, 3]
    case 2:
      return [4, 5, 6]
    case 3:
      return [7, 8, 9]
    case 4:
      return [10, 11, 12]
    default:
      return []
  }
}

/**
 * Calculate quarterly totals from monthly data
 */
export function calculateQuarterTotals(monthlyData: MonthlyData[]): QuarterData[] {
  const quarters: QuarterData[] = [
    { quarter: 1, target: 0, actual: 0, percentage: 0 },
    { quarter: 2, target: 0, actual: 0, percentage: 0 },
    { quarter: 3, target: 0, actual: 0, percentage: 0 },
    { quarter: 4, target: 0, actual: 0, percentage: 0 },
  ]

  monthlyData.forEach((data) => {
    const quarter = getQuarter(data.month)
    const qIndex = quarter - 1
    quarters[qIndex].target += data.target
    quarters[qIndex].actual += data.actual
  })

  quarters.forEach((q) => {
    q.percentage = calculatePercentage(q.actual, q.target)
  })

  return quarters
}

/**
 * Calculate year totals from monthly data
 */
export function calculateYearTotals(monthlyData: MonthlyData[]): YearData {
  const totals = monthlyData.reduce(
    (acc, data) => ({
      target: acc.target + data.target,
      actual: acc.actual + data.actual,
    }),
    { target: 0, actual: 0 }
  )

  return {
    target: totals.target,
    actual: totals.actual,
    percentage: calculatePercentage(totals.actual, totals.target),
  }
}

/**
 * Get color based on percentage achievement
 * Red (0-60%) -> Yellow (60-90%) -> Green (90%+)
 */
export function getPercentageColor(percentage: number): string {
  if (percentage >= 90) return '#22c55e' // green-500
  if (percentage >= 60) return '#eab308' // yellow-500
  return '#ef4444' // red-500
}

/**
 * Get color class for Tailwind based on percentage
 */
export function getPercentageColorClass(percentage: number): string {
  if (percentage >= 90) return 'text-green-600 bg-green-50'
  if (percentage >= 60) return 'text-yellow-600 bg-yellow-50'
  return 'text-red-600 bg-red-50'
}

/**
 * Get all months with Turkish names
 */
export const MONTH_NAMES_TR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

/**
 * Get month name in Turkish
 */
export function getMonthName(month: number): string {
  return MONTH_NAMES_TR[month - 1] || ''
}
