import FilterPanel from "@/components/products/FilterPanel";
import Container from "../global/Container";

export default function Filter() {
  return (
    <Container className="hidden w-full shrink-0 md:inline-block md:max-w-xs lg:max-w-sm xl:max-w-xs 2xl:max-w-sm">
      <div className="mt-10 rounded-sm border p-4">
        <FilterPanel />
      </div>
    </Container>
  );
}
