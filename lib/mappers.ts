import type {
  ApiCartItem,
  ApiCategory,
  ApiCollection,
  ApiComment,
  ApiContentImage,
  ApiOrder,
  ApiProduct,
  ApiShopContact,
  ApiShopFaq,
  ApiShopHeader,
  ApiShopRecommendation,
  ApiShopSlider,
} from "@/lib/api-types";
import { resolveMediaUrl, unwrapEntity } from "@/lib/api-utils";
import type { category } from "@/utils/Category";
import type { collection } from "@/utils/Collection";
import type { productType } from "@/utils/products";

export function mapCategory(item: ApiCategory): category {
  return {
    id: String(item.id),
    href: item.slug,
    label: item.name,
    image: resolveMediaUrl(item.image),
  };
}

export function mapCollection(item: ApiCollection): collection {
  return {
    id: String(item.id),
    href: item.slug,
    label: item.name,
    image: resolveMediaUrl(item.image),
    description: item.description,
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
    isOutOfStock: Boolean(item.is_out_of_stock),
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

export function mapComment(item: ApiComment): ReviewView {
  return {
    id: String(item.id),
    comment: item.text ?? item.comment ?? "",
    rating: item.rating ?? 0,
    authorName: "Customer",
    authorImageUrl: "",
    userId: item.user?.id ?? null,
    replies: (item.replys ?? []).map(mapComment),
    createdAt: item.created_at,
  };
}

export type FaqView = {
  id: string;
  question: string;
  answer: string;
};

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

function mapContentImageUrl(image?: ApiContentImage | Record<string, unknown> | string | null) {
  if (!image) return "/images/hero1.jpg";
  if (typeof image === "string") return resolveMediaUrl(image);
  if (typeof image.image === "string") return resolveMediaUrl(image.image);
  return "/images/hero1.jpg";
}

export function resolveShopLink(link: string | null | undefined, locale: string) {
  if (!link) return `/${locale}`;
  if (link.startsWith("http")) return link;
  const normalized = link.startsWith("/") ? link : `/${link}`;
  if (normalized.startsWith(`/${locale}/`) || normalized === `/${locale}`) {
    return normalized.replace(/\/+$/, "") || `/${locale}`;
  }
  return `/${locale}${normalized}`.replace(/\/+$/, "") || `/${locale}`;
}

/** Converts API links for next-intl `Link` (paths without locale prefix). */
export function toNavigationPath(href: string, locale: string): string {
  if (href.startsWith("http")) return href;
  if (href.startsWith(`/${locale}/`)) {
    return href.slice(locale.length + 1) || "/";
  }
  if (href === `/${locale}`) return "/";
  return href.startsWith("/") ? href : `/${href}`;
}

export function mapFaq(item: ApiShopFaq): FaqView {
  return {
    id: String(item.id),
    question: item.question,
    answer: item.answer,
  };
}

export function mapSliderSlides(items: ApiShopSlider[], locale: string): SlideView[] {
  const slides: SlideView[] = [];

  for (const slider of items) {
    for (const image of slider.images ?? []) {
      slides.push({
        id: String(image.id ?? `${slider.id}-${slides.length}`),
        imageUrl: mapContentImageUrl(image),
        alt: image.text ?? slider.text ?? "Slide",
        href: resolveShopLink(image.related_link, locale),
        text: slider.text ?? image.text ?? undefined,
        color: slider.color ?? image.color ?? undefined,
      });
    }
  }

  return slides;
}

export function mapHeader(item: ApiShopHeader, locale: string): HeaderView {
  return {
    id: String(item.id),
    text: item.text ?? "",
    color: item.color ?? undefined,
    imageUrl: item.image ? mapContentImageUrl(item.image) : undefined,
    href: item.image?.related_link
      ? resolveShopLink(item.image.related_link, locale)
      : undefined,
  };
}

export function mapContact(data: unknown): ContactView {
  const channel =
    unwrapEntity<ApiShopContact>(data) ??
    unwrapEntity<ApiShopContact>(unwrapEntity<Record<string, unknown>>(data));

  if (!channel) {
    return { phones: [] };
  }

  const phones = [channel.contact_number, channel.contact_number_2].filter(
    (value): value is string => Boolean(value),
  );

  return {
    instagram: channel.instagram_channel ?? undefined,
    telegram: channel.telegram_channel ?? undefined,
    phones,
  };
}

export function mapRecommendation(
  item: ApiShopRecommendation,
  locale: string,
): RecommendationView {
  const image = item.image;
  const href = resolveShopLink(
    item.related_link ??
      (typeof image === "object" && image && "related_link" in image
        ? (image.related_link as string | null)
        : null),
    locale,
  );

  return {
    id: String(item.id ?? href),
    imageUrl: mapContentImageUrl(image),
    href,
    text: item.text ?? undefined,
    color: item.color ?? undefined,
  };
}
