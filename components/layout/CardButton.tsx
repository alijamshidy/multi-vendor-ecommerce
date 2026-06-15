"use client";

import BadgeIconButton from "@/components/global/BadgeIconButton";
import { useStoreInitOnce } from "@/hooks/use-store-init";
import useCartStore from "@/store/cartStore";
import { GetLocale } from "@/utils/GetUrlParams";
import { useTranslations } from "next-intl";
import { LuShoppingCart } from "react-icons/lu";

export default function CardButton() {
  const locale = GetLocale();
  const t = useTranslations("nav");
  const itemCount = useCartStore(state => state.itemCount);
  const fetchItems = useCartStore(state => state.fetchItems);

  useStoreInitOnce(() => fetchItems());

  return (
    <BadgeIconButton
      href={`/${locale}/cart`}
      count={itemCount}
      icon={<LuShoppingCart />}
      label={t("cart")}
    />
  );
}
