import { NextResponse } from "next/server";
import { z } from "zod";

import { DEFAULT_YEAR } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { bulkActualsSchema } from "@/lib/validation";

const querySchema = z.object({
  managerId: z.string().uuid(),
  year: z.coerce
    .number()
    .int()
    .refine((value) => value === DEFAULT_YEAR, { message: "Yıl 2026 olmalıdır." })
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    managerId: searchParams.get("managerId"),
    year: searchParams.get("year") ?? DEFAULT_YEAR
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const items = await prisma.salesActual.findMany({
    where: { managerId: parsed.data.managerId, year: parsed.data.year },
    orderBy: { month: "asc" }
  });

  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = bulkActualsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { managerId, year, items } = parsed.data;

  const operations = items.map((item) => {
    if (item.amount === null) {
      return prisma.salesActual.deleteMany({
        where: { managerId, year, month: item.month }
      });
    }
    return prisma.salesActual.upsert({
      where: { managerId_year_month: { managerId, year, month: item.month } },
      update: { amount: item.amount },
      create: { managerId, year, month: item.month, amount: item.amount }
    });
  });

  await prisma.$transaction(operations);

  const updated = await prisma.salesActual.findMany({
    where: { managerId, year },
    orderBy: { month: "asc" }
  });

  return NextResponse.json(updated);
}
