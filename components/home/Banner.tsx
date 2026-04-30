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
      stopOnMouseEnter: true, // توقف با ورود ماوس
    }),
  );

  // ادامه چرخش بعد از خروج ماوس
  const handleMouseLeave = useCallback(() => {
    autoplayPlugin.current.play();
  }, []);

  return (
    <div onMouseLeave={handleMouseLeave}>
      <Carousel
        className="w-[95%] md:w-[85%] mx-auto h-[400px] md:h-[500px] flex"
        plugins={[autoplayPlugin.current]}
        opts={{ loop: true }}>
        <CarouselPrevious className="z-10 hidden md:flex" />
        <CarouselContent className="h-full w-full -ml-2">
          {images.map(img => (
            <CarouselItem
              key={img}
              className="md:basis-11/12 basis-5/6 h-full">
              <Image
                src={`/images/hero${img}.jpg`}
                alt={`Slide ${img}`}
                className="w-full h-full object-cover rounded-lg"
                width={100000}
                height={100000}
                loading="eager"
                priority={img === 1}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="z-10 hidden md:flex" />
      </Carousel>
    </div>
  );
}
