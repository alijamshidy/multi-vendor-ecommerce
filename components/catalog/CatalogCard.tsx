"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

type CatalogCardItem = {
  id: string;
  href: string;
  label: string;
  image: string;
  description?: string;
};

type CatalogCardProps = {
  item: CatalogCardItem;
  detailPath: string;
  showMeta?: boolean;
};

export default function CatalogCard({
  item,
  detailPath,
  showMeta = false,
}: CatalogCardProps) {
  return (
    <Link
      href={detailPath}
      className="block h-full">
      <Card
        size="sm"
        className={cn(
          "h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md",
        )}>
        <CardContent className="relative p-0">
          <div className="relative h-32 w-full sm:h-36">
            <Image
              fill
              src={item.image}
              alt={item.label}
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 via-background/80 to-transparent px-3 pb-2 pt-8">
              <span className="block truncate text-center text-sm font-semibold">
                {item.label}
              </span>
              {showMeta ? (
                <span className="mt-1 block truncate text-center text-xs text-muted-foreground">
                  {item.href}
                </span>
              ) : null}
            </div>
          </div>
          {item.description ? (
            <p className="line-clamp-2 px-3 py-2 text-xs text-muted-foreground">
              {item.description}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
