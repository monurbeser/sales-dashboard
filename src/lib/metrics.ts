import { QUARTERS } from "@/lib/constants";

export type MonthAmount = { month: number; amount: number };

export function percent(actual: number, target: number) {
  if (target === 0) return 0;
  return (actual / target) * 100;
}

export function monthTotals(entries: MonthAmount[]) {
  const totals = new Map<number, number>();
  entries.forEach((entry) => {
    totals.set(entry.month, (totals.get(entry.month) ?? 0) + entry.amount);
  });
  return totals;
}

export function quarterTotals(entries: MonthAmount[]) {
  const totals = QUARTERS.map((quarter) => {
    const total = quarter.months.reduce((sum, month) => {
      return sum + (entries.find((entry) => entry.month === month)?.amount ?? 0);
    }, 0);
    return { label: quarter.label, total };
  });
  return totals;
}

export function yearTotal(entries: MonthAmount[]) {
  return entries.reduce((sum, entry) => sum + entry.amount, 0);
}
