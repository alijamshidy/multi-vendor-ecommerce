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
