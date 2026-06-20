import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function BlogPageContent() {
  const t = await getTranslations("blog");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <Card className="rounded-md">
        <CardContent className="p-6">
          <p className="text-muted-foreground">{t("comingSoon")}</p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
