"use client";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import Logo from "@/components/layout/Logo";
import { Suspense } from "react";

export default function AuthTopBar() {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 py-4 backdrop-blur md:px-8">
      <Logo />
      <Suspense fallback={<span className="h-8 w-14 rounded-sm border" />}>
        <LanguageSwitcher />
      </Suspense>
    </header>
  );
}
