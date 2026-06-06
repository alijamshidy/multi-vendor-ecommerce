"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useStoreInit } from "@/hooks/use-store-init";
import useCategoryStore from "@/store/categoryStore";
import { GetLocale } from "@/utils/GetUrlParams";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function CategoryCarousel() {
  const locale = GetLocale();
  const tCommon = useTranslations("common");
  const categories = useCategoryStore(state => state.categories);

  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const isLoading = useCategoryStore(state => state.loading.fetchCategories);

  useStoreInit(() => fetchCategories());
  if (isLoading) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        {tCommon("loading")}
      </p>
    );
  }
  if (categories.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        {tCommon("noCategories")}
      </p>
    );
  } else {
    return (
      <Carousel
        className="w-full"
        plugins={[Autoplay({ delay: 2000 })]}
        opts={{ loop: false, align: "start" }}>
        <CarouselContent className="-ml-[4px] w-full">
          {categories.map(category => (
            <CarouselItem
              key={category.id}
              className="basis-1/2 py-1 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <Link
                href={`/${locale}/${category.href}`}
                className="block">
                <Card
                  size="sm"
                  className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                  <CardContent className="relative p-0">
                    <div className="relative h-24 w-full sm:h-28">
                      <Image
                        fill
                        src={category.image}
                        alt={category.label}
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 via-background/80 to-transparent px-2 pb-1.5 pt-5">
                        <span className="block truncate text-center text-sm font-semibold">
                          {category.label}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }
}

export default function TopCategory() {
  const t = useTranslations("home");

  return (
    <section className="flex w-full flex-col gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <Label className="text-xl sm:text-2xl md:text-3xl md:font-bold">
          {t("topCategory")}
        </Label>
        <Separator className="w-24 bg-primary sm:w-32" />
      </div>

      <CategoryCarousel />
    </section>
  );
}
