'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPercent } from '@/lib/formatters'
import { getPercentageColor } from '@/lib/calculations'

interface GaugeChartProps {
  title: string
  percentage: number
  subtitle?: string
}

export function GaugeChart({ title, percentage, subtitle }: GaugeChartProps) {
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100)
  const color = getPercentageColor(normalizedPercentage)
  
  // Calculate rotation for gauge (0% = -90deg, 100% = 90deg)
  const rotation = -90 + (normalizedPercentage / 100) * 180

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Gauge visual */}
          <div className="relative h-32 w-64">
            {/* Background arc */}
            <svg viewBox="0 0 200 100" className="h-full w-full">
              <path
                d="M 10 90 A 90 90 0 0 1 190 90"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Colored arc based on percentage */}
              <path
                d="M 10 90 A 90 90 0 0 1 190 90"
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(normalizedPercentage / 100) * 282.7} 282.7`}
              />
              {/* Needle */}
              <line
                x1="100"
                y1="90"
                x2="100"
                y2="20"
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transformOrigin: '100px 90px',
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.5s ease-out',
                }}
              />
              {/* Center dot */}
              <circle cx="100" cy="90" r="6" fill="#374151" />
            </svg>
          </div>
          
          {/* Value display */}
          <div className="mt-2 text-center">
            <div className="text-3xl font-bold" style={{ color }}>
              {formatPercent(normalizedPercentage)}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
