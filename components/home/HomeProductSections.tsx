"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import { buildProductDetailHref } from "@/lib/mappers";
import { cn } from "@/lib/utils";
import { DISCOUNT_PARAM } from "@/lib/product-query";
import useProductStore from "@/store/productStore";
import { productType } from "@/utils/products";
import { ArrowUpRight, Percent, Sparkles, Star, type LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ProductGridCard from "../products/ProductGridCard";

type SectionConfig = {
  id: string;
  titleKey: "latestProduct" | "topRatedProduct" | "discountProduct";
  products: productType[];
  viewAllHref: string;
  icon: LucideIcon;
  accent: string;
};

type ProductSectionProps = {
  config: SectionConfig;
  isLoading: boolean;
  locale: string;
};

function ProductCarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden px-1">
      {Array.from({ length: 4 }, (_, index) => (
        <Card
          key={index}
          size="sm"
          className="min-w-[220px] shrink-0 gap-2 py-0 sm:min-w-[240px]">
          <CardContent className="flex flex-col p-3">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="mx-auto mt-3 h-10 w-4/5" />
            <Skeleton className="mx-auto mt-2 h-7 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductSection({ config, isLoading, locale }: ProductSectionProps) {
  const t = useTranslations("home");
  const { titleKey, products, viewAllHref, icon: Icon, accent } = config;

  if (!isLoading && products.length === 0) return null;

  return (
    <article className="overflow-hidden rounded-2xl border bg-linear-to-br from-muted/30 to-background p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              accent,
            )}>
            <Icon className="size-5" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            {t(titleKey)}
          </h2>
        </div>

        {!isLoading && products.length > 0 ? (
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
            {t("moreProducts")}
            <ArrowUpRight className="size-4" />
          </Link>
        ) : null}
      </div>

      {isLoading ? (
        <ProductCarouselSkeleton />
      ) : (
        <Carousel
          className="w-full"
          opts={{ align: "start", dragFree: true }}>
          <CarouselContent className="-ms-3">
            {products.map(product => (
              <CarouselItem
                key={product.id}
                className="basis-[78%] ps-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <ProductGridCard
                  product={product}
                  href={buildProductDetailHref(locale, product)}
                  compact
                  hoverActions={false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="inset-s-2 hidden border bg-background/90 shadow-md backdrop-blur-sm sm:inline-flex" />
          <CarouselNext className="inset-e-2 hidden border bg-background/90 shadow-md backdrop-blur-sm sm:inline-flex" />
        </Carousel>
      )}
    </article>
  );
}

export default function HomeProductSections() {
  const locale = useLocale();
  const latestProducts = useProductStore(state => state.latestProducts);
  const topRatedProducts = useProductStore(state => state.topRatedProducts);
  const discountProducts = useProductStore(state => state.discountProducts);
  const fetchHomeProductSections = useProductStore(
    state => state.fetchHomeProductSections,
  );
  const isLoading = useProductStore(state => state.loading.fetchHomeSections);

  useStoreInit(() => fetchHomeProductSections());

  const sections: SectionConfig[] = [
    {
      id: "latest",
      titleKey: "latestProduct",
      products: latestProducts,
      viewAllHref: "/products",
      icon: Sparkles,
      accent: "bg-primary/10 text-primary",
    },
    {
      id: "top-rated",
      titleKey: "topRatedProduct",
      products: topRatedProducts,
      viewAllHref: "/products",
      icon: Star,
      accent: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
    {
      id: "discount",
      titleKey: "discountProduct",
      products: discountProducts,
      viewAllHref: `/products?${DISCOUNT_PARAM}=true`,
      icon: Percent,
      accent: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    },
  ];

  const hasAny =
    isLoading ||
    sections.some(section => section.products.length > 0);

  if (!hasAny) return null;

  return (
    <section className="flex w-full flex-col gap-6 sm:gap-8">
      {sections.map(section => (
        <ProductSection
          key={section.id}
          config={section}
          isLoading={isLoading}
          locale={locale}
        />
      ))}
    </section>
  );
}
