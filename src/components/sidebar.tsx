"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, LayoutDashboard, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/managers", label: "Satış Yöneticileri", icon: Users },
  { href: "/targets", label: "Hedefler", icon: ClipboardList },
  { href: "/actuals", label: "Gerçekleşmeler", icon: BarChart3 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col gap-6 border-r border-border bg-background p-6">
      <div>
        <p className="text-xs uppercase text-muted-foreground">Yıl</p>
        <p className="text-lg font-semibold">2026</p>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
