"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar";

export default function Side() {
  return (
    <>
      <Sidebar className="pt-14 md:z-40 w-full max-w-full md:max-w-64 pl-4">
        <SidebarTrigger className="absolute top-11 right-[5%] md:hidden" />
        <SidebarHeader>
          <div className="font-bold">User</div>
        </SidebarHeader>
        <SidebarContent className="mt-10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Link href={"/"}>
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 z-50 fixed top-12 left-[calc(5%+15px)]">
        <SidebarTrigger className="w-7 h-7 z-50" />
      </main>
    </>
  );
}
