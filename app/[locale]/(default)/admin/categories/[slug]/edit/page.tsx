import EditCategoryForm from "@/components/admin/EditCategoryForm";
import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/global/Container";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Catalog"
        title="Edit category"
        description="Update category name, parent, and image."
      />
      <EditCategoryForm slug={decodeURIComponent(slug)} />
    </Container>
  );
}
