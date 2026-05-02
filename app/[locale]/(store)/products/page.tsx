import Container from "@/components/Global/Container";
import Filter from "@/components/products/Filter";
import ProductsPage from "@/components/products/ProductsPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    layout: string;
  }>;
}) {
  const layout = (await searchParams).layout || "grid";
  return (
    <Container className="mt-36 w-[90%] md:w-auto ml-[2%] min-w-[calc(95%-16rem)] max-w-[95%] mr-[4.5%] flex justify-center items-start">
      <Filter />
      <ProductsPage layout={layout} />
    </Container>
  );
}
