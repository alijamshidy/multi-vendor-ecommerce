import CreateProductForm from "@/components/admin/createProduct";
import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/global/Container";

export default function CreateProductPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Catalog"
        title="Create product"
        description="Add a new product to the catalog."
      />
      <CreateProductForm />
    </Container>
  );
}
