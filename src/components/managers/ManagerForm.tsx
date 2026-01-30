'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { SalesManager } from '@/types'

interface ManagerFormProps {
  manager?: SalesManager | null
  onClose: () => void
  onSuccess: () => void
}

export function ManagerForm({ manager, onClose, onSuccess }: ManagerFormProps) {
  const [fullName, setFullName] = useState(manager?.fullName || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast({
        title: 'Hata',
        description: 'Ad Soyad boş bırakılamaz',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const url = manager
        ? `/api/managers/${manager.id}`
        : '/api/managers'
      
      const method = manager ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim() }),
      })

      if (!response.ok) {
        throw new Error('İşlem başarısız')
      }

      toast({
        title: 'Başarılı',
        description: manager
          ? 'Yönetici güncellendi'
          : 'Yönetici oluşturuldu',
      })

      onSuccess()
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem sırasında bir hata oluştu',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {manager ? 'Yöneticiyi Düzenle' : 'Yeni Yönetici Ekle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
