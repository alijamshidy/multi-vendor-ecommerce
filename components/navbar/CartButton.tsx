"use client";

import { useStoreInitOnce } from "@/hooks/use-store-init";
import useCartStore from "@/store/cartStore";
import { GetLocale } from "@/utils/GetUrlParams";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { Button } from "../ui/button";

export default function CartButton() {
  const locale = GetLocale();
  const itemCount = useCartStore(state => state.itemCount);
  const fetchItems = useCartStore(state => state.fetchItems);

  useStoreInitOnce(() => fetchItems());

  return (
    <Button
      asChild
      variant="link"
      size="icon"
      className="relative flex items-center justify-center rounded-full border text-green-500">
      <Link href={`/${locale}/cart`}>
        <FaShoppingCart />
        <span className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {itemCount}
        </span>
      </Link>
    </Button>
  );
}
