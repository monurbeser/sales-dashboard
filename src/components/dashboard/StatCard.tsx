import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  type?: 'currency' | 'percent' | 'text'
  className?: string
  percentageValue?: number
}

export function StatCard({
  title,
  value,
  subtitle,
  type = 'text',
  className,
  percentageValue,
}: StatCardProps) {
  const getColorClass = () => {
    if (type !== 'percent' || percentageValue === undefined) return ''
    if (percentageValue >= 90) return 'text-green-600'
    if (percentageValue >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formattedValue = () => {
    if (type === 'currency') {
      return formatCurrency(value as number)
    }
    if (type === 'percent') {
      return formatPercent(value as number)
    }
    return value
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', getColorClass())}>
          {formattedValue()}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
