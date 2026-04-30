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
import { useSidebar } from "../ui/sidebar";

export default function Banner() {
  const { open } = useSidebar();
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
        className={`mx-auto w-[95%] h-[400px] md:h-[500px] flex ${open ? "md:ml-[4%] w-auto md:mr-[6%]" : "md:ml-[5%]  md:mr-[7%] md:w-auto"}`}
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
