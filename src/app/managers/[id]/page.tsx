'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SalesManager } from '@/types'
import { ArrowLeft, Target, TrendingUp, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'targets', name: 'Hedefler', href: 'targets', icon: Target },
  { id: 'actuals', name: 'Gerçekleşmeler', href: 'actuals', icon: TrendingUp },
  { id: 'dashboard', name: 'Dashboard', href: 'dashboard', icon: BarChart3 },
]

export default function ManagerDetailPage() {
  const params = useParams()
  const [manager, setManager] = useState<SalesManager | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await fetch(`/api/managers/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setManager(data)
        }
      } catch (error) {
        console.error('Error fetching manager:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchManager()
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="mb-6">
          <Link
            href="/managers"
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Yöneticilere Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{manager.fullName}</h1>
          <p className="mt-2 text-sm text-gray-600">Yıl: 2026</p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/managers/${params.id}/${tab.href}`}
                className={cn(
                  'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
                  'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <p className="text-gray-500">
            Yukarıdaki sekmeleri kullanarak hedef, gerçekleşme ve dashboard sayfalarına
            erişebilirsiniz.
          </p>
        </div>
      </main>
    </div>
  )
}
