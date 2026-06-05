"use client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import React from "react";

if (process.env.NODE_ENV === "development") {
  require("@/store/registerDevtools");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ThemeProvider
        attribute={"class"}
        themes={["light", "dark", "system"]}>
        {children}
      </ThemeProvider>
    </>
  );
}
