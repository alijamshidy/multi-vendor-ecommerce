import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ContentListSkeletonProps = {
  count?: number;
  withImage?: boolean;
};

export default function ContentListSkeleton({
  count = 3,
  withImage = true,
}: ContentListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <Card
          key={index}
          className="rounded-lg">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
            {withImage ? (
              <Skeleton className="size-20 shrink-0 rounded-md sm:size-24" />
            ) : null}
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex shrink-0 gap-2 sm:flex-col">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
