"use client";

import { useAuthPaths } from "@/hooks/use-auth-paths";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

/** Social login is not supported by the marketplace API. */
export default function SsoCallbackContent() {
  const t = useTranslations("auth");
  const paths = useAuthPaths();
  const router = useRouter();

  useEffect(() => {
    toast.error(t("socialLoginUnavailable"));
    router.replace(paths.login);
  }, [paths.login, router, t]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
      {t("redirectingToLogin")}
    </div>
  );
}
