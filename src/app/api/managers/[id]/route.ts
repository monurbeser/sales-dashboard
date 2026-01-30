export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { salesManagerSchema } from '@/lib/validations'

// ... geri kalan kod aynı kalacak
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { salesManagerSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const manager = await prisma.salesManager.findUnique({
      where: { id: params.id },
      include: {
        targets: true,
        actuals: true,
      },
    })

    if (!manager) {
      return NextResponse.json(
        { error: 'Yönetici bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(manager)
  } catch (error) {
    console.error('Error fetching manager:', error)
    return NextResponse.json(
      { error: 'Yönetici getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = salesManagerSchema.parse(body)

    const manager = await prisma.salesManager.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(manager)
  } catch (error) {
    console.error('Error updating manager:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Yönetici güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.salesManager.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting manager:', error)
    return NextResponse.json(
      { error: 'Yönetici silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
