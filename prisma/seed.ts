import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const year = 2026;

async function main() {
  await prisma.salesActual.deleteMany();
  await prisma.salesTarget.deleteMany();
  await prisma.salesManager.deleteMany();

  const managers = await prisma.salesManager.createMany({
    data: [
      { fullName: "Ayşe Demir" },
      { fullName: "Mehmet Kaya" },
      { fullName: "Zeynep Arslan" }
    ]
  });

  const createdManagers = await prisma.salesManager.findMany();

  for (const manager of createdManagers) {
    const targets = Array.from({ length: 12 }).map((_, index) => ({
      managerId: manager.id,
      year,
      month: index + 1,
      amount: 250000 + index * 15000
    }));

    const actuals = Array.from({ length: 12 }).map((_, index) => ({
      managerId: manager.id,
      year,
      month: index + 1,
      amount: 200000 + index * 12000
    }));

    await prisma.salesTarget.createMany({ data: targets });
    await prisma.salesActual.createMany({ data: actuals });
  }

  console.log(`Seeded ${managers.count} managers for ${year}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
