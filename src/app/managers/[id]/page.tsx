import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_YEAR } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function ManagerDetailPage({ params }: { params: { id: string } }) {
  const manager = await prisma.salesManager.findUnique({
    where: { id: params.id }
  });

  if (!manager) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{manager.fullName}</h1>
          <p className="text-sm text-muted-foreground">{DEFAULT_YEAR} yılı performans yönetimi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/targets?managerId=${manager.id}`}>Hedefler</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/actuals?managerId=${manager.id}`}>Gerçekleşmeler</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard?managerId=${manager.id}`}>Dashboard</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hızlı Başlangıç</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. 12 ay hedefleri girin.</p>
          <p>2. Gerçekleşmeleri aylık olarak kaydedin.</p>
          <p>3. Dashboard ekranında performansı takip edin.</p>
        </CardContent>
      </Card>
    </div>
  );
}
