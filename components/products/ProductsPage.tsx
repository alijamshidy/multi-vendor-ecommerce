"use client";
import { useSidebar } from "../ui/sidebar";
import ProductsContainer from "./ProductsContainer";

export default function ProductsPage({ layout }: { layout: string }) {
  const { open } = useSidebar();
  return (
    <>
      <ProductsContainer
        layout={layout}
        open={open}
      />
    </>
  );
}
