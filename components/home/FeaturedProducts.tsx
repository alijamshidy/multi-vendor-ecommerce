"use client";

import { Products } from "@/utils/products";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductGrid from "../products/ProductGrid";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export default function FeaturedProducts() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return (
    <section className="flex w-full flex-col gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <Label className="text-xl sm:text-2xl md:text-3xl md:font-bold">
          Featured Products
        </Label>
        <Separator className="w-24 bg-primary sm:w-32" />
      </div>
      <ProductGrid
        products={Products.slice(0, 8)}
        locale={locale}
      />
      <Link
        href={`/${locale}/products`}
        className="inline-flex text-lg font-bold text-primary transition-transform -translate-x-6 hover:translate-x-7 duration-300 hover:scale-105 sm:text-xl">
        More Products ...
      </Link>
    </section>
  );
}
