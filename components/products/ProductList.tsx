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
        <CardContent className="p-8 gap-y-4 grid md:grid-cols-3">
          <div className="relative h-64 md:h-48 md:w-48 rounded overflow-hidden">
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
