"use client";

import Container from "@/components/Global/Container";
import { GetLocale } from "@/utils/GetUrlParams";
import { visitorLinks } from "@/utils/links";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function CustomerLinks() {
  const t = useTranslations("nav");
  const locale = GetLocale();
  const path = usePathname();

  return (
    <Container className="hidden gap-x-6 md:flex">
      {visitorLinks.map(link => {
        const href = `/${locale}${link.href === "/" ? "" : link.href}`;
        return (
          <Link
            className={`font-semibold ${
              path === href ? "text-[#059473]" : "text-slate-600"
            }`}
            href={href}
            key={link.href}>
            {t(link.labelKey).toUpperCase()}
          </Link>
        );
      })}
    </Container>
  );
}
