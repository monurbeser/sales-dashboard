import { ManagerSelect } from "@/components/manager-select";
import { ActualsClient } from "@/app/actuals/actuals-client";

export default function ActualsPage({ searchParams }: { searchParams: { managerId?: string } }) {
  return (
    <div className="space-y-6">
      <ManagerSelect basePath="/actuals" />
      <ActualsClient managerId={searchParams.managerId ?? null} />
    </div>
  );
}
