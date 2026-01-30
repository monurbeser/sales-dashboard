export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
// ... geri kalan aynı
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { salesManagerSchema } from '@/lib/validations'

export async function GET() {
  try {
    const managers = await prisma.salesManager.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(managers)
  } catch (error) {
    console.error('Error fetching managers:', error)
    return NextResponse.json(
      { error: 'Yöneticiler getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = salesManagerSchema.parse(body)

    const manager = await prisma.salesManager.create({
      data: validatedData,
    })

    return NextResponse.json(manager, { status: 201 })
  } catch (error) {
    console.error('Error creating manager:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Yönetici oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}
