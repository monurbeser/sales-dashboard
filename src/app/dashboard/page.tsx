import { ManagerSelect } from "@/components/manager-select";
import { DashboardClient } from "@/app/dashboard/dashboard-client";

export default function DashboardPage({ searchParams }: { searchParams: { managerId?: string } }) {
  return (
    <div className="space-y-6">
      <ManagerSelect basePath="/dashboard" />
      <DashboardClient managerId={searchParams.managerId ?? null} />
    </div>
  );
}
