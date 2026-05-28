"use client";

import { Products } from "@/utils/products";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../Global/Container";
import ProductGridCard from "../products/ProductGridCard";
import { Label } from "../ui/label";
import { useSidebar } from "../ui/sidebar";

export default function FeaturedProducts() {
  const path = usePathname();
  const { open } = useSidebar();
  return (
    <>
      <Label className={`text-2xl  ${open ? "-ml-[2.8%]" : "-ml-[2%]"}`}>
        Featured Products
      </Label>
      <Container
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 pb-5 ${open ? "ml-[1%] md:w-full mr-[4%]" : "ml-[2%] md:w-full mr-[4%]"}`}>
        {Products.slice(0, 8).map(product => (
          <ProductGridCard
            key={product.id}
            product={product}
            href={`${path}/products/${product.id}`}
          />
        ))}
      </Container>
      <Link
        href={`${path}/products`}
        className="text-xl font-bold flex items-end text-blue-600/95 hover:scale-110 transition-transform duration-300">
        More Products ...
      </Link>
    </>
  );
}
