"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { category } from "@/utils/category";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import Container from "../global/Container";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
export function CarouselSpacing() {
  return (
    <Carousel
      opts={{ align: "center", loop: true }}
      plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}>
      <CarouselContent className="-ml-1 h-[180px] 2xl:h-[320px]">
        {category.map(category => {
          return (
            <CarouselItem
              key={category._id}
              className={`pl-1 h-[80%] basis-1/6`}>
              <Link
                href={`/categories/${category.name}`}
                className="p-1 h-full">
                <Card className="h-full">
                  <CardContent className="flex h-full relative items-center justify-center">
                    <Image
                      width={200}
                      height={200}
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full"
                      priority
                    />
                    <span className="text-xl font-semibold absolute bottom-4 bg-gray-400/70 px-1 py-0.5">
                      {category.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default function TopCategory() {
  return (
    <Container className="mt-10 mx-auto w-full max-w-full xl:max-w-full px-0  flex flex-col items-center gap-8">
      <div className="grid items-center justify-center gap-y-2">
        <Label className="text-xl md:text-3xl md:font-bold">Top Category</Label>
        <Separator className="bg-[#059473] data-[orientation=horizontal]:w-[140px] mx-auto" />
      </div>

      <CarouselSpacing />
    </Container>
  );
}
