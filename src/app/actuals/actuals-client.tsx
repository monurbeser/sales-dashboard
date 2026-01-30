"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_YEAR, MONTHS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { amountSchema } from "@/lib/validation";

interface ActualsClientProps {
  managerId: string | null;
}

export function ActualsClient({ managerId }: ActualsClientProps) {
  const [values, setValues] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const loadActuals = async () => {
    if (!managerId) return;
    setLoading(true);
    const response = await fetch(`/api/actuals/bulk?managerId=${managerId}&year=${DEFAULT_YEAR}`);
    const data = await response.json();
    const nextValues: Record<number, string> = {};
    data.forEach((item: { month: number; amount: number }) => {
      nextValues[item.month] = item.amount.toString();
    });
    setValues(nextValues);
    setLoading(false);
  };

  useEffect(() => {
    loadActuals();
  }, [managerId]);

  const save = async () => {
    if (!managerId) return;
    try {
      const items = MONTHS.map((_, index) => {
        const raw = values[index + 1];
        if (!raw || raw.trim() === "") {
          return { month: index + 1, amount: null };
        }
        const parsedNumber = Number(raw);
        const parsedAmount = amountSchema.safeParse(parsedNumber);
        if (!parsedAmount.success) {
          throw new Error(`Geçersiz tutar: ${MONTHS[index]}`);
        }
        return { month: index + 1, amount: parsedAmount.data };
      });

      const response = await fetch("/api/actuals/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerId, year: DEFAULT_YEAR, items })
      });

      if (!response.ok) {
        toast.error("Kaydetme başarısız");
        return;
      }

      toast.success("Gerçekleşmeler kaydedildi");
      await loadActuals();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Geçersiz veri");
    }
  };

  const total = useMemo(() => {
    return Object.values(values).reduce((sum, value) => sum + (Number(value) || 0), 0);
  }, [values]);

  if (!managerId) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Önce satış yöneticisi seçin.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gerçekleşme Girişi</h1>
          <p className="text-sm text-muted-foreground">Yıl {DEFAULT_YEAR} için aylık gerçekleşmeleri girin.</p>
        </div>
        <Button onClick={save} disabled={loading}>
          Kaydet
        </Button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Yükleniyor...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {MONTHS.map((month, index) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle>{month}</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0,00"
                  value={values[index + 1] ?? ""}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      [index + 1]: event.target.value
                    }))
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Yıllık gerçekleşme toplamı</CardTitle>
        </CardHeader>
        <CardContent className="text-lg font-semibold">{formatCurrency(total)}</CardContent>
      </Card>
    </div>
  );
}
