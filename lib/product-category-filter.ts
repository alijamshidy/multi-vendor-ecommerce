import type { ApiProduct } from "@/lib/api-types";
import type { category } from "@/utils/category";

export function parseCategoryFilterIds(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map(id => id.trim())
    .filter(Boolean);
}

/** Includes selected categories and all of their descendants. */
export function expandCategoryIds(
  selectedIds: string[],
  categories: Pick<category, "id" | "parent">[],
): string[] {
  if (selectedIds.length === 0 || categories.length === 0) {
    return selectedIds;
  }

  const childrenByParent = new Map<string, string[]>();

  for (const item of categories) {
    const parentKey =
      item.parent != null && item.parent !== "" ? String(item.parent) : "";
    const siblings = childrenByParent.get(parentKey) ?? [];
    siblings.push(String(item.id));
    childrenByParent.set(parentKey, siblings);
  }

  const expanded = new Set<string>();

  const visit = (id: string) => {
    if (expanded.has(id)) return;
    expanded.add(id);
    for (const childId of childrenByParent.get(id) ?? []) {
      visit(childId);
    }
  };

  for (const id of selectedIds) {
    visit(String(id));
  }

  return [...expanded];
}

export function productMatchesCategories(
  product: ApiProduct,
  categoryIds: string[],
): boolean {
  if (categoryIds.length === 0) return true;

  return categoryIds.length === 0 || categoryIds.includes(product.category);
}

export function sortCategoriesForFilter(items: category[]): category[] {
  return [...items].sort((a, b) => {
    const depthA = a.depth ?? 0;
    const depthB = b.depth ?? 0;
    if (depthA !== depthB) return depthA - depthB;
    return a.label.localeCompare(b.label);
  });
}
