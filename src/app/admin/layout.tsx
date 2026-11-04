import type { Metadata } from "next";
import { AdminShell } from "@/modules/admin/AdminShell";

export const metadata: Metadata = { title: "Panel administrativo", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
