import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data
  await prisma.salesActual.deleteMany()
  await prisma.salesTarget.deleteMany()
  await prisma.salesManager.deleteMany()

  // Create managers
  const managers = await Promise.all([
    prisma.salesManager.create({
      data: { fullName: 'Ahmet Yılmaz' },
    }),
    prisma.salesManager.create({
      data: { fullName: 'Ayşe Demir' },
    }),
    prisma.salesManager.create({
      data: { fullName: 'Mehmet Kaya' },
    }),
  ])

  console.log('✅ Created 3 sales managers')

  // Create targets for 2026
  const targetData = [
    // Ahmet - strong first half
    { managerId: managers[0].id, month: 1, target: 100000, actual: 95000 },
    { managerId: managers[0].id, month: 2, target: 120000, actual: 130000 },
    { managerId: managers[0].id, month: 3, target: 110000, actual: 105000 },
    { managerId: managers[0].id, month: 4, target: 130000, actual: 125000 },
    { managerId: managers[0].id, month: 5, target: 140000, actual: 150000 },
    { managerId: managers[0].id, month: 6, target: 135000, actual: 140000 },
    
    // Ayşe - consistent performer
    { managerId: managers[1].id, month: 1, target: 90000, actual: 92000 },
    { managerId: managers[1].id, month: 2, target: 95000, actual: 94000 },
    { managerId: managers[1].id, month: 3, target: 100000, actual: 101000 },
    { managerId: managers[1].id, month: 4, target: 105000, actual: 107000 },
    { managerId: managers[1].id, month: 5, target: 110000, actual: 109000 },
    
    // Mehmet - improvement trajectory
    { managerId: managers[2].id, month: 1, target: 80000, actual: 70000 },
    { managerId: managers[2].id, month: 2, target: 85000, actual: 75000 },
    { managerId: managers[2].id, month: 3, target: 90000, actual: 85000 },
    { managerId: managers[2].id, month: 4, target: 95000, actual: 95000 },
  ]

  for (const data of targetData) {
    await prisma.salesTarget.create({
      data: {
        managerId: data.managerId,
        year: 2026,
        month: data.month,
        amount: data.target,
      },
    })

    await prisma.salesActual.create({
      data: {
        managerId: data.managerId,
        year: 2026,
        month: data.month,
        amount: data.actual,
      },
    })
  }

  console.log('✅ Created targets and actuals for 2026')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
