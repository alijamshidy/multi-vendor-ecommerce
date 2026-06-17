"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserIconClient from "@/components/navbar/UserIconClient";
import { Button } from "@/components/ui/button";
import { useAuthRole, useIsAuthenticated } from "@/hooks/use-authenticated-user";
import { useStoreInitOnce } from "@/hooks/use-store-init";
import { Link, useRouter } from "@/i18n/navigation";
import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/userStore";
import { getDashboardHref, sellerRegisterHref } from "@/utils/links";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function LinksDropdown() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const role = useAuthRole();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const fetchProfile = useUserStore(state => state.fetchProfile);
  const profile = useUserStore(state => state.profile);

  useStoreInitOnce(() => {
    if (isAuthenticated) {
      void fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  const closeMenu = () => setOpen(false);

  const displayName =
    profile?.name ?? profile?.full_name ?? user?.name ?? user?.email;

  const handleLogout = async () => {
    closeMenu();
    await logout();
    toast.success(t("loggedOut"));
    router.replace("/");
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      modal={false}>
      <DropdownMenuTrigger
        className="cursor-pointer"
        asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8 shrink-0 rounded-full p-0"
          aria-label={isAuthenticated ? t("account") : t("login")}>
          <UserIconClient imageUrl={null} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-48"
        align="end"
        sideOffset={8}>
        {isAuthenticated && displayName ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <span className="truncate font-medium">{displayName}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className="cursor-pointer"
                onSelect={closeMenu}>
                <Link href={getDashboardHref(role ?? user?.role)}>
                  <LayoutDashboard className="size-4" />
                  {t("dashboard")}
                </Link>
              </DropdownMenuItem>
              {role === "customer" || role === "seller" || user?.role === "customer" || user?.role === "seller" ? (
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                  onSelect={closeMenu}>
                  <Link href="/profile">
                    <User className="size-4" />
                    {t("profile")}
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => void handleLogout()}>
                <LogOut className="size-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : (
          <>
            <DropdownMenuLabel>{t("guest")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className="cursor-pointer"
                onSelect={closeMenu}>
                <Link href="/login">
                  <LogIn className="size-4" />
                  {t("login")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer"
                onSelect={closeMenu}>
                <Link href="/register">
                  <UserPlus className="size-4" />
                  {t("register")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer"
                onSelect={closeMenu}>
                <Link href={sellerRegisterHref}>
                  <UserPlus className="size-4" />
                  {tAuth("registerAsSeller")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
