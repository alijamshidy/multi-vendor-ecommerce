"use client";

import Autoplay from "embla-carousel-autoplay";
import { Link } from "@/i18n/navigation";
import { toNavigationPath } from "@/lib/mappers";
import useContentStore from "@/store/contentStore";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

const FALLBACK_SLIDES = [1, 2, 3, 4];

export default function Banner() {
  const locale = useLocale();
  const t = useTranslations("home");
  const slides = useContentStore(state => state.slides);
  const isLoading = useContentStore(state => state.loading.fetchSliders);

  const autoplayPlugins = useMemo(
    () => [
      Autoplay({
        delay: 3000,
        stopOnMouseEnter: true,
      }),
    ],
    [],
  );

  const useApiSlides = slides.length > 0;

  return (
    <section className="w-full overflow-hidden">
      {isLoading && !useApiSlides ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg sm:aspect-[21/9] md:aspect-[2.4/1] bg-muted animate-pulse" />
      ) : (
        <Carousel
          key={locale}
          className="relative w-full"
          plugins={autoplayPlugins}
          opts={{ loop: true, align: "start" }}>
          <CarouselContent>
            {useApiSlides
              ? slides.map(slide => {
                  const href = toNavigationPath(slide.href, locale);
                  const isExternal = href.startsWith("http");
                  const slideContent = (
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg sm:aspect-[21/9] md:aspect-[2.4/1]">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 1180px"
                        className="object-cover"
                        priority={slides[0]?.id === slide.id}
                      />
                      {slide.text ? (
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 via-background/70 to-transparent px-4 pb-4 pt-10">
                          <p
                            className="text-lg font-semibold sm:text-xl"
                            style={
                              slide.color ? { color: slide.color } : undefined
                            }>
                            {slide.text}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );

                  return (
                    <CarouselItem
                      key={slide.id}
                      className="basis-full">
                      {isExternal ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="block">
                          {slideContent}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="block">
                          {slideContent}
                        </Link>
                      )}
                    </CarouselItem>
                  );
                })
              : FALLBACK_SLIDES.map(img => (
                  <CarouselItem
                    key={img}
                    className="basis-full">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg sm:aspect-[21/9] md:aspect-[2.4/1]">
                      <Image
                        src={`/images/hero${img}.jpg`}
                        alt={t("slideAlt", { n: img })}
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
        </Carousel>
      )}
    </section>
  );
}
