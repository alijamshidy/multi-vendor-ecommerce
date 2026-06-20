"use client";

import SectionTitle from "@/components/global/SectionTitle";
import ReviewItem from "@/components/reviews/ReviewItem";
import { useStoreInit } from "@/hooks/use-store-init";
import useReviewStore from "@/store/reviewStore";
import { useTranslations } from "next-intl";

export default function ProductReviewsClient({
  productId,
  embedded = false,
}: {
  productId: string;
  embedded?: boolean;
}) {
  const t = useTranslations("product");
  const tReviews = useTranslations("reviews");
  const reviews = useReviewStore(state => state.reviews);
  const fetchProductReviews = useReviewStore(
    state => state.fetchProductReviews,
  );
  const isLoading = useReviewStore(state => state.loading.fetchReviews);

  useStoreInit(() => fetchProductReviews(productId), [productId]);

  return (
    <div>
      {!embedded ? <SectionTitle text={t("productReviews")} /> : null}
      {isLoading && reviews.length === 0 ? (
        <p
          className={
            embedded
              ? "text-sm text-muted-foreground"
              : "my-8 text-sm text-muted-foreground"
          }>
          {tReviews("loadingReviews")}
        </p>
      ) : reviews.length === 0 ? (
        <p
          className={
            embedded
              ? "text-sm text-muted-foreground"
              : "my-8 text-sm text-muted-foreground"
          }>
          {tReviews("noReviewsYet")}
        </p>
      ) : (
        <div
          className={
            embedded ? "grid gap-6 md:grid-cols-2" : "my-8 grid gap-8 md:grid-cols-2"
          }>
          {reviews.map(review => (
            <ReviewItem
              key={review.id}
              review={review}
              productId={productId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
