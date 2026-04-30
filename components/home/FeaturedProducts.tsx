"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../Global/Container";
import ProductButton from "../products/ProductButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(product => (
          <div
            key={product}
            className="group">
            <Card className="w-full hover:-translate-y-3 duration-300 transition-all relative overflow-hidden">
              <CardHeader className="p-3">
                <Image
                  src={"/images/hero1.jpg"}
                  alt=""
                  width={200}
                  height={150}
                  className="object-cover transition-transform duration-300 group-hover:scale-110 rounded-md w-[95%] m-auto"
                  loading={"eager"}
                />
              </CardHeader>

              <CardContent className="p-4 relative h-[100px]">
                <CardTitle className="mb-2">{product}</CardTitle>
                <CardDescription>the best</CardDescription>

                <div
                  className="absolute bottom-0 left-0 right-0 flex justify-center gap-x-2 
                  translate-y-full opacity-0 
                  group-hover:translate-y-1 group-hover:opacity-100 
                  transition-all duration-300 ease-out">
                  <Link href={`${path}/${product}`}>
                    <ProductButton type={"details"} />
                  </Link>
                  <ProductButton type={"addToCard"} />
                  <ProductButton type={"addToWhishlist"} />
                </div>
              </CardContent>
            </Card>
          </div>
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
