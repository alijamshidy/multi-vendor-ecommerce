"use client";

import AuthFooterNote from "@/components/auth/AuthFooterNote";
import AuthShell from "@/components/auth/AuthShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthPaths } from "@/hooks/use-auth-paths";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ResetPasswordForm() {
  const t = useTranslations("auth");
  const paths = useAuthPaths();

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card className="rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("resetPassword")}</CardTitle>
            <CardDescription>{t("resetPasswordUnavailable")}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href={paths.login} className="text-sm underline">
              {t("signIn")}
            </Link>
          </CardContent>
        </Card>
        <AuthFooterNote />
      </div>
    </AuthShell>
  );
}
