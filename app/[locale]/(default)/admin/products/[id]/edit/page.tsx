import EditProductForm from "@/components/admin/EditProductForm";
import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/global/Container";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Catalog"
        title="Edit product"
        description="Update product details, pricing, and inventory."
      />
      <EditProductForm productId={id} />
    </Container>
  );
}
