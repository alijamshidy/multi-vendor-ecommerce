"use client";

import SiteFooter from "@/components/Global/SiteFooter";
import { cn } from "@/lib/utils";
import { AppSidebar } from "../Global/AppSidebar";
import Header from "../Global/Header";
import { SidebarInset, useSidebar } from "../ui/sidebar";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open } = useSidebar();

  return (
    <>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh min-w-0 flex-col overflow-x-hidden">
        <Header open={open} />
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden pb-8 pt-[4.5rem]",
            open
              ? "px-3 sm:px-4 md:ps-[1.5%] md:pe-[4%] lg:px-6"
              : "px-3 sm:px-4 md:ps-[2.1%] md:pe-[5%] lg:px-8",
          )}>
          {children}
        </div>
        <SiteFooter />
      </SidebarInset>
    </>
  );
}
