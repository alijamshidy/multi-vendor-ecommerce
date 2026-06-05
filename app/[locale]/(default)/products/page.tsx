import ProductsPageContent from "@/components/pages/ProductsPageContent";
import { Suspense } from "react";

function ProductsPageFallback() {
  return (
    <div className="py-12 text-center text-muted-foreground">Loading...</div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
