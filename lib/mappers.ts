import type {
  ApiCartItem,
  ApiCartListResponse,
  ApiCategory,
  ApiOrder,
  ApiProduct,
  ApiReview,
  ApiWishlistItem,
  ApiWishlistResponse,
} from "@/lib/api-types";
import { resolveMediaUrl } from "@/lib/api-utils";
import type { category } from "@/utils/category";
import type { productType } from "@/utils/products";

export function mapCategory(item: ApiCategory): category {
  return {
    id: item._id,
    href: item.slug,
    label: item.name,
    image: resolveMediaUrl(item.image),
    parent: null,
    depth: 0,
  };
}

export function mapProduct(item: ApiProduct): productType {
  const discountPercent = item.discount ?? 0;
  const originalPrice = item.price;
  const salePrice =
    discountPercent > 0
      ? Math.round(originalPrice * (1 - discountPercent / 100))
      : originalPrice;

  const images = item.images?.length
    ? item.images.map((url, index) => ({
        id: `${item._id}-${index}`,
        url: resolveMediaUrl(url),
      }))
    : [{ id: item._id, url: "/images/hero1.jpg" }];

  return {
    id: item._id,
    href: item.slug,
    label: item.name,
    images,
    price: salePrice,
    originalPrice,
    category: item.category ?? "",
    description: item.description?.trim() ?? "",
    sellerId: item.sellerId,
    shopName: item.shopName,
    isOutOfStock: (item.stock ?? 0) <= 0,
    stock: item.stock,
  };
}

export type WishlistItemView = ReturnType<typeof mapWishlistItem>;

export function buildWishlistPayload(product: productType) {
  return {
    productId: product.id,
    name: product.label,
    price: product.originalPrice,
    image: product.images[0]?.url ?? "",
    discount:
      product.originalPrice > product.price
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100,
          )
        : 0,
    rating: 0,
    slug: product.href,
  };
}

export function mapWishlistItem(item: ApiWishlistItem) {
  const discountPercent = item.discount ?? 0;
  const originalPrice = item.price ?? 0;
  const salePrice =
    discountPercent > 0
      ? Math.round(originalPrice * (1 - discountPercent / 100))
      : originalPrice;

  const imageUrl = resolveMediaUrl(item.image);

  return {
    wishlistId: item._id,
    id: item.productId ?? item._id,
    href: item.slug ?? item.productId ?? item._id,
    label: item.name ?? "Product",
    images: [
      {
        id: item._id,
        url: imageUrl || "/images/hero1.jpg",
      },
    ],
    price: salePrice,
    originalPrice,
    category: "",
    description: "",
  };
}

export function parseWishlistResponse(data: ApiWishlistResponse): {
  items: ApiWishlistItem[];
  count: number;
} {
  const items = data.wishlists ?? data.wishlist_products ?? [];
  const count = data.wishlistCount ?? data.wishlist_count ?? items.length;
  return { items, count };
}

export function mapCartItem(item: ApiCartItem) {
  const apiProduct = item.product ?? item.productInfo;
  const product = apiProduct
    ? mapProduct(apiProduct)
    : {
        id: item.productId ?? item._id,
        href: item.productId ?? item._id,
        label: "Product",
        images: [{ id: item._id, url: "/images/hero1.jpg" }],
        price: 0,
        originalPrice: 0,
        category: "",
        description: "",
      };

  return {
    id: item._id,
    product,
    quantity: item.quantity ?? 1,
  };
}

export function flattenCartResponse(data: ApiCartListResponse): ApiCartItem[] {
  if (data.cardProducts?.length) return data.cardProducts;

  const items: ApiCartItem[] = [];
  for (const group of data.card_products ?? []) {
    for (const line of group.products ?? []) {
      items.push({
        _id: line._id,
        quantity: line.quantity,
        productId: line.productInfo?._id,
        product: line.productInfo,
      });
    }
  }
  return items;
}

export function mapOrder(item: ApiOrder) {
  const status =
    item.status ??
    (item as { delivery_status?: string }).delivery_status ??
    "pending";

  return {
    id: String(item._id).slice(0, 8).toUpperCase(),
    fullId: String(item._id),
    status,
    total: Number(item.price ?? 0),
    items: item.products?.length ?? 0,
    createdAt: item.createdAt,
    shippingFee: Number(item.shipping_fee ?? 0),
    shippingInfo: item.shippingInfo ?? null,
    products: item.products ?? [],
  };
}

export function unwrapOrderResponse(data: unknown): ApiOrder | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record.order && typeof record.order === "object") {
    return record.order as ApiOrder;
  }
  if (record._id) {
    return record as ApiOrder;
  }
  return null;
}

export type ManagementOrderView = ReturnType<typeof mapOrder> & {
  statusLabel: string;
  itemsCount: number;
};

export function mapManagementOrder(item: ApiOrder): ManagementOrderView {
  const mapped = mapOrder(item);
  return {
    ...mapped,
    statusLabel: mapped.status,
    itemsCount: mapped.items,
  };
}

export type ReviewView = {
  id: string;
  comment: string;
  rating: number;
  authorName: string;
  authorImageUrl: string;
  userId: string | null;
  replies: ReviewView[];
  createdAt?: string;
};

export function mapComment(item: ApiReview): ReviewView {
  return {
    id: String(item._id ?? ""),
    comment: item.review ?? "",
    rating: item.rating ?? 0,
    authorName: item.name ?? "Customer",
    authorImageUrl: "",
    userId: null,
    replies: [],
    createdAt: item.createdAt,
  };
}

export type SaleReviewView = {
  id: string;
  name: string;
  price: number;
  numOrders: number;
  totalSale: number;
  imageUrl: string;
};

export function mapSaleReview(item: Record<string, unknown>): SaleReviewView {
  return {
    id: String(item._id ?? item.id ?? ""),
    name: String(item.name ?? ""),
    price: Number(item.price ?? 0),
    numOrders: Number(item.numOrders ?? 0),
    totalSale: Number(item.totalSale ?? 0),
    imageUrl: "/images/hero1.jpg",
  };
}

export type FaqView = { id: string; question: string; answer: string };
export type SlideView = {
  id: string;
  imageUrl: string;
  alt: string;
  href: string;
  text?: string;
  color?: string;
};
export type HeaderView = {
  id: string;
  text: string;
  color?: string;
  imageUrl?: string;
  href?: string;
};
export type ContactView = {
  instagram?: string;
  telegram?: string;
  phones: string[];
};
export type RecommendationView = {
  id: string;
  imageUrl: string;
  href: string;
  text?: string;
  color?: string;
};

export function resolveShopLink(
  link: string | null | undefined,
  locale: string,
) {
  if (!link) return `/${locale}`;
  if (link.startsWith("http")) return link;
  const normalized = link.startsWith("/") ? link : `/${link}`;
  if (normalized.startsWith(`/${locale}/`) || normalized === `/${locale}`) {
    return normalized.replace(/\/+$/, "") || `/${locale}`;
  }
  return `/${locale}${normalized}`.replace(/\/+$/, "") || `/${locale}`;
}

export function toNavigationPath(href: string, locale: string): string {
  if (href.startsWith("http")) return href;
  if (href.startsWith(`/${locale}/`)) {
    return href.slice(locale.length + 1) || "/";
  }
  if (href === `/${locale}`) return "/";
  return href.startsWith("/") ? href : `/${href}`;
}

export function buildProductDetailHref(
  locale: string,
  product: { href: string },
): string {
  return `/${locale}/products/${encodeURIComponent(product.href)}`;
}

/** @deprecated CMS not available — returns empty defaults */
export function mapFaq(item: {
  id: string;
  question: string;
  answer: string;
}): FaqView {
  return { id: String(item.id), question: item.question, answer: item.answer };
}

export function mapSliderSlides(
  _items: unknown[],
  locale: string,
): SlideView[] {
  return [
    {
      id: "default-1",
      imageUrl: "/images/hero1.jpg",
      alt: "Banner",
      href: `/${locale}/products`,
    },
  ];
}

export function mapHeader(_item: unknown, _locale: string): HeaderView {
  return { id: "default", text: "" };
}

export function mapContact(_data: unknown): ContactView {
  return { phones: [] };
}

export function mapRecommendation(
  _item: unknown,
  locale: string,
): RecommendationView {
  return {
    id: "default",
    imageUrl: "/images/hero2.jpg",
    href: `/${locale}/products`,
  };
}

/** @deprecated Collections not available */
export function mapCollection(item: {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string;
}) {
  return {
    id: String(item.id),
    href: item.slug,
    label: item.name,
    image: resolveMediaUrl(item.image),
    description: item.description,
  };
}
