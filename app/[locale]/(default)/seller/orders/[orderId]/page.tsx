import OrderDetailPageContent from "@/components/pages/OrderDetailPageContent";

export default async function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <OrderDetailPageContent
      orderId={orderId}
      role="seller"
    />
  );
}
