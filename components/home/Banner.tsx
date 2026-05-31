"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useCallback, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function Banner() {
  const images = [1, 2, 3, 4];

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnMouseEnter: true,
    }),
  );

  const handleMouseLeave = useCallback(() => {
    autoplayPlugin.current.play();
  }, []);

  return (
    <section
      className="w-full overflow-hidden"
      onMouseLeave={handleMouseLeave}>
      <Carousel
        className="relative w-full"
        plugins={[autoplayPlugin.current]}
        opts={{ loop: true, align: "start" }}>
        <CarouselContent>
          {images.map(img => (
            <CarouselItem
              key={img}
              className="basis-full">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg sm:aspect-[21/9] md:aspect-[2.4/1]">
                <Image
                  src={`/images/hero${img}.jpg`}
                  alt={`Slide ${img}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1180px"
                  className="object-cover"
                  loading={img === 1 ? "eager" : "lazy"}
                  priority={img === 1}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="start-2 z-10 hidden sm:flex" />
        <CarouselNext className="end-2 z-10 hidden sm:flex" />
      </Carousel>
    </section>
  );
}
