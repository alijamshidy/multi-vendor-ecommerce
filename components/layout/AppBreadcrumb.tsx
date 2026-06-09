"use client";

import PageBreadcrumb, {
  type BreadcrumbItemData,
} from "@/components/layout/PageBreadcrumb";
import { useBreadcrumbDynamicLabel } from "@/context/breadcrumb-context";
import { routing } from "@/i18n/routing";
import {
  getBreadcrumbConfig,
  getPathSegments,
  stripLocaleFromPathname,
  type BreadcrumbConfigItem,
} from "@/lib/breadcrumb";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type LabelTranslator = (labelKey: string) => string;

function createLabelTranslator(
  tNav: ReturnType<typeof useTranslations<"nav">>,
  tCart: ReturnType<typeof useTranslations<"cart">>,
  tAuth: ReturnType<typeof useTranslations<"auth">>,
  tProduct: ReturnType<typeof useTranslations<"product">>,
  tCatalog: ReturnType<typeof useTranslations<"catalog">>,
): LabelTranslator {
  return (labelKey: string) => {
    const [namespace, key] = labelKey.split(".") as [string, string];

    switch (namespace) {
      case "nav":
        return tNav(key as Parameters<typeof tNav>[0]);
      case "cart":
        return tCart(key as Parameters<typeof tCart>[0]);
      case "auth":
        return tAuth(key as Parameters<typeof tAuth>[0]);
      case "product":
        return tProduct(key as Parameters<typeof tProduct>[0]);
      case "catalog":
        return tCatalog(key as Parameters<typeof tCatalog>[0]);
      default:
        return labelKey;
    }
  };
}

function resolveLabel(
  item: BreadcrumbConfigItem,
  translate: LabelTranslator,
  dynamicLabel: string | null,
): string {
  if (item.type === "dynamic") {
    if (dynamicLabel) return dynamicLabel;
    if (item.dynamicType === "product") {
      return translate("product.productDetail");
    }
    if (item.dynamicType === "collection") {
      return translate("catalog.collection");
    }
    return translate("product.category");
  }

  return translate(item.labelKey);
}

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const dynamicLabel = useBreadcrumbDynamicLabel();
  const tNav = useTranslations("nav");
  const tCart = useTranslations("cart");
  const tAuth = useTranslations("auth");
  const tProduct = useTranslations("product");
  const tCatalog = useTranslations("catalog");

  const items = useMemo(() => {
    const translate = createLabelTranslator(
      tNav,
      tCart,
      tAuth,
      tProduct,
      tCatalog,
    );
    const path = stripLocaleFromPathname(pathname, routing.locales);
    const segments = getPathSegments(path);
    const config = getBreadcrumbConfig(segments);

    if (config.length === 0) return [];

    return config.map((item, index) => {
      const label = resolveLabel(item, translate, dynamicLabel);
      const isLast = index === config.length - 1;

      const data: BreadcrumbItemData = { label };

      if (!isLast && item.type === "link") {
        data.href = item.href;
      }

      return data;
    });
  }, [pathname, dynamicLabel, tNav, tCart, tAuth, tProduct, tCatalog]);

  return <PageBreadcrumb items={items} />;
}
