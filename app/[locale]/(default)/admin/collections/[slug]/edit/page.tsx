import CollectionForm from "@/components/admin/CollectionForm";
import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/Global/Container";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Catalog"
        title="Edit collection"
        description="Update collection details and assigned products."
      />
      <CollectionForm
        mode="edit"
        slug={decodeURIComponent(slug)}
      />
    </Container>
  );
}
