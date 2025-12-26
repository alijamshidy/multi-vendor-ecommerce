// import { formatCurrency } from "@/utils/format";
// import { Product } from "@prisma/client";
import { product } from "@/utils/products";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaHeart } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import ProductRating from "../single-product/ProductRating";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
export default function ProductsGrid({ products }: { products: product[] }) {
  return (
    <div className="pt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-3">
      {products.map(product => {
        const { name, price, images, _id } = product;

        // const dollarsAmount = formatCurrency(price);
        return (
          <article
            key={_id}
            className="group relative">
            <Link
              href={`/products/${_id}`}
              className="absolute inset-0 lg:hidden z-10"
            />

            <Card className="transform group-hover:shadow-xl transition-shadow duration-500 relative">
              <CardContent className="p-4">
                <div className="relative h-64 md:h-48 rounded overflow-hidden group">
                  <Image
                    src={images[0]}
                    alt={name}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    priority
                    className="rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="default"
                      size="icon">
                      <FaHeart />
                    </Button>

                    <Button
                      variant="default"
                      size="icon">
                      <Link href={`/products/${_id}`}>
                        <FaEye />
                      </Link>
                    </Button>

                    <Button
                      variant="default"
                      size="icon">
                      <IoCart />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-lg capitalize">{name}</h2>
                  <p className="text-muted-foreground mt-2">${price}</p>
                  <ProductRating productId="" />
                </div>
              </CardContent>
            </Card>
          </article>
        );
      })}
    </div>
  );
}
