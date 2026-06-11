"use client";

import CatalogCard from "@/components/catalog/CatalogCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getCatalogDetailPath, type CatalogScope } from "@/lib/catalog-paths";
import { Pencil, Trash2 } from "lucide-react";

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
  onDelete?: (item: CatalogGridItem) => void;
};

export default function CatalogGrid({
  items,
  scope,
  type,
  showMeta = false,
  onDelete,
}: CatalogGridProps) {
  const isAdmin = scope === "admin";

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map(item => {
        const editPath =
          type === "categories"
            ? `/admin/categories/${encodeURIComponent(item.href)}/edit`
            : `/admin/collections/${encodeURIComponent(item.href)}/edit`;

        return (
          <div
            key={item.id}
            className="relative h-full">
            <CatalogCard
              item={item}
              detailPath={getCatalogDetailPath(scope, type, item.href)}
              showMeta={showMeta}
            />
            {isAdmin ? (
              <div className="absolute end-2 top-2 z-10 flex gap-1">
                <Button
                  asChild
                  size="icon"
                  variant="secondary"
                  className="size-8">
                  <Link href={editPath}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                {onDelete ? (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-8"
                    onClick={() => onDelete(item)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
