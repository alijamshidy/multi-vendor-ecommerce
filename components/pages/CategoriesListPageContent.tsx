"use client";

import CatalogGrid from "@/components/catalog/CatalogGrid";
import CatalogGridSkeleton from "@/components/catalog/CatalogGridSkeleton";
import CatalogSearchBar from "@/components/catalog/CatalogSearchBar";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import type { CatalogScope } from "@/lib/catalog-paths";
import { buildListQueryFromSearchParams } from "@/lib/list-query";
import useCategoryStore from "@/store/categoryStore";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function CategoriesListPageContent({
  scope,
}: {
  scope: CatalogScope;
}) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();
  const categories = useCategoryStore(state => state.categories);
  const errorMessage = useCategoryStore(state => state.errorMessage);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const isLoading = useCategoryStore(state => state.loading.fetchCategories);
  const isAdmin = scope === "admin";

  useStoreInit(
    () => fetchCategories(buildListQueryFromSearchParams(searchParams)),
    [queryKey],
  );

  const eyebrow =
    scope === "admin"
      ? t("adminEyebrow")
      : scope === "customer"
        ? t("customerEyebrow")
        : t("publicEyebrow");

  return (
    <PageShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          eyebrow={eyebrow}
          title={t("categoriesTitle")}
          description={t("categoriesListDescription")}
        />
        {isAdmin ? (
          <Button
            asChild
            className="shrink-0">
            <Link href="/admin/categories/create">
              <Plus className="size-4" />
              {t("createCategory")}
            </Link>
          </Button>
        ) : null}
      </div>

      <CatalogSearchBar />

      {isLoading ? (
        <CatalogGridSkeleton />
      ) : errorMessage && categories.length === 0 ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">{tCommon("noCategories")}</p>
      ) : (
        <CatalogGrid
          items={categories}
          scope={scope}
          type="categories"
          showMeta={isAdmin}
        />
      )}
    </PageShell>
  );
}
