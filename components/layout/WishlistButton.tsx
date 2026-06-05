"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import { LuHeart } from "react-icons/lu";
import { useTranslations } from "next-intl";
import BadgeIconButton from "../Global/BadgeIconButton";

export default function WishlistButton() {
  // const numItemsInCart = await fetchCartItems();
  const locale = GetLocale();
  const t = useTranslations("nav");
  const numItemsInCart = 0;
  return (
    <BadgeIconButton
      href={`/${locale}/wishlist`}
      count={numItemsInCart}
      icon={<LuHeart />}
      label={t("wishlist")}
    />
  );
}
