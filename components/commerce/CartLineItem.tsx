"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import useCartStore from "@/store/cartStore";
import { formatCurrency } from "@/utils/format";
import { productType } from "@/utils/products";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";

type CartLineItemProps = {
  id: string;
  product: productType;
  quantity: number;
  locale: string;
};

export default function CartLineItem({
  id,
  product,
  quantity,
  locale,
}: CartLineItemProps) {
  const t = useTranslations("cart");
  const updateItem = useCartStore(state => state.updateItem);
  const removeItem = useCartStore(state => state.removeItem);
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const handleUpdateQuantity = async (nextQuantity: number) => {
    const previousQuantity = localQuantity;
    if (nextQuantity < 1 || nextQuantity === previousQuantity) return;

    const delta = nextQuantity - previousQuantity;
    if (delta > 0 && product.isOutOfStock) {
      toast.error(t("outOfStock"));
      return;
    }

    setIsUpdating(true);
    setLocalQuantity(nextQuantity);

    try {
      await updateItem({ id, product: product.id, quantity: delta });
      toast.success(t("updated"), {
        description: t("updatedDescription", {
          quantity: nextQuantity,
          product: product.label,
        }),
      });
    } catch (error) {
      setLocalQuantity(quantity);
      toast.error(error instanceof Error ? error.message : t("updateFailed"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);

    try {
      await removeItem(id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("removeFailed"));
    } finally {
      setIsRemoving(false);
    }
  };

  const isBusy = isUpdating || isRemoving;

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
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ButtonGroup aria-label={t("amount")}>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => handleUpdateQuantity(localQuantity - 1)}
                disabled={isBusy || localQuantity <= 1}>
                <Minus />
              </Button>
              <ButtonGroupText>{localQuantity}</ButtonGroupText>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => handleUpdateQuantity(localQuantity + 1)}
                disabled={isBusy || product.isOutOfStock}>
                <Plus />
              </Button>
            </ButtonGroup>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isBusy}>
              <Trash2 />
              {t("remove")}
            </Button>
          </div>
        </div>
        <p className="text-lg font-semibold sm:text-end">
          {formatCurrency(product.price * localQuantity)}
        </p>
      </CardContent>
    </Card>
  );
}
