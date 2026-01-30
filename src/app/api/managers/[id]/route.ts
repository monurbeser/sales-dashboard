import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { managerSchema } from "@/lib/validation";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: parsedParams.error.flatten() }, { status: 400 });
  }

  const manager = await prisma.salesManager.findUnique({
    where: { id: parsedParams.data.id }
  });

  if (!manager) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(manager);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: parsedParams.error.flatten() }, { status: 400 });
  }

  const body = await request.json();
  const parsedBody = managerSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error.flatten() }, { status: 400 });
  }

  const manager = await prisma.salesManager.update({
    where: { id: parsedParams.data.id },
    data: parsedBody.data
  });

  return NextResponse.json(manager);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: parsedParams.error.flatten() }, { status: 400 });
  }

  await prisma.salesManager.delete({ where: { id: parsedParams.data.id } });
  return NextResponse.json({ ok: true });
}
