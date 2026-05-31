import { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  text: string;
};

type ProductFeatureListProps = {
  features: Feature[];
};

export default function ProductFeatureList({ features }: ProductFeatureListProps) {
  return (
    <div className="grid gap-3 text-sm text-muted-foreground">
      {features.map(({ icon: Icon, text }) => (
        <p
          key={text}
          className="flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-primary" />
          <span>{text}</span>
        </p>
      ))}
    </div>
  );
}
