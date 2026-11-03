import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/shared/ui/dashboard-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agent Observability",
  description: "Self-hosted observability dashboard for AI agents.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
