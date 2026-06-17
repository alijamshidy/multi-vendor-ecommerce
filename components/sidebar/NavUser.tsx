"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthRole, useIsAuthenticated } from "@/hooks/use-authenticated-user";
import { useStoreInitOnce } from "@/hooks/use-store-init";
import { Link, useRouter } from "@/i18n/navigation";
import { resolveMediaUrl } from "@/lib/api-utils";
import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/userStore";
import { getDashboardHref, sellerRegisterHref } from "@/utils/links";
import {
  ChevronsUpDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

function getInitials(name?: string, email?: string): string {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const role = useAuthRole();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const profile = useUserStore(state => state.profile);
  const fetchProfile = useUserStore(state => state.fetchProfile);

  useStoreInitOnce(() => {
    if (isAuthenticated) {
      void fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  const displayName =
    profile?.name ?? profile?.full_name ?? user?.name ?? user?.email ?? t("guest");
  const displayEmail = profile?.email ?? user?.email ?? "";
  const avatarUrl = resolveMediaUrl(profile?.image ?? null);
  const initials = getInitials(displayName, displayEmail);

  const handleLogout = async () => {
    await logout();
    toast.success(t("loggedOut"));
    router.replace("/");
  };

  const guestMenu = (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href="/login">
          <LogIn />
          {t("login")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/register">
          <UserPlus />
          {t("register")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={sellerRegisterHref}>
          <UserPlus />
          {tAuth("registerAsSeller")}
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );

  const authenticatedMenu = (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href={getDashboardHref(role ?? user?.role)}>
          <LayoutDashboard />
          {t("dashboard")}
        </Link>
      </DropdownMenuItem>
      {role === "customer" ||
      role === "seller" ||
      user?.role === "customer" ||
      user?.role === "seller" ? (
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User />
            {t("profile")}
          </Link>
        </DropdownMenuItem>
      ) : null}
      <DropdownMenuItem onClick={() => void handleLogout()}>
        <LogOut />
        {t("logout")}
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={displayName}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={avatarUrl ?? undefined}
                  alt={displayName}
                />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {isAuthenticated ? displayEmail || t("account") : t("guest")}
                </span>
              </div>
              <ChevronsUpDown className="ms-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            {isAuthenticated ? (
              <>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage
                        src={avatarUrl ?? undefined}
                        alt={displayName}
                      />
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-start text-sm leading-tight">
                      <span className="truncate font-medium">{displayName}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {displayEmail}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {authenticatedMenu}
              </>
            ) : (
              <>
                <DropdownMenuLabel>{t("guest")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {guestMenu}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
