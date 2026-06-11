import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type BorderedListSkeletonProps = {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
};

export default function BorderedListSkeleton({
  count = 5,
  columns = 3,
  className,
}: BorderedListSkeletonProps) {
  const gridClass =
    columns === 4
      ? "sm:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-3";

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={cn("grid gap-3 rounded-md border p-3 sm:items-center", gridClass)}>
          <Skeleton className="h-5 w-24" />
          {columns >= 3 ? <Skeleton className="h-4 w-20" /> : null}
          {columns >= 4 ? <Skeleton className="h-5 w-16" /> : null}
          <Skeleton className="h-5 w-20 sm:justify-self-end" />
        </div>
      ))}
    </div>
  );
}
