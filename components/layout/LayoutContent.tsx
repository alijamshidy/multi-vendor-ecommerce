"use client";
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
      <SidebarInset>
        <Header open={open} />
        <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-20 md:px-0 md:pt-0">
          {children}
        </div>
      </SidebarInset>
    </>
  );
}
