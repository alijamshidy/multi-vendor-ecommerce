import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type CartItemsSkeletonProps = {
  count?: number;
};

export default function CartItemsSkeleton({ count = 3 }: CartItemsSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <Card
          key={index}
          className="rounded-md">
          <CardContent className="grid gap-4 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
            <Skeleton className="aspect-square w-full rounded-md sm:w-28" />
            <div className="min-w-0 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 sm:justify-self-end" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function OrderSummarySkeleton() {
  return (
    <Card className="rounded-md">
      <CardContent className="space-y-4 p-6">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

export function CartPageSkeleton() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-4">
        <CartItemsSkeleton />
        <Separator />
        <Skeleton className="h-10 w-44 rounded-md" />
      </div>
      <OrderSummarySkeleton />
    </section>
  );
}
