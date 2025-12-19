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
import Container from "../global/Container";
import { Label } from "../ui/label";

export function CarouselSpacing() {
  return (
    <Carousel
      opts={{ align: "center", loop: true }}
      plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}
      className="w-full">
      <CarouselContent className="-ml-1 h-[130px] 2xl:h-[320px]">
        {Array.from({ length: 7 }).map((_, index) => (
          <CarouselItem
            key={index}
            className={`pl-1 h-full basis-1/6`}>
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

export default function TopCategory() {
  return (
    <Container className="mt-10 mx-auto w-full max-w-full xl:max-w-full px-0 flex flex-col items-center gap-8">
      <Label>Top Category</Label>
      <CarouselSpacing />
    </Container>
  );
}
