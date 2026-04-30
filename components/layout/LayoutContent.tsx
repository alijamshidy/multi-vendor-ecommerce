"use client";
import { AppSidebar } from "../Global/AppSidebar";
import Header from "../Global/Header";
import { SidebarInset, SidebarTrigger, useSidebar } from "../ui/sidebar";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open } = useSidebar();
  console.log(open);

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="md:hidden ml-2" />
        <Header open={open} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </>
  );
}
