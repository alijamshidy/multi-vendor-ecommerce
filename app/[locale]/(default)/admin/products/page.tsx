import AdminProductsContent from "@/components/pages/AdminProductsContent";
import { Suspense } from "react";

function AdminProductsFallback() {
  return <p className="p-6 text-sm text-muted-foreground">Loading products...</p>;
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminProductsFallback />}>
      <AdminProductsContent />
    </Suspense>
  );
}
