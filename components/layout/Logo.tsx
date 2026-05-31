"use client";

import { GetLocale } from "@/utils/GetUrlParams";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  const locale = GetLocale();

  return (
    <div className="h-[50px] w-[50px]">
      <Link
        href={`/${locale}`}
        className="relative block h-full w-full">
        <Image
          src="/images/hero1.jpg"
          alt="Next Storefront"
          width={50}
          height={50}
          className="h-full rounded-full object-cover"
          loading="eager"
        />
      </Link>
    </div>
  );
}
