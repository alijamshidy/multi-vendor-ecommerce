import ProductDetailContent from "@/components/pages/ProductDetailContent";
import JsonLd from "@/components/seo/JsonLd";
import { fetchProduct } from "@/lib/server-api";
import { resolveMediaUrl } from "@/lib/api-utils";
import { buildPageMetadata, buildProductJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const product = await fetchProduct(id);

  if (!product) {
    return buildPageMetadata({
      title: t("productNotFoundTitle"),
      description: t("productNotFoundDescription"),
      locale,
      path: `/products/${id}`,
      noIndex: true,
    });
  }

  const primaryImage = product.images?.[0];

  return buildPageMetadata({
    title: t("productTitle", { name: product.name }),
    description: t("productDescription", { name: product.name }),
    locale,
    path: `/products/${product.slug}`,
    image: resolveMediaUrl(primaryImage),
    type: "article",
  });
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const product = await fetchProduct(id);

  return (
    <>
      {product ? (
        <JsonLd data={buildProductJsonLd(product, locale)} />
      ) : null}
      <ProductDetailContent
        locale={locale}
        id={id}
      />
    </>
  );
}
