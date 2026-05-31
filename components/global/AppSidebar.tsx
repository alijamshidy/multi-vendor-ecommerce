"use client";

import { StoreNav } from "@/components/sidebar/StoreNav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GetLocale } from "@/utils/GetUrlParams";
import { Store } from "lucide-react";
import Link from "next/link";
import { NavUser } from "../sidebar/NavUser";

const user = {
  name: "Guest",
  email: "guest@storefront.demo",
  avatar: "/avatars/shadcn.jpg",
};

export function AppSidebar() {
  const locale = GetLocale();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild>
              <Link href={`/${locale}`}>
                <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Store className="size-4" />
                </span>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">Next Store</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Marketplace
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <StoreNav />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
