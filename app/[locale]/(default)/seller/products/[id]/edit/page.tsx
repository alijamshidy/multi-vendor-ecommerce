import EditProductForm from "@/components/admin/EditProductForm";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { getTranslations } from "next-intl/server";

export default async function EditSellerProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("adminForms");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("sellerEyebrow")}
        title={t("editProductTitle")}
        description={t("editProductDescription")}
      />
      <EditProductForm productId={id} />
    </PageShell>
  );
}
