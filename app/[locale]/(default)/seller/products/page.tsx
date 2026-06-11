import SellerProductsContent from "@/components/pages/SellerProductsContent";
import { Suspense } from "react";

function SellerProductsFallback() {
  return (
    <div className="py-12 text-center text-sm text-muted-foreground">
      Loading products...
    </div>
  );
}

export default function SellerProductsPage() {
  return (
    <Suspense fallback={<SellerProductsFallback />}>
      <SellerProductsContent />
    </Suspense>
  );
}
