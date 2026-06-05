import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "../ui/button";
import HeroCarousel from "./HeroCarousel";

export default async function Hero() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div className="">
        <h1 className="max-w-2xl font-bold text-4xl tracking-tight sm:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
          {t("heroDescription")}
        </p>
        <Button
          asChild
          size={"lg"}
          className="mt-10">
          <Link href={`/${locale}/products`}>{t("ourProducts")}</Link>
        </Button>
      </div>
      <HeroCarousel />
    </section>
  );
}
