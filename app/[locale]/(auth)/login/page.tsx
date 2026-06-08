import LoginForm from "@/components/auth/LoginForm";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    title: t("loginTitle"),
    description: t("loginDescription"),
    locale,
    path: "/login",
    noIndex: true,
  });
}

export default function LoginPage() {
  return <LoginForm />;
}
