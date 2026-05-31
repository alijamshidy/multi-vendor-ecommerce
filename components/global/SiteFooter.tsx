"use client";

import Container from "@/components/Global/Container";
import { GetLocale } from "@/utils/GetUrlParams";
import Link from "next/link";

const shopLinks = [
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "Orders" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/reviews", label: "Reviews" },
];

export default function SiteFooter() {
  const locale = GetLocale();

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <Container className="py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="text-lg font-semibold">
              Next Storefront
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Multi-vendor marketplace for buyers and sellers with responsive
              shopping flows.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Shop</h3>
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
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
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
            <h3 className="mb-3 text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>+98 918 123 4986</li>
              <li>support@storefront.demo</li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground md:text-start">
          © {new Date().getFullYear()} Next Storefront. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
