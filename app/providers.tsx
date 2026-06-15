"use client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import React, { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      void import("@/store/registerDevtools");
    }
  }, []);

  return (
    <>
      {/* <SessionProvider> */}
      <Toaster />
      <ThemeProvider
        attribute={"class"}
        themes={["light", "dark", "system"]}>
        {children}
      </ThemeProvider>
      {/* </SessionProvider> */}
    </>
  );
}
