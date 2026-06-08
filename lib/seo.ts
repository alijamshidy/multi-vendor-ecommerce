import type { ApiProduct } from "@/lib/api-types";
import { resolveMediaUrl } from "@/lib/api-utils";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export const SITE_NAME = "Next Store";
export const SITE_NAME_FA = "فروشگاه نکست";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_WEBSITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function localePath(locale: string, path = ""): string {
  const normalized = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `/${locale}${normalized}`;
}

export function buildAlternates(
  locale: string,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const siteUrl = getSiteUrl();
  const languages: Record<string, string> = {};

  for (const loc of routing.locales) {
    languages[loc] = `${siteUrl}${localePath(loc, path)}`;
  }

  return {
    canonical: `${siteUrl}${localePath(locale, path)}`,
    languages: {
      ...languages,
      "x-default": `${siteUrl}${localePath(routing.defaultLocale, path)}`,
    },
  };
}

type PageMetadataInput = {
  title: string;
  description: string;
  locale: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${localePath(input.locale, input.path)}`;
  const image = input.image ?? `${siteUrl}/images/hero1.jpg`;
  const siteName = input.locale === "fa" ? SITE_NAME_FA : SITE_NAME;

  return {
    title: input.title,
    description: input.description,
    alternates: buildAlternates(input.locale, input.path),
    robots: input.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: input.type ?? "website",
      locale: input.locale === "fa" ? "fa_IR" : "en_US",
      url,
      title: input.title,
      description: input.description,
      siteName,
      images: [{ url: image, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

export function buildProductJsonLd(
  product: ApiProduct,
  locale: string,
): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const path = `/products/${product.id}`;
  const url = `${siteUrl}${localePath(locale, path)}`;
  const primaryImage =
    product.images?.find(img => img.is_primary)?.image ??
    product.images?.[0]?.image;
  const imageUrl = resolveMediaUrl(primaryImage);
  const price = Number(product.discount_price ?? product.price);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.name,
    image: imageUrl,
    url,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      price: Number.isFinite(price) ? price : product.price,
      availability: product.is_out_of_stock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };
}

export function buildOrganizationJsonLd(
  locale: string,
): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const name = locale === "fa" ? SITE_NAME_FA : SITE_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: `${siteUrl}${localePath(locale)}`,
    logo: `${siteUrl}/favicon.ico`,
  };
}

export function buildWebsiteJsonLd(locale: string): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const name = locale === "fa" ? SITE_NAME_FA : SITE_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: `${siteUrl}${localePath(locale)}`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}${localePath(locale, "/products")}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
