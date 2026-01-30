'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { ManagerList } from '@/components/managers/ManagerList'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SalesManager } from '@/types'

export default function ManagersPage() {
  const [managers, setManagers] = useState<SalesManager[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchManagers = async () => {
    try {
      const response = await fetch('/api/managers')
      if (response.ok) {
        const data = await response.json()
        setManagers(data)
      }
    } catch (error) {
      console.error('Error fetching managers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ManagerList managers={managers} onUpdate={fetchManagers} />
        )}
      </main>
    </div>
  )
}
