import CreateCategoryForm from "@/components/admin/createCategory";
import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/global/Container";

export default function CreateCategoryPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Catalog"
        title="Create category"
        description="Add a new category to organize products."
      />
      <CreateCategoryForm />
    </Container>
  );
}
