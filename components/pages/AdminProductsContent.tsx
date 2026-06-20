"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import LoadingTable from "@/components/global/LoadingTable";
import FilterPanel from "@/components/products/FilterPanel";
import ProductPrice from "@/components/products/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import { buildManagementProductQueryFromSearchParams } from "@/lib/product-query";
import useManagementStore from "@/store/managementStore";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AdminProductsContent() {
  const t = useTranslations("adminProducts");
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();
  const products = useManagementStore(state => state.products);
  const fetchProducts = useManagementStore(state => state.fetchProducts);
  const deleteProduct = useManagementStore(state => state.deleteProduct);
  const isLoading = useManagementStore(state => state.loading.fetchProducts);
  const isDeleting = useManagementStore(state => state.loading.deleteProduct);

  useStoreInit(
    () => fetchProducts(buildManagementProductQueryFromSearchParams(searchParams)),
    [queryKey],
  );

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(t("deleteConfirm", { name: label }))) return;

    try {
      await deleteProduct(id);
      toast.success(t("productDeleted"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("productDeleteFailed"),
      );
    }
  };

  return (
    <PageShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <Button
          asChild
          className="shrink-0">
          <Link href="/admin/products/create">
            <Plus className="size-4" />
            {t("createProduct")}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="rounded-sm border p-4">
          <FilterPanel variant="management" />
        </div>

        <section className="space-y-4">
          {isLoading && products.length === 0 ? (
            <LoadingTable rows={6} />
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noProducts")}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("product")}</TableHead>
                    <TableHead>{t("category")}</TableHead>
                    <TableHead>{t("price")}</TableHead>
                    <TableHead>{t("stock")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-end">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded">
                            <Image
                              src={
                                product.images[0]?.url ?? "/images/hero1.jpg"
                              }
                              alt={product.label}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="line-clamp-2 max-w-48 capitalize">
                            {product.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category || "—"}
                      </TableCell>
                      <TableCell>
                        <ProductPrice
                          product={product}
                          emphasis
                        />
                      </TableCell>
                      <TableCell>{product.stock ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.isOutOfStock ? t("outOfStock") : t("active")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            asChild
                            size="icon"
                            variant="outline">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() =>
                              void handleDelete(product.id, product.label)
                            }>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
