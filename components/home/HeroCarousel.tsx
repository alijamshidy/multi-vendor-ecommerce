import Image from "next/image";

const heroImages = ["/images/hero1.jpg", "/images/hero2.jpg", "/images/hero3.jpg"];

export default function HeroCarousel() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
      {heroImages.map(image => (
        <div
          key={image}
          className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
          <Image
            src={image}
            alt="Featured marketplace product"
            fill
            sizes="(max-width: 1024px) 33vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
