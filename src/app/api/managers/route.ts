import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { managerSchema } from "@/lib/validation";

export async function GET() {
  const managers = await prisma.salesManager.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(managers);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = managerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const manager = await prisma.salesManager.create({ data: parsed.data });
  return NextResponse.json(manager, { status: 201 });
}
