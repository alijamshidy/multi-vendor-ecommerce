"use client";

import useAuthStore from "@/store/authStore";
import { GetLocale } from "@/utils/GetUrlParams";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type SignOutLinkProps = {
  onNavigate?: () => void;
};

export default function SignOutLink({ onNavigate }: SignOutLinkProps) {
  const t = useTranslations("nav");
  const router = useRouter();
  const locale = GetLocale();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    onNavigate?.();
    toast.success(t("loggedOut"));
    router.replace(`/${locale}`);
  };

  return (
    <button
      type="button"
      className="w-full px-2 py-1.5 text-start text-sm"
      onClick={handleLogout}>
      {t("logout")}
    </button>
  );
}
