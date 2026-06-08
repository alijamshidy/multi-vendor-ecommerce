"use client";

import { Link } from "@/i18n/navigation";
import { toNavigationPath } from "@/lib/mappers";
import useContentStore from "@/store/contentStore";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function ShopPromo() {
  const locale = useLocale();
  const headers = useContentStore(state => state.headers);

  const header = headers[0];
  if (!header?.text && !header?.imageUrl) return null;

  const content = (
    <>
      {header.imageUrl ? (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-20">
          <Image
            src={header.imageUrl}
            alt={header.text || "Promo"}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : null}
      {header.text ? (
        <p
          className="text-sm font-medium leading-6 sm:text-base"
          style={header.color ? { color: header.color } : undefined}>
          {header.text}
        </p>
      ) : null}
    </>
  );

  if (header.href) {
    const href = toNavigationPath(header.href, locale);
    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center gap-4 rounded-md border bg-muted/40 p-4 transition-colors hover:bg-muted/60">
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className="flex w-full items-center gap-4 rounded-md border bg-muted/40 p-4 transition-colors hover:bg-muted/60">
        {content}
      </Link>
    );
  }

  return (
    <div className="flex w-full items-center gap-4 rounded-md border bg-muted/40 p-4">
      {content}
    </div>
  );
}
