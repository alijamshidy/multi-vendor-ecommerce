"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import { useTranslations } from "next-intl";
import { LuHeart } from "react-icons/lu";
import BadgeIconButton from "../global/BadgeIconButton";

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
