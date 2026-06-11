import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SummaryCardsSkeletonProps = {
  count?: number;
  className?: string;
};

export default function SummaryCardsSkeleton({
  count = 4,
  className,
}: SummaryCardsSkeletonProps) {
  return (
    <section
      className={
        className ??
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      }>
      {Array.from({ length: count }, (_, index) => (
        <Card
          key={index}
          className="rounded-md">
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="size-11 shrink-0 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
