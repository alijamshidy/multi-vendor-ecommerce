"use client";

import SectionTitle from "@/components/Global/SectionTitle";
import ReviewCard from "@/components/reviews/ReviewCard";
import { useStoreInit } from "@/hooks/use-store-init";
import useReviewStore from "@/store/reviewStore";
import { useTranslations } from "next-intl";

export default function ProductReviewsClient({
  productId,
}: {
  productId: string;
}) {
  const t = useTranslations("product");
  const tReviews = useTranslations("reviews");
  const reviews = useReviewStore(state => state.reviews);
  const fetchProductReviews = useReviewStore(state => state.fetchProductReviews);
  const isLoading = useReviewStore(state => state.loading.fetchReviews);

  useStoreInit(() => fetchProductReviews(productId), [productId]);

  return (
    <div>
      <SectionTitle text={t("productReviews")} />
      {isLoading && reviews.length === 0 ? (
        <p className="my-8 text-sm text-muted-foreground">
          {tReviews("loadingReviews")}
        </p>
      ) : reviews.length === 0 ? (
        <p className="my-8 text-sm text-muted-foreground">
          {tReviews("noReviewsYet")}
        </p>
      ) : (
        <div className="my-8 grid gap-8 md:grid-cols-2">
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              reviewInfo={{
                comment: review.comment,
                rating: review.rating,
                image: review.authorImageUrl,
                name: review.authorName,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
