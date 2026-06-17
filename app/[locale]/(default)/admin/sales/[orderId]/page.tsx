import OrderDetailPageContent from "@/components/pages/OrderDetailPageContent";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <OrderDetailPageContent
      orderId={orderId}
      role="admin"
    />
  );
}
