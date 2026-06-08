"use client";

import { Link } from "@/i18n/navigation";
import { toNavigationPath } from "@/lib/mappers";
import useContentStore from "@/store/contentStore";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export default function Recommendations() {
  const locale = useLocale();
  const t = useTranslations("home");
  const recommendations = useContentStore(state => state.recommendations);
  const isLoading = useContentStore(state => state.loading.fetchRecommendations);

  if (!isLoading && recommendations.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <Label className="text-xl sm:text-2xl md:text-3xl md:font-bold">
          {t("recommendations")}
        </Label>
        <Separator className="w-24 bg-primary sm:w-32" />
      </div>

      {isLoading ? (
        <p className="text-center text-sm text-muted-foreground">
          {t("recommendationsLoading")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(item => {
            const href = toNavigationPath(item.href, locale);
            const isExternal = href.startsWith("http");
            const card = (
              <>
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.text ?? t("recommendationAlt")}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {item.text ? (
                  <div className="p-4">
                    <p
                      className="font-medium"
                      style={item.color ? { color: item.color } : undefined}>
                      {item.text}
                    </p>
                  </div>
                ) : null}
              </>
            );

            return isExternal ? (
              <a
                key={item.id}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-md border transition-shadow hover:shadow-md">
                {card}
              </a>
            ) : (
              <Link
                key={item.id}
                href={href}
                className="group overflow-hidden rounded-md border transition-shadow hover:shadow-md">
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
