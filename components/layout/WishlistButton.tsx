"use client";

import BadgeIconButton from "@/components/global/BadgeIconButton";
import useAuthStore from "@/store/authStore";
import useWishlistStore from "@/store/wishlistStore";
import { GetLocale } from "@/utils/GetUrlParams";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { LuHeart } from "react-icons/lu";

export default function WishlistButton() {
  const locale = GetLocale();
  const t = useTranslations("nav");
  const userId = useAuthStore(state => state.user?.id);
  const itemCount = useWishlistStore(state => state.itemCount);
  const fetchItems = useWishlistStore(state => state.fetchItems);

  useEffect(() => {
    void fetchItems({ force: true });
  }, [fetchItems, userId]);

  return (
    <BadgeIconButton
      href={`/${locale}/wishlist`}
      count={itemCount}
      icon={<LuHeart />}
      label={t("wishlist")}
    />
  );
}
