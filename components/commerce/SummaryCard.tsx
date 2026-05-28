import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type SummaryCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
};

export default function SummaryCard({
  label,
  value,
  icon: Icon,
  className,
}: SummaryCardProps) {
  return (
    <Card className={cn("rounded-md", className)}>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
