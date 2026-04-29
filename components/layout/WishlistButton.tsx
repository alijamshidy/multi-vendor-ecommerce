"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import Link from "next/link";
import { LuHeart } from "react-icons/lu";
import { Button } from "../ui/button";

export default function WishlistButton() {
  // const numItemsInCart = await fetchCartItems();
  const locale = GetLocale();
  const numItemsInCart = 0;
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className="flex justify-center items-center relative">
      <Link
        className="w-full h-full justify-center items-center flex"
        href={`/${locale}/wishlist`}>
        <LuHeart />
        <span className="absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
          {numItemsInCart}
        </span>
      </Link>
    </Button>
  );
}
