"use client";

import Container from "@/components/Global/Container";
import { useStoreInitOnce } from "@/hooks/use-store-init";
import useContentStore from "@/store/contentStore";
import { cn } from "@/lib/utils";
import { GetLocale } from "@/utils/GetUrlParams";
import Link from "next/link";
import { useTranslations } from "next-intl";

const FALLBACK_PHONES = ["+98 918 123 4986"];

export default function SiteFooter({ className }: { className?: string }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = GetLocale();
  const contact = useContentStore(state => state.contact);
  const fetchContact = useContentStore(state => state.fetchContact);

  useStoreInitOnce(() => fetchContact(), [fetchContact]);

  const phones =
    contact.phones.length > 0 ? contact.phones : FALLBACK_PHONES;

  const shopLinks = [
    { href: "/products", label: tNav("products") },
    { href: "/cart", label: tNav("cart") },
    { href: "/wishlist", label: tNav("wishlist") },
    { href: "/orders", label: tNav("orders") },
  ];

  const companyLinks = [
    { href: "/contact", label: tNav("contact") },
    { href: "/reviews", label: tNav("reviews") },
  ];

  return (
    <footer className={cn("mt-auto border-t bg-muted/30", className)}>
      <Container className="py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="text-lg font-semibold">
              {t("brand")}
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("shop")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("company")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("support")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {phones.map(phone => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    dir="ltr"
                    className="hover:text-primary">
                    {phone}
                  </a>
                </li>
              ))}
              {contact.instagram ? (
                <li>
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary">
                    Instagram
                  </a>
                </li>
              ) : null}
              {contact.telegram ? (
                <li>
                  <a
                    href={contact.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary">
                    Telegram
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground md:text-start">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </Container>
    </footer>
  );
}
