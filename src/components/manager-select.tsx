"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ManagerOption = { id: string; fullName: string };

interface ManagerSelectProps {
  basePath: string;
}

export function ManagerSelect({ basePath }: ManagerSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("managerId") ?? "";
  const [managers, setManagers] = useState<ManagerOption[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/managers");
      const data = await response.json();
      setManagers(data);
    };
    load();
  }, []);

  return (
    <Select
      value={selected}
      onValueChange={(value) => {
        router.push(`${basePath}?managerId=${value}`);
      }}
    >
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Yönetici seçin" />
      </SelectTrigger>
      <SelectContent>
        {managers.map((manager) => (
          <SelectItem key={manager.id} value={manager.id}>
            {manager.fullName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
