import { routing } from "@/i18n/routing";
import {
  fetchCategoriesForSitemap,
  fetchProductsForSitemap,
} from "@/lib/server-api";
import { getSiteUrl, localePath } from "@/lib/seo";
import type { MetadataRoute } from "next";

const STATIC_PATHS = [
  "",
  "/products",
  "/contact",
  "/reviews",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}${localePath(locale, path)}`,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  try {
    const [products, categories] = await Promise.all([
      fetchProductsForSitemap(),
      fetchCategoriesForSitemap(),
    ]);

    for (const locale of routing.locales) {
      for (const product of products) {
        entries.push({
          url: `${siteUrl}${localePath(locale, `/products/${product.id}`)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      for (const category of categories) {
        entries.push({
          url: `${siteUrl}${localePath(locale, `/${category.slug}`)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Sitemap still works with static routes when API is offline.
  }

  return entries;
}
