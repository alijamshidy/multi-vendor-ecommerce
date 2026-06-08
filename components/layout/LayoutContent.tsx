"use client";

import SiteFooter from "@/components/Global/SiteFooter";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb";
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
            "mx-[4%] flex min-w-0 w-[calc(100%-8%)] flex-1 flex-col gap-4 overflow-x-hidden pb-8 pt-[5.25rem]",
            open ? "md:pt-[5.25rem] lg:pt-[6.25rem]" : "md:pt-[6.25rem]",
          )}>
          <AppBreadcrumb />
          {children}
        </div>
        <SiteFooter className="w-full" />
      </SidebarInset>
    </>
  );
}
