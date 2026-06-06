"use client";

import { cn } from "@/lib/utils";
import { productType } from "@/utils/products";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProductImageGallery({
  product,
}: {
  product: productType;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = product.images[selectedIndex] ?? product.images[0];
  const hasMultipleImages = product.images.length > 1;

  useEffect(() => {
    setSelectedIndex(0);
  }, [product.id]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Image
          key={selectedImage.id}
          src={selectedImage.url}
          alt={product.label || ""}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {hasMultipleImages ? (
        <ul className="flex flex-wrap gap-2">
          {product.images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`${product.label} ${index + 1}`}
                aria-current={selectedIndex === index ? "true" : undefined}
                className={cn(
                  "relative size-16 overflow-hidden rounded-md border-2 bg-muted transition-colors sm:size-20",
                  selectedIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/30",
                )}>
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
