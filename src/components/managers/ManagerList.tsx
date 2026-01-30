'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Eye } from 'lucide-react'
import { SalesManager } from '@/types'
import { ManagerForm } from './ManagerForm'
import { DeleteConfirm } from './DeleteConfirm'

interface ManagerListProps {
  managers: SalesManager[]
  onUpdate: () => void
}

export function ManagerList({ managers, onUpdate }: ManagerListProps) {
  const [editingManager, setEditingManager] = useState<SalesManager | null>(null)
  const [deletingManager, setDeletingManager] = useState<SalesManager | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Satış Yöneticileri</h2>
        <Button onClick={() => setIsCreating(true)}>
          Yeni Yönetici Ekle
        </Button>
      </div>

      {managers.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-gray-500">
            Henüz satış yöneticisi eklenmemiş. Başlamak için yeni bir yönetici ekleyin.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Oluşturma Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {managers.map((manager) => (
                <tr key={manager.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {manager.fullName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(manager.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link href={`/managers/${manager.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingManager(manager)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingManager(manager)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(isCreating || editingManager) && (
        <ManagerForm
          manager={editingManager}
          onClose={() => {
            setIsCreating(false)
            setEditingManager(null)
          }}
          onSuccess={() => {
            setIsCreating(false)
            setEditingManager(null)
            onUpdate()
          }}
        />
      )}

      {deletingManager && (
        <DeleteConfirm
          manager={deletingManager}
          onClose={() => setDeletingManager(null)}
          onSuccess={() => {
            setDeletingManager(null)
            onUpdate()
          }}
        />
      )}
    </div>
  )
}
