<<<<<<< HEAD
"use client";
=======
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ThemeProvider
        attribute={"class"}
<<<<<<< HEAD
        themes={["light", "dark", "system"]}>
=======
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
        {children}
      </ThemeProvider>
    </>
  );
}
