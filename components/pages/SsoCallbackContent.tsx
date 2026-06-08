"use client";

import { useAuthPaths } from "@/hooks/use-auth-paths";
import { isSafeCallbackUrl, redirectAfterAuth } from "@/lib/auth-cookie";
import useAuthStore from "@/store/authStore";
import { useRouter } from "@/i18n/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function SsoCallbackContent() {
  const t = useTranslations("auth");
  const paths = useAuthPaths();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const socialLogin = useAuthStore(state => state.socialLogin);
  const handledRef = useRef(false);

  useEffect(() => {
    if (status === "loading" || handledRef.current) return;

    if (status === "unauthenticated") {
      handledRef.current = true;
      toast.error(t("socialLoginFailed"));
      router.replace(paths.login);
      return;
    }

    if (!session?.idToken || !session.provider) return;

    handledRef.current = true;

    void (async () => {
      try {
        await socialLogin({
          provider: session.provider as "google",
          idToken: session.idToken as string,
        });

        await signOut({ redirect: false });
        toast.success(t("signedInSuccess"));

        const callbackUrl = searchParams.get("callbackUrl");
        const destination = isSafeCallbackUrl(callbackUrl)
          ? callbackUrl
          : paths.dashboard;
        redirectAfterAuth(destination);
      } catch (error) {
        await signOut({ redirect: false });
        const message =
          error instanceof Error ? error.message : t("socialLoginFailed");
        toast.error(message);
        router.replace(paths.login);
      }
    })();
  }, [
    paths.dashboard,
    paths.login,
    router,
    searchParams,
    session,
    socialLogin,
    status,
    t,
  ]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
      {t("completingSocialSignIn")}
    </div>
  );
}
