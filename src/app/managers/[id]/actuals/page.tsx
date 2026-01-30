'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { ActualGrid } from '@/components/actuals/ActualGrid'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SalesManager } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function ActualsPage() {
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
        <Link
          href={`/managers/${params.id}`}
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Link>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Gerçekleşmeler - {manager.fullName}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            2026 yılı için aylık satış gerçekleşmelerini girin
          </p>
        </div>

        <ActualGrid managerId={params.id as string} year={2026} />
      </main>
    </div>
  )
}
