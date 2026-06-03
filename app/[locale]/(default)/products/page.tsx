import ProductsPageContent from "@/components/pages/ProductsPageContent";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    layout: string;
  }>;
}) {
  const layout = (await searchParams).layout || "grid";

  return <ProductsPageContent layout={layout} />;
}
