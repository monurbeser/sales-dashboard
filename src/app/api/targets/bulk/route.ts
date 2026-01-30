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

    const targets = await prisma.salesTarget.findMany({
      where: {
        managerId,
        year: parseInt(year),
      },
      orderBy: { month: 'asc' },
    })

    // Return all 12 months, filling in missing ones
    const result = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const target = targets.find((t) => t.month === month)
      return {
        month,
        amount: target ? parseFloat(target.amount.toString()) : null,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching targets:', error)
    return NextResponse.json(
      { error: 'Hedefler getirilirken hata oluştu' },
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
        await prisma.salesTarget.deleteMany({
          where: {
            managerId,
            year: parseInt(year),
            month,
          },
        })
      } else {
        // Upsert (create or update)
        await prisma.salesTarget.upsert({
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
    console.error('Error updating targets:', error)
    return NextResponse.json(
      { error: 'Hedefler kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}
