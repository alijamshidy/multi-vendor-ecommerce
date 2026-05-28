"use client";
import { formatCurrency } from "@/utils/format";
import { GetLocale } from "@/utils/GetUrlParams";
import { productType } from "@/utils/products";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";

export default function ProductList({ product }: { product: productType }) {
  const locale = GetLocale();
  const { label, price, images, category, id } = product;
  const dollarsAmount = formatCurrency(price);
  return (
    <Link href={`/${locale}/products/${id}`}>
      <Card className="transform group-hover:shadow-xl transition-shadow duration-500">
        <CardContent className="grid gap-y-4 p-4 sm:p-6 md:grid-cols-[12rem_1fr_auto] md:items-center">
          <div className="relative h-56 rounded overflow-hidden sm:h-48 md:w-48">
            <Image
              src={images[0].url}
              alt={label}
              fill
              sizes=" (max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw "
              priority
              className="rounded w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl capitalize">{label}</h2>
            <p className="text-muted-foreground">{category}</p>
          </div>
          <p className="text-muted-foreground text-lg md:ml-auto">
            {dollarsAmount}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
