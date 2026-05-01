import { formatCurrency } from "@/utils/format";
import { productType } from "@/utils/products";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import ProductButton from "./ProductButton";
export default function ProductsGrid({
  products,
  open,
}: {
  products: productType[];
  open: boolean;
}) {
  return (
    <div
      className={`pt-12 grid gap-4 ${open ? "md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"}`}>
      {products.map(product => {
        const { label, price, images, id } = product;

        const dollarsAmount = formatCurrency(price);
        return (
          <article
            key={id}
            className="group relative">
            <Link
              href={`/products/${id}`}
              className="absolute inset-0 md:hidden z-10"
            />

            <Card className="transform group-hover:shadow-xl transition-shadow duration-500 relative">
              <CardContent className="p-4">
                <div className="relative h-64 md:h-48 rounded overflow-hidden group">
                  <Image
                    src={images[0].url}
                    alt={label}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    priority
                    className="rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-lg capitalize">{label}</h2>
                  <p className="text-muted-foreground mt-2">{dollarsAmount}</p>
                  {/* <ProductRating productId="" /> */}
                </div>

                <div className="flex -mb-3 mt-3 w-full justify-center gap-x-2">
                  <ProductButton type="wishlist" />
                  <Link href={product.href}>
                    <ProductButton type="details" />
                  </Link>
                  <ProductButton type="addToCard" />
                </div>
              </CardContent>
            </Card>
          </article>
        );
      })}
    </div>
  );
}
