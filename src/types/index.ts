import { SalesManager, SalesTarget, SalesActual } from '@prisma/client'

export type { SalesManager, SalesTarget, SalesActual }

export interface ManagerWithData extends SalesManager {
  targets: SalesTarget[]
  actuals: SalesActual[]
}

export interface MonthlyDataPoint {
  month: number
  target: number
  actual: number
  percentage: number
}

export interface DashboardData {
  manager: SalesManager
  monthly: MonthlyDataPoint[]
  yearTotal: {
    target: number
    actual: number
    percentage: number
  }
  quarters: Array<{
    quarter: number
    target: number
    actual: number
    percentage: number
  }>
}

export interface TeamDashboardData {
  managers: Array<{
    id: string
    fullName: string
    yearTarget: number
    yearActual: number
    yearPercentage: number
  }>
  teamTotal: {
    target: number
    actual: number
    percentage: number
  }
  monthlyTeamTotals: Array<{
    month: number
    target: number
    actual: number
  }>
}
