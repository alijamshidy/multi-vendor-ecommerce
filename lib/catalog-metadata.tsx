import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type CatalogListMetaOptions = {
  locale: string;
  type: "categories" | "collections";
  scope: "public" | "customer" | "admin";
};

type CatalogDetailMetaOptions = CatalogListMetaOptions & {
  slug: string;
};

function getCatalogPath(
  type: "categories" | "collections",
  scope: "public" | "customer" | "admin",
  slug?: string,
) {
  const base =
    scope === "public" ? `/${type}` : `/${scope}/${type}`;
  return slug ? `${base}/${slug}` : base;
}

export async function buildCatalogListMetadata({
  locale,
  type,
  scope,
}: CatalogListMetaOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const isCategories = type === "categories";

  return buildPageMetadata({
    title: isCategories ? t("categoriesTitle") : t("collectionsTitle"),
    description: isCategories
      ? t("categoriesListDescription")
      : t("collectionsListDescription"),
    locale,
    path: getCatalogPath(type, scope),
  });
}

export async function buildCatalogDetailMetadata({
  locale,
  type,
  scope,
  slug,
}: CatalogDetailMetaOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const label = slug.replace(/-/g, " ");
  const isCategories = type === "categories";

  return buildPageMetadata({
    title: isCategories
      ? t("categoryTitle", { name: label })
      : t("collectionTitle", { name: label }),
    description: isCategories
      ? t("categoryDescription", { name: label })
      : t("collectionDescription", { name: label }),
    locale,
    path: getCatalogPath(type, scope, slug),
  });
}

function CatalogPageFallback() {
  return (
    <div className="py-12 text-center text-muted-foreground">Loading...</div>
  );
}

export { CatalogPageFallback };
