import Container from "@/components/Global/Container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">
        404
      </p>
      <h1 className="text-3xl font-semibold sm:text-4xl">
        {t("notFoundTitle")}
      </h1>
      <p className="max-w-md text-muted-foreground">
        {t("notFoundDescription")}
      </p>
      <Button asChild>
        <Link href="/">{t("backToHome")}</Link>
      </Button>
    </Container>
  );
}
