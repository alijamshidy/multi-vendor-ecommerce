"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

export function CreateProductForm() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        router.push("/admin/products"); // ریدایرکت
        router.refresh(); // revalidate
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Create product</button>
    </form>
  );
}
