"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import image1 from "@/public/images/banner/1.jpg";
import image2 from "@/public/images/banner/2.jpg";
import image3 from "@/public/images/banner/3.jpg";
import image4 from "@/public/images/banner/4.jpg";
import image5 from "@/public/images/banner/5.jpg";
import image6 from "@/public/images/banner/6.jpg";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
export function CarouselSpacing() {
  const images = [image1, image2, image3, image4, image5, image6];
  return (
    <Carousel
      opts={{ align: "center", loop: true }}
      plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}
      className="w-full">
      <CarouselContent className="-ml-1 h-[390px] 2xl:h-[500px]">
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className={`pl-1 h-full basis-[96%]`}>
            <div className="p-1 h-full">
              <Card className="h-full">
                <CardContent className="flex h-full  items-center justify-center">
                  <Image
                    src={image}
                    alt=""
                    width={110000}
                    height={100000}
                    className="w-full h-full"
                    priority
                  />
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
