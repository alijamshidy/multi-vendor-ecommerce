import CollectionForm from "@/components/admin/CollectionForm";
import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/global/Container";

export default function CreateCollectionPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Catalog"
        title="Create collection"
        description="Group products into a curated collection."
      />
      <CollectionForm mode="create" />
    </Container>
  );
}
