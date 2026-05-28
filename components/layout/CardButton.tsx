"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import { LuShoppingCart } from "react-icons/lu";
import BadgeIconButton from "../Global/BadgeIconButton";

export default function CardButton() {
  // const numItemsInCart = await fetchCartItems();
  const locale = GetLocale();
  const numItemsInCart = 0;
  return (
    <BadgeIconButton
      href={`/${locale}/cart`}
      count={numItemsInCart}
      icon={<LuShoppingCart />}
      label="Cart"
    />
  );
}
