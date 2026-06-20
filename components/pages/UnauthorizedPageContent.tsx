"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UnauthorizedPageContent() {
  const t = useTranslations("unauthorized");

  return (
    <PageShell>
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <ShieldAlert className="size-16 text-destructive" />
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <Button asChild>
          <Link href="/login">{t("backToLogin")}</Link>
        </Button>
      </div>
    </PageShell>
  );
}
