export type CatalogScope = "public" | "customer" | "admin";
export type CatalogType = "categories" | "collections";

export function getCatalogBasePath(
  scope: CatalogScope,
  type: CatalogType,
): string {
  if (scope === "public") return `/${type}`;
  return `/${scope}/${type}`;
}

export function getCatalogDetailPath(
  scope: CatalogScope,
  type: CatalogType,
  slug: string,
): string {
  return `${getCatalogBasePath(scope, type)}/${slug}`;
}

/** Compare route slugs safely (encoded/decoded, Unicode normalization). */
export function normalizeCatalogSlug(value: string): string {
  try {
    return decodeURIComponent(value).normalize("NFC");
  } catch {
    return value.normalize("NFC");
  }
}

export function catalogSlugsMatch(a: string, b: string): boolean {
  return normalizeCatalogSlug(a) === normalizeCatalogSlug(b);
}
