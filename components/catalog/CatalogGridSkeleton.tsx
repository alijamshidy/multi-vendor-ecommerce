import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type CatalogGridSkeletonProps = {
  count?: number;
};

export default function CatalogGridSkeleton({
  count = 10,
}: CatalogGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }, (_, index) => (
        <Card
          key={index}
          size="sm"
          className="h-full gap-0 overflow-hidden py-0">
          <CardContent className="p-0">
            <Skeleton className="h-32 w-full rounded-none sm:h-36" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
