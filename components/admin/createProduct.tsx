"use client";

import { useRouter } from "next/navigation";
import useManagementStore from "@/store/managementStore";
import { toast } from "sonner";

export function CreateProductForm() {
  const router = useRouter();
  const createProduct = useManagementStore(state => state.createProduct);
  const isLoading = useManagementStore(state => state.loading.createProduct);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      await createProduct(payload);
      toast.success("Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={isLoading}>
        {isLoading ? "Creating..." : "Create product"}
      </button>
    </form>
  );
}
