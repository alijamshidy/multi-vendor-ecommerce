import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function EmptyList({
  heading,
  className,
}: {
  heading?: string;
  className?: string;
}) {
  const t = await getTranslations("common");

  return (
    <h2 className={cn("text-xl", className)}>{heading ?? t("noItemsFound")}</h2>
  );
}
