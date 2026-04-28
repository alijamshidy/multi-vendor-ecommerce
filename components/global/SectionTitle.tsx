import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export default function SectionTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div>
      <h2
        className={cn(
          "text-3xl font-medium tracking-wider capitalize mb-8",
          className
        )}>
        {text}
      </h2>
      <Separator />
    </div>
  );
}
