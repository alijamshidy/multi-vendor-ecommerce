import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <>
      <Card className="rounded-md">
        <CardContent className="grid gap-8 p-4 md:grid-cols-2 md:p-8">
          <div className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-md" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="size-16 rounded-md sm:size-20"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-4/5" />
              <Skeleton className="h-9 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3">
                    <Skeleton className="size-5 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Skeleton className="h-12 flex-1 rounded-md sm:min-w-40" />
              <Skeleton className="h-12 flex-1 rounded-md sm:min-w-40" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
      </Card>

      <section className="mt-12 space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton
                key={index}
                className="h-24 w-full rounded-md"
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-7 w-44" />
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    </>
  );
}
