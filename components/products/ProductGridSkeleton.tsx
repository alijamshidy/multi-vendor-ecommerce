import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type ProductGridSkeletonProps = {
  count?: number;
  className?: string;
  compact?: boolean;
  hoverActions?: boolean;
};

function ProductGridCardSkeleton({
  compact = true,
  hoverActions = true,
}: {
  compact?: boolean;
  hoverActions?: boolean;
}) {
  return (
    <article className="mx-1 h-full">
      <Card
        size={compact ? "sm" : "default"}
        className={cn(
          "flex h-full flex-col overflow-hidden",
          compact && "gap-2 py-0",
        )}>
        <CardContent
          className={cn("flex flex-1 flex-col", compact ? "p-3" : "p-4")}>
          <Skeleton className="h-48 w-full rounded" />
          <div
            className={cn(
              "flex flex-1 flex-col text-center",
              compact ? "mt-2" : "mt-4",
            )}>
            <Skeleton
              className={cn("mx-auto w-3/4", compact ? "h-10" : "h-12")}
            />
            <Skeleton className="mx-auto mt-2 h-7 w-1/3" />
          </div>
          {hoverActions ? (
            <div className="mt-3 flex min-h-10 shrink-0 justify-center gap-x-2">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </article>
  );
}

export default function ProductGridSkeleton({
  count = 8,
  className,
  compact = true,
  hoverActions = true,
}: ProductGridSkeletonProps) {
  return (
    <section
      className={cn(
        "grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
        className,
      )}>
      {Array.from({ length: count }, (_, index) => (
        <ProductGridCardSkeleton
          key={index}
          compact={compact}
          hoverActions={hoverActions}
        />
      ))}
    </section>
  );
}
