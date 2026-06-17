"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import ReviewCard from "@/components/reviews/ReviewCard";
import { useTranslations } from "next-intl";

const SAMPLE_REVIEWS = [
  { key: "review1" },
  { key: "review2" },
  { key: "review3" },
] as const;

export default function ReviewsPageContent() {
  const t = useTranslations("reviewsPage");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SAMPLE_REVIEWS.map((item, index) => (
          <ReviewCard
            key={item.key}
            reviewInfo={{
              name: t(`${item.key}Name`),
              rating: Number(t(`${item.key}Rating`)),
              comment: t(`${item.key}Comment`),
              image: `/images/hero${index + 1}.jpg`,
            }}
          />
        ))}
      </section>
    </PageShell>
  );
}
