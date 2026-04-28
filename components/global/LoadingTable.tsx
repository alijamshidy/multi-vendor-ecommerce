import { Skeleton } from "../ui/skeleton";
export default function LoadingTable({ rows }: { rows?: number }) {
  const n = typeof rows === "number" && rows > 0 ? rows : 3;
  const tableRows = Array.from({ length: n }, (_, index) => {
    return (
      <div
        className="mb-4"
        key={index}>
        <Skeleton className="w-full h-8 rounded" />
      </div>
    );
  });
  return <>{tableRows}</>;
}
