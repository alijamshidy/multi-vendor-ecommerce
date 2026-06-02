import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import ReviewCard from "@/components/reviews/ReviewCard";

const reviews = [
  {
    name: "Ali Rezaei",
    rating: 5,
    comment: "Fast delivery and clear seller communication.",
    image: "/images/hero1.jpg",
  },
  {
    name: "Sara Mohammadi",
    rating: 5,
    comment: "Product pages are easy to scan on mobile.",
    image: "/images/hero2.jpg",
  },
  {
    name: "Reza Karimi",
    rating: 4,
    comment: "Checkout flow feels simple and direct.",
    image: "/images/hero3.jpg",
  },
];

export default function ReviewsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Reviews"
        title="Customer feedback"
        description="Social proof and product reviews have a dedicated responsive destination."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map(review => (
          <ReviewCard
            key={review.name}
            reviewInfo={review}
          />
        ))}
      </section>
    </PageShell>
  );
}
