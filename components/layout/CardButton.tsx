"use client";

import BadgeIconButton from "@/components/global/BadgeIconButton";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { GetLocale } from "@/utils/GetUrlParams";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { LuShoppingCart } from "react-icons/lu";

export default function CardButton() {
  const locale = GetLocale();
  const t = useTranslations("nav");
  const userId = useAuthStore(state => state.user?.id);
  const itemCount = useCartStore(state => state.itemCount);
  const fetchItems = useCartStore(state => state.fetchItems);

  useEffect(() => {
    void fetchItems({ force: true });
  }, [fetchItems, userId]);

  return (
    <BadgeIconButton
      href={`/${locale}/cart`}
      count={itemCount}
      icon={<LuShoppingCart />}
      label={t("cart")}
    />
  );
}
