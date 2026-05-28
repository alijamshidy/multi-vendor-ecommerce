import { formatCurrency } from "@/utils/format";
import { productType } from "@/utils/products";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import ProductButton from "./ProductButton";

type ProductGridCardProps = {
  product: productType;
  href: string;
};

export default function ProductGridCard({ product, href }: ProductGridCardProps) {
  const { label, price, images, id } = product;
  const dollarsAmount = formatCurrency(price);

  return (
    <article
      key={id}
      className="group relative">
      <Link
        href={href}
        className="absolute inset-0 md:hidden z-10"
      />

      <Card className="transform group-hover:shadow-xl transition-shadow duration-500 relative">
        <CardContent className="p-4">
          <div className="relative h-56 sm:h-48 rounded overflow-hidden group">
            <Image
              src={images[0].url}
              alt={label}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              priority
              className="rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-lg capitalize">{label}</h2>
            <p className="text-muted-foreground mt-2">{dollarsAmount}</p>
          </div>

          <div className="flex -mb-3 mt-3 w-full justify-center gap-x-2">
            <ProductButton type="wishlist" />
            <Link href={href}>
              <ProductButton type="details" />
            </Link>
            <ProductButton type="addToCart" />
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
