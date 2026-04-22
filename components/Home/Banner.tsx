// "use client";

// import Autoplay from "embla-carousel-autoplay";
// import Image from "next/image";
// import { useRef } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "../ui/carousel";

// export default function Banner() {
//   const images = [1, 2, 3, 4];
//   const autoplayRef = useRef(
//     Autoplay({ delay: 3000, stopOnInteraction: false }),
//   );

//   return (
//     <Carousel
//       className="w-[80%] md:w-[85%] mx-auto h-[500px] flex"
//       plugins={[autoplayRef.current]}
//       opts={{
//         loop: true, // حلقه بی‌نهایت
//       }}>
//       <CarouselPrevious className="z-10" />
//       <CarouselContent className="h-full">
//         {images.map(img => (
//           <CarouselItem
//             key={img}
//             className="basis-11/12 h-full">
//             <Image
//               src={`./images/hero${img}.jpg`}
//               alt={`Slide ${img}`}
//               className="w-full h-full object-cover rounded-lg"
//               width={50}
//               height={50}
//               loading="eager"
//               priority={img === 1}
//             />
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselNext className="z-10" />
//     </Carousel>
//   );
// }

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
        className="w-[80%] md:w-[85%] mx-auto h-[500px] flex"
        plugins={[autoplayPlugin.current]}
        opts={{ loop: true }}>
        <CarouselPrevious className="z-10" />
        <CarouselContent className="h-full">
          {images.map(img => (
            <CarouselItem
              key={img}
              className="basis-11/12 h-full">
              <Image
                src={`./images/hero${img}.jpg`}
                alt={`Slide ${img}`}
                className="w-full h-full object-cover rounded-lg"
                width={100}
                height={100}
                loading="eager"
                priority={img === 1}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="z-10" />
      </Carousel>
    </div>
  );
}
