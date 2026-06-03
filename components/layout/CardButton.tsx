"use client";

import BadgeIconButton from "@/components/Global/BadgeIconButton";
import { useStoreInit } from "@/hooks/use-store-init";
import useCartStore from "@/store/cartStore";
import { GetLocale } from "@/utils/GetUrlParams";
import { LuShoppingCart } from "react-icons/lu";

export default function CardButton() {
  const locale = GetLocale();
  const itemCount = useCartStore(state => state.itemCount);
  const fetchItems = useCartStore(state => state.fetchItems);

  useStoreInit(() => fetchItems());

  return (
    <BadgeIconButton
      href={`/${locale}/cart`}
      count={itemCount}
      icon={<LuShoppingCart />}
      label="Cart"
    />
  );
}
