"use client";

import type { AuthRole } from "@/lib/auth-cookie";
import { usePathname } from "next/navigation";

export function dashboardPathForRole(locale: string, role?: AuthRole): string {
  if (role === "admin") return `/${locale}/admin/dashboard`;
  if (role === "seller") return `/${locale}/seller/dashboard`;
  return `/${locale}/customer/dashboard`;
}

export function useAuthPaths() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const base = `/${locale}`;

  return {
    locale,
    home: base,
    login: `${base}/login`,
    register: `${base}/register`,
    sellerRegister: `${base}/register?type=seller`,
    resetPassword: `${base}/reset_password`,
    dashboard: `${base}/customer/dashboard`,
    adminDashboard: `${base}/admin/dashboard`,
    sellerDashboard: `${base}/seller/dashboard`,
    dashboardForRole: (role?: AuthRole) => dashboardPathForRole(locale, role),
  };
}
