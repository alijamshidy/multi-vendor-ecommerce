import Container from "@/components/Global/Container";
import Filter from "@/components/products/Filter";
import ProductsContainer from "@/components/products/ProductsContainer";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    search: string;
    layout: string;
    range: string;
    category: string;
  }>;
}) {
  const search = (await searchParams).search || "";
  const layout = (await searchParams).layout || "grid";
  const range = (await searchParams).range || "a";
  const category = (await searchParams).category || "b";

  return (
    <Container className="mt-36 w-[80%] md:w-[85%] mx-auto flex gap-x-6">
      <Filter />
      <ProductsContainer
        layout={layout}
        search={search}
      />
    </Container>
  );
}
