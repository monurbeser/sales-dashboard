import type { Metadata } from "next";
import "./globals.css";

import { Sidebar } from "@/components/sidebar";
import { AppToaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Sales Dashboard",
  description: "2026 satış hedef ve gerçekleşme yönetimi"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-muted/40">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
          <Sidebar />
          <main className="p-6 lg:p-10">
            {children}
          </main>
        </div>
        <AppToaster />
      </body>
    </html>
  );
}
