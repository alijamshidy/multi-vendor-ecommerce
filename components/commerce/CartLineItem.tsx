"use client";

import { formatCurrency } from "@/utils/format";
import { productType } from "@/utils/products";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "../ui/card";

type CartLineItemProps = {
  product: productType;
  quantity: number;
  locale: string;
};

export default function CartLineItem({
  product,
  quantity,
  locale,
}: CartLineItemProps) {
  const t = useTranslations("common");

  return (
    <Card className="rounded-md">
      <CardContent className="grid gap-4 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
        <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
          <Image
            src={product.images[0].url}
            alt={product.label}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <Link
            href={`/${locale}/products/${product.id}`}
            className="font-medium capitalize hover:text-primary">
            {product.label}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.category}
          </p>
          <p className="mt-3 text-sm">{t("qty", { quantity })}</p>
        </div>
        <p className="text-lg font-semibold sm:text-end">
          {formatCurrency(product.price * quantity)}
        </p>
      </CardContent>
    </Card>
  );
}
