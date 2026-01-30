export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ... geri kalan kod aynı kalacak
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const managerId = searchParams.get('managerId')
    const year = searchParams.get('year')

    if (!managerId || !year) {
      return NextResponse.json(
        { error: 'managerId ve year parametreleri gerekli' },
        { status: 400 }
      )
    }

    const actuals = await prisma.salesActual.findMany({
      where: {
        managerId,
        year: parseInt(year),
      },
      orderBy: { month: 'asc' },
    })

    // Return all 12 months, filling in missing ones
    const result = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const actual = actuals.find((a) => a.month === month)
      return {
        month,
        amount: actual ? parseFloat(actual.amount.toString()) : null,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching actuals:', error)
    return NextResponse.json(
      { error: 'Gerçekleşmeler getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { managerId, year, data } = body

    if (!managerId || !year || !Array.isArray(data) || data.length !== 12) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı' },
        { status: 400 }
      )
    }

    // Process each month
    for (const monthData of data) {
      const { month, amount } = monthData

      if (amount === null || amount === undefined || amount === '') {
        // Delete if exists
        await prisma.salesActual.deleteMany({
          where: {
            managerId,
            year: parseInt(year),
            month,
          },
        })
      } else {
        // Upsert (create or update)
        await prisma.salesActual.upsert({
          where: {
            managerId_year_month: {
              managerId,
              year: parseInt(year),
              month,
            },
          },
          update: {
            amount: parseFloat(amount),
          },
          create: {
            managerId,
            year: parseInt(year),
            month,
            amount: parseFloat(amount),
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating actuals:', error)
    return NextResponse.json(
      { error: 'Gerçekleşmeler kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}
