import type { category } from "@/utils/category";

export function sortCategoriesForFilter(items: category[]): category[] {
  return [...items].sort((a, b) => {
    const depthA = a.depth ?? 0;
    const depthB = b.depth ?? 0;
    if (depthA !== depthB) return depthA - depthB;
    return a.label.localeCompare(b.label);
  });
}
