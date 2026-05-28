"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import { LuHeart } from "react-icons/lu";
import BadgeIconButton from "../Global/BadgeIconButton";

export default function WishlistButton() {
  // const numItemsInCart = await fetchCartItems();
  const locale = GetLocale();
  const numItemsInCart = 0;
  return (
    <BadgeIconButton
      href={`/${locale}/wishlist`}
      count={numItemsInCart}
      icon={<LuHeart />}
      label="Wishlist"
    />
  );
}
