"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import LoadingTable from "@/components/global/LoadingTable";
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
import useManagementStore from "@/store/managementStore";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function SellerDiscountProductsPageContent() {
  const t = useTranslations("sellerDiscountProducts");
  const products = useManagementStore(state => state.products);
  const fetchProducts = useManagementStore(state => state.fetchProducts);
  const isLoading = useManagementStore(state => state.loading.fetchProducts);

  useStoreInit(() => fetchProducts({ page: 1, parPage: 100 }));

  const discountProducts = products.filter(
    product => product.originalPrice > product.price,
  );

  const getDiscountPercent = (product: (typeof products)[number]) =>
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      {isLoading && discountProducts.length === 0 ? (
        <LoadingTable />
      ) : discountProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("product")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("discount")}</TableHead>
                <TableHead>{t("stock")}</TableHead>
                <TableHead className="text-end">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discountProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.label}
                          width={40}
                          height={40}
                          className="size-10 rounded object-cover"
                        />
                      ) : null}
                      <span className="font-medium">{product.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <ProductPrice product={product} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getDiscountPercent(product)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{product.stock ?? "—"}</TableCell>
                  <TableCell className="text-end">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild>
                      <Link href={`/seller/products/${product.id}/edit`}>
                        <Pencil className="me-1 size-4" />
                        {t("edit")}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageShell>
  );
}
