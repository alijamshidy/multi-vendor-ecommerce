"use client";

import CatalogCard from "@/components/catalog/CatalogCard";
import { getCatalogDetailPath, type CatalogScope } from "@/lib/catalog-paths";

type CatalogGridItem = {
  id: string;
  href: string;
  label: string;
  image: string;
  description?: string;
};

type CatalogGridProps = {
  items: CatalogGridItem[];
  scope: CatalogScope;
  type: "categories" | "collections";
  showMeta?: boolean;
};

export default function CatalogGrid({
  items,
  scope,
  type,
  showMeta = false,
}: CatalogGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map(item => (
        <CatalogCard
          key={item.id}
          item={item}
          detailPath={getCatalogDetailPath(scope, type, item.href)}
          showMeta={showMeta}
        />
      ))}
    </div>
  );
}
