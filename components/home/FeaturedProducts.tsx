"use client";

import { useStoreInit } from "@/hooks/use-store-init";
import useProductStore from "@/store/productStore";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductGrid from "../products/ProductGrid";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export default function FeaturedProducts() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const featuredProducts = useProductStore(state => state.featuredProducts);
  const fetchFeaturedProducts = useProductStore(
    state => state.fetchFeaturedProducts,
  );
  const isLoading = useProductStore(state => state.loading.fetchFeatured);

  useStoreInit(() => fetchFeaturedProducts(8));

  return (
    <section className="flex w-full flex-col gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <Label className="text-xl sm:text-2xl md:text-3xl md:font-bold">
          {t("featuredProducts")}
        </Label>
        <Separator className="w-24 bg-primary sm:w-32" />
      </div>
      {isLoading && featuredProducts.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          {tCommon("loadingProducts")}
        </p>
      ) : (
        <ProductGrid
          products={featuredProducts}
          locale={locale}
          compact
          hoverActions
        />
      )}
      <Link
        href={`/${locale}/products`}
        className=" text-lg font-bold text-primary transition-transform duration-300 sm:text-xl w-fit mx-auto hover:scale-110">
        {t("moreProducts")}
      </Link>
    </section>
  );
}
