"use client";

import { usePathname } from "next/navigation";

export function useAuthPaths() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const base = `/${locale}`;

  return {
    locale,
    home: base,
    login: `${base}/login`,
    register: `${base}/register`,
    resetPassword: `${base}/reset_password`,
    dashboard: `${base}/dashboard`,
  };
}
