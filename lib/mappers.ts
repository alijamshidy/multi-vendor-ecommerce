import type { ApiCartItem, ApiCategory, ApiComment, ApiOrder, ApiProduct } from "@/lib/api-types";
import { resolveMediaUrl } from "@/lib/api-utils";
import type { category } from "@/utils/Category";
import type { productType } from "@/utils/products";

export function mapCategory(item: ApiCategory): category {
  return {
    id: item.id,
    href: item.slug,
    label: item.name,
    image: resolveMediaUrl(item.image),
  };
}

export function mapProduct(item: ApiProduct): productType {
  const images = item.images?.length
    ? item.images.map(image => ({
        id: image.id,
        url: resolveMediaUrl(image.image),
      }))
    : [{ id: item.id, url: "/images/hero1.jpg" }];

  const attribute = item.attribute;
  const description =
    typeof attribute === "string"
      ? attribute
      : attribute && typeof attribute === "object"
        ? Object.entries(attribute)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" · ")
        : "";

  return {
    id: String(item.id),
    href: item.slug,
    label: item.name,
    images,
    price: Number(item.discount_price ?? item.price),
    category: item.categories?.[0]?.name ?? "",
    description,
  };
}

export function mapCartItem(item: ApiCartItem) {
  return {
    id: item.id,
    product: mapProduct(item.product),
    quantity: item.quantity,
  };
}

export function mapOrder(item: ApiOrder) {
  return {
    id: String(item.id).slice(0, 8).toUpperCase(),
    status: item.status,
    total: Number(item.total_discount_price ?? item.total_price),
    items: item.items?.length ?? 0,
  };
}

export function mapComment(item: ApiComment) {
  return {
    id: item.id,
    comment: item.comment,
    rating: item.rating ?? 0,
    authorName: "Customer",
    authorImageUrl: "",
  };
}
