"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Categorys } from "@/utils/Category";
import { GetLocale } from "@/utils/GetUrlParams";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function CategoryCarousel() {
  const locale = GetLocale();

  return (
    <Carousel
      className="w-full"
      plugins={[Autoplay({ delay: 2000 })]}
      opts={{ loop: false, align: "start" }}>
      <CarouselContent>
        {Categorys.map(category => (
          <CarouselItem
            key={category.id}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
            <Link
              href={`/${locale}/${category.href}`}
              className="block h-full">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="relative p-0">
                  <div className="relative aspect-square w-full">
                    <Image
                      fill
                      src={category.image}
                      alt={category.label}
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute inset-x-2 bottom-2 rounded-sm bg-background/80 px-2 py-1 text-center text-sm font-semibold backdrop-blur-sm">
                    {category.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default function TopCategory() {
  return (
    <section className="flex w-full flex-col gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <Label className="text-xl sm:text-2xl md:text-3xl md:font-bold">
          Top Category
        </Label>
        <Separator className="w-24 bg-primary sm:w-32" />
      </div>
      <CategoryCarousel />
    </section>
  );
}
