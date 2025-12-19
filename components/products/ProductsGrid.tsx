// import { formatCurrency } from "@/utils/format";
// import { Product } from "@prisma/client";
import { product } from "@/utils/products";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import FavoriteToggleButton from "./FavoriteToggleButton";
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
            <Link href={`/products/${_id}`}>
              <Card className="transform group-hover:shadow-xl transition-shadow duration-500">
                <CardContent className="p-4">
                  <div className="relative h-64 md:h-48 rounded overflow-hidden">
                    <Image
                      src={images[0]}
                      alt={name}
                      fill
                      sizes=" (max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw "
                      priority
                      className="rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-lg capitalize">{name}</h2>
                    <p className="text-muted-foreground mt-2">{price}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <div className="absolute top-7 right-7 z-5">
              <FavoriteToggleButton productId={_id} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
