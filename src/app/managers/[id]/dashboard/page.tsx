'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatCard } from '@/components/dashboard/StatCard'
import { GaugeChart } from '@/components/dashboard/GaugeChart'
import { MonthlyBarChart } from '@/components/dashboard/MonthlyBarChart'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ArrowLeft } from 'lucide-react'
import { SalesManager, SalesTarget, SalesActual } from '@/types'
import {
  calculatePercentage,
  calculateQuarterTotals,
  calculateYearTotals,
  MonthlyData,
} from '@/lib/calculations'

export default function DashboardPage() {
  const params = useParams()
  const [manager, setManager] = useState<SalesManager | null>(null)
  const [targets, setTargets] = useState<SalesTarget[]>([])
  const [actuals, setActuals] = useState<SalesActual[]>([])
  const [allManagers, setAllManagers] = useState<SalesManager[]>([])
  const [allTargets, setAllTargets] = useState<SalesTarget[]>([])
  const [allActuals, setAllActuals] = useState<SalesActual[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current manager
        const managerRes = await fetch(`/api/managers/${params.id}`)
        if (managerRes.ok) {
          const managerData = await managerRes.json()
          setManager(managerData)
          setTargets(managerData.targets.filter((t: SalesTarget) => t.year === 2026))
          setActuals(managerData.actuals.filter((a: SalesActual) => a.year === 2026))
        }

        // Fetch all managers for team view
        const managersRes = await fetch('/api/managers')
        if (managersRes.ok) {
          const managersData = await managersRes.json()
          setAllManagers(managersData)

          // Fetch all targets and actuals
          const allTargetsPromises = managersData.map((m: SalesManager) =>
            fetch(`/api/targets/bulk?managerId=${m.id}&year=2026`).then((r) => r.json())
          )
          const allActualsPromises = managersData.map((m: SalesManager) =>
            fetch(`/api/actuals/bulk?managerId=${m.id}&year=2026`).then((r) => r.json())
          )

          const targetsResults = await Promise.all(allTargetsPromises)
          const actualsResults = await Promise.all(allActualsPromises)

          const flatTargets: SalesTarget[] = []
          const flatActuals: SalesActual[] = []

          managersData.forEach((m: SalesManager, idx: number) => {
            targetsResults[idx].forEach((t: any) => {
              if (t.amount !== null) {
                flatTargets.push({
                  id: `${m.id}-${t.month}`,
                  managerId: m.id,
                  year: 2026,
                  month: t.month,
                  amount: t.amount,
                } as any)
              }
            })
            actualsResults[idx].forEach((a: any) => {
              if (a.amount !== null) {
                flatActuals.push({
                  id: `${m.id}-${a.month}`,
                  managerId: m.id,
                  year: 2026,
                  month: a.month,
                  amount: a.amount,
                } as any)
              }
            })
          })

          setAllTargets(flatTargets)
          setAllActuals(flatActuals)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1">
          <LoadingSpinner />
        </main>
      </div>
    )
  }

  if (!manager) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <p className="text-red-600">Yönetici bulunamadı</p>
        </main>
      </div>
    )
  }

  // Individual calculations
  const monthlyData: MonthlyData[] = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const target = targets.find((t) => t.month === month)
    const actual = actuals.find((a) => a.month === month)
    return {
      month,
      target: target ? parseFloat(target.amount.toString()) : 0,
      actual: actual ? parseFloat(actual.amount.toString()) : 0,
    }
  })

  const yearTotals = calculateYearTotals(monthlyData)
  const quarterTotals = calculateQuarterTotals(monthlyData)

  // Team calculations
  const teamMonthlyData: Array<{ month: number; target: number; actual: number }> = Array.from(
    { length: 12 },
    (_, i) => {
      const month = i + 1
      const monthTargets = allTargets.filter((t) => t.month === month)
      const monthActuals = allActuals.filter((a) => a.month === month)
      return {
        month,
        target: monthTargets.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
        actual: monthActuals.reduce((sum, a) => sum + parseFloat(a.amount.toString()), 0),
      }
    }
  )

  const teamYearTotals = calculateYearTotals(teamMonthlyData)

  const managerStats = allManagers.map((m) => {
    const mTargets = allTargets.filter((t) => t.managerId === m.id)
    const mActuals = allActuals.filter((a) => a.managerId === m.id)
    const totalTarget = mTargets.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
    const totalActual = mActuals.reduce((sum, a) => sum + parseFloat(a.amount.toString()), 0)
    return {
      id: m.id,
      fullName: m.fullName,
      yearTarget: totalTarget,
      yearActual: totalActual,
      yearPercentage: calculatePercentage(totalActual, totalTarget),
    }
  })

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <Link
          href={`/managers/${params.id}`}
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard - {manager.fullName}</h1>
          <p className="mt-1 text-sm text-gray-600">2026 yılı performans özeti</p>
        </div>

        {/* Individual Section */}
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Kişisel Performans</h2>
          
          {/* Year Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Yıl Hedefi"
              value={yearTotals.target}
              type="currency"
            />
            <StatCard
              title="Yıl Gerçekleşme"
              value={yearTotals.actual}
              type="currency"
            />
            <StatCard
              title="Yıl Başarı"
              value={yearTotals.percentage}
              type="percent"
              percentageValue={yearTotals.percentage}
            />
          </div>

          {/* Quarter Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            {quarterTotals.map((q) => (
              <StatCard
                key={q.quarter}
                title={`Q${q.quarter} Başarı`}
                value={q.percentage}
                type="percent"
                percentageValue={q.percentage}
                subtitle={`Hedef: ${q.target.toLocaleString('tr-TR')} TL`}
              />
            ))}
          </div>

          {/* Gauge and Chart */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GaugeChart
              title="Yıllık Başarı Oranı"
              percentage={yearTotals.percentage}
              subtitle={`${yearTotals.actual.toLocaleString('tr-TR')} / ${yearTotals.target.toLocaleString('tr-TR')} TL`}
            />
            <MonthlyBarChart title="Aylık Hedef vs Gerçekleşme" data={monthlyData} />
          </div>
        </div>

        {/* Team Section */}
        <div className="border-t pt-8">
          <h2 className="mb-4 text-xl font-semibold">Ekip Performansı</h2>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Ekip Hedefi"
              value={teamYearTotals.target}
              type="currency"
            />
            <StatCard
              title="Ekip Gerçekleşme"
              value={teamYearTotals.actual}
              type="currency"
            />
            <StatCard
              title="Ekip Başarı"
              value={teamYearTotals.percentage}
              type="percent"
              percentageValue={teamYearTotals.percentage}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GaugeChart
              title="Ekip Başarı Oranı"
              percentage={teamYearTotals.percentage}
            />
            <MonthlyBarChart
              title="Ekip Aylık Toplam"
              data={teamMonthlyData}
            />
          </div>

          {/* Manager Table */}
          <div className="mt-6 overflow-hidden rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Yönetici
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hedef
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Gerçekleşme
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Başarı %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {managerStats.map((stat) => (
                  <tr key={stat.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {stat.fullName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      {stat.yearTarget.toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      TL
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      {stat.yearActual.toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      TL
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <span
                        className={
                          stat.yearPercentage >= 90
                            ? 'text-green-600'
                            : stat.yearPercentage >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }
                      >
                        %{stat.yearPercentage.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
