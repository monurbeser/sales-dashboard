'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { MONTH_NAMES_TR } from '@/lib/calculations'
import { formatCurrency } from '@/lib/formatters'

interface TargetGridProps {
  managerId: string
  year: number
}

export function TargetGrid({ managerId, year }: TargetGridProps) {
  const [data, setData] = useState<Array<{ month: number; amount: number | null }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [managerId, year])

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/targets/bulk?managerId=${managerId}&year=${year}`
      )
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Hedefler yüklenirken hata oluştu',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountChange = (month: number, value: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.month === month
          ? { ...item, amount: value === '' ? null : parseFloat(value) || 0 }
          : item
      )
    )
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/targets/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          managerId,
          year,
          data,
        }),
      })

      if (!response.ok) {
        throw new Error('Kaydetme başarısız')
      }

      toast({
        title: 'Başarılı',
        description: 'Hedefler kaydedildi',
      })

      fetchData()
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Hedefler kaydedilirken hata oluştu',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const total = data.reduce((sum, item) => sum + (item.amount || 0), 0)

  if (isLoading) {
    return <div className="text-center">Yükleniyor...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aylık Hedefler - {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item) => (
            <div key={item.month} className="space-y-2">
              <Label htmlFor={`target-${item.month}`}>
                {MONTH_NAMES_TR[item.month - 1]}
              </Label>
              <Input
                id={`target-${item.month}`}
                type="number"
                min="0"
                step="0.01"
                value={item.amount === null ? '' : item.amount}
                onChange={(e) => handleAmountChange(item.month, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="text-lg font-semibold">
            Toplam: {formatCurrency(total)}
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
