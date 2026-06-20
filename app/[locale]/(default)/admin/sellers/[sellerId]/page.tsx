import AdminSellerDetailPageContent from "@/components/pages/AdminSellerDetailPageContent";

export default async function AdminSellerDetailPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = await params;
  return <AdminSellerDetailPageContent sellerId={sellerId} />;
}
