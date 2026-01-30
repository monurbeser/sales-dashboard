'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { SalesManager } from '@/types'

interface DeleteConfirmProps {
  manager: SalesManager
  onClose: () => void
  onSuccess: () => void
}

export function DeleteConfirm({ manager, onClose, onSuccess }: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/managers/${manager.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız')
      }

      toast({
        title: 'Başarılı',
        description: 'Yönetici silindi',
      })

      onSuccess()
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Silme işlemi sırasında bir hata oluştu',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yöneticiyi Sil</DialogTitle>
          <DialogDescription>
            <strong>{manager.fullName}</strong> adlı yöneticiyi silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz ve tüm hedef ve gerçekleşme verileri de silinecektir.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            İptal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Siliniyor...' : 'Sil'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
