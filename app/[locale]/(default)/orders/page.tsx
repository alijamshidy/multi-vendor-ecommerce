import OrdersPageContent from "@/components/pages/OrdersPageContent";
import { Suspense } from "react";

function OrdersPageFallback() {
  return (
    <div className="py-12 text-center text-sm text-muted-foreground">
      Loading orders...
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersPageFallback />}>
      <OrdersPageContent />
    </Suspense>
  );
}
