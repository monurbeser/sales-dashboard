import { ManagerSelect } from "@/components/manager-select";
import { TargetsClient } from "@/app/targets/targets-client";

export default function TargetsPage({ searchParams }: { searchParams: { managerId?: string } }) {
  return (
    <div className="space-y-6">
      <ManagerSelect basePath="/targets" />
      <TargetsClient managerId={searchParams.managerId ?? null} />
    </div>
  );
}
