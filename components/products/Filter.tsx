import FilterPanel, {
  type FilterPanelVariant,
} from "@/components/products/FilterPanel";
import Container from "@/components/global/Container";

type FilterSection =
  | "search"
  | "priceRange"
  | "category"
  | "availability"
  | "discount"
  | "createdDate";

export default function Filter({
  variant = "storefront",
  hiddenSections = [],
}: {
  variant?: FilterPanelVariant;
  hiddenSections?: FilterSection[];
}) {
  return (
    <Container className="hidden w-full shrink-0 md:inline-block md:max-w-xs lg:max-w-sm xl:max-w-xs 2xl:max-w-sm">
      <div className="mt-10 rounded-sm border p-4">
        <FilterPanel
          variant={variant}
          hiddenSections={hiddenSections}
        />
      </div>
    </Container>
  );
}
