"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function CarouselSpacing() {
  return (
    <Carousel
      opts={{ align: "center", loop: true }}
      plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}
      className="w-full">
      <CarouselContent className="-ml-1 h-[340px] 2xl:h-[500px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className={`pl-1 h-full basis-11/12`}>
            <div className="p-1 h-full">
              <Card className="h-full">
                <CardContent className="flex h-full  items-center justify-center">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default function Banner() {
  return <CarouselSpacing />;
}
