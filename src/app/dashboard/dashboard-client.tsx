"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Gauge } from "@/components/gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_YEAR, MONTHS, QUARTERS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { monthTotals, percent, quarterTotals, yearTotal } from "@/lib/metrics";

interface Manager {
  id: string;
  fullName: string;
}

interface Entry {
  month: number;
  amount: number;
}

interface DashboardClientProps {
  managerId: string | null;
}

export function DashboardClient({ managerId }: DashboardClientProps) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [targets, setTargets] = useState<Entry[]>([]);
  const [actuals, setActuals] = useState<Entry[]>([]);
  const [teamTargets, setTeamTargets] = useState<Entry[]>([]);
  const [teamActuals, setTeamActuals] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadManagers = async () => {
      const response = await fetch("/api/managers");
      const data = await response.json();
      setManagers(data);
    };
    loadManagers();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!managerId) return;
      setLoading(true);
      const [targetsResponse, actualsResponse] = await Promise.all([
        fetch(`/api/targets/bulk?managerId=${managerId}&year=${DEFAULT_YEAR}`),
        fetch(`/api/actuals/bulk?managerId=${managerId}&year=${DEFAULT_YEAR}`)
      ]);
      const [targetsData, actualsData] = await Promise.all([
        targetsResponse.json(),
        actualsResponse.json()
      ]);
      setTargets(targetsData);
      setActuals(actualsData);
      setLoading(false);
    };
    loadData();
  }, [managerId]);

  useEffect(() => {
    const loadTeam = async () => {
      if (managers.length === 0) return;
      const results = await Promise.all(
        managers.map(async (manager) => {
          const [targetsResponse, actualsResponse] = await Promise.all([
            fetch(`/api/targets/bulk?managerId=${manager.id}&year=${DEFAULT_YEAR}`),
            fetch(`/api/actuals/bulk?managerId=${manager.id}&year=${DEFAULT_YEAR}`)
          ]);
          const [targetsData, actualsData] = await Promise.all([
            targetsResponse.json(),
            actualsResponse.json()
          ]);
          return { targetsData, actualsData };
        })
      );

      const teamTargetMap = new Map<number, number>();
      const teamActualMap = new Map<number, number>();
      results.forEach(({ targetsData, actualsData }) => {
        targetsData.forEach((item: Entry) => {
          teamTargetMap.set(item.month, (teamTargetMap.get(item.month) ?? 0) + item.amount);
        });
        actualsData.forEach((item: Entry) => {
          teamActualMap.set(item.month, (teamActualMap.get(item.month) ?? 0) + item.amount);
        });
      });

      setTeamTargets(Array.from(teamTargetMap.entries()).map(([month, amount]) => ({ month, amount })));
      setTeamActuals(Array.from(teamActualMap.entries()).map(([month, amount]) => ({ month, amount })));
    };
    loadTeam();
  }, [managers]);

  const managerName = useMemo(() => {
    return managers.find((manager) => manager.id === managerId)?.fullName ?? "";
  }, [managers, managerId]);

  const monthlyTargetTotals = useMemo(() => monthTotals(targets), [targets]);
  const monthlyActualTotals = useMemo(() => monthTotals(actuals), [actuals]);

  const monthlyChartData = MONTHS.map((label, index) => ({
    name: label,
    hedef: monthlyTargetTotals.get(index + 1) ?? 0,
    gerceklesen: monthlyActualTotals.get(index + 1) ?? 0
  }));

  const yearTarget = yearTotal(targets);
  const yearActual = yearTotal(actuals);
  const yearPercent = percent(yearActual, yearTarget);

  const quarterTargetTotals = quarterTotals(targets);
  const quarterActualTotals = quarterTotals(actuals);

  const quarterCards = QUARTERS.map((quarter, index) => {
    const targetTotal = quarterTargetTotals[index]?.total ?? 0;
    const actualTotal = quarterActualTotals[index]?.total ?? 0;
    return {
      label: quarter.label,
      percent: percent(actualTotal, targetTotal)
    };
  });

  const quarterChartData = QUARTERS.map((quarter, index) => ({
    name: quarter.label,
    hedef: quarterTargetTotals[index]?.total ?? 0,
    gerceklesen: quarterActualTotals[index]?.total ?? 0
  }));

  const teamYearTarget = yearTotal(teamTargets);
  const teamYearActual = yearTotal(teamActuals);
  const teamYearPercent = percent(teamYearActual, teamYearTarget);

  const teamChartData = MONTHS.map((label, index) => ({
    name: label,
    hedef: teamTargets.find((item) => item.month === index + 1)?.amount ?? 0,
    gerceklesen: teamActuals.find((item) => item.month === index + 1)?.amount ?? 0
  }));

  if (!managerId) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Dashboard görüntülemek için önce satış yöneticisi seçin.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{managerName} · {DEFAULT_YEAR}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Kişi Bazlı Performans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Yıl Hedefi</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">{formatCurrency(yearTarget)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Yıl Gerçekleşme</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">{formatCurrency(yearActual)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Yıl Başarı</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">%{yearPercent.toFixed(0)}</CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {quarterCards.map((quarter) => (
            <Card key={quarter.label}>
              <CardHeader>
                <CardTitle>{quarter.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-semibold">%{quarter.percent.toFixed(0)}</CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Yıl Gauge</CardTitle>
          </CardHeader>
          <CardContent>
            <Gauge value={yearPercent} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aylık Hedef ve Gerçekleşme</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hedef" fill="#6366f1" name="Hedef" />
                <Bar dataKey="gerceklesen" fill="#22c55e" name="Gerçekleşme" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarter Hedef ve Gerçekleşme</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hedef" fill="#818cf8" name="Hedef" />
                <Bar dataKey="gerceklesen" fill="#34d399" name="Gerçekleşme" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Ekip Bazlı Performans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Ekip Hedefi</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">{formatCurrency(teamYearTarget)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ekip Gerçekleşme</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">{formatCurrency(teamYearActual)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ekip Başarı</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">%{teamYearPercent.toFixed(0)}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ekip Gauge</CardTitle>
          </CardHeader>
          <CardContent>
            <Gauge value={teamYearPercent} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aylık Ekip Hedef ve Gerçekleşme</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hedef" fill="#60a5fa" name="Hedef" />
                <Bar dataKey="gerceklesen" fill="#22c55e" name="Gerçekleşme" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
