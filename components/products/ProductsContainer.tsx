import { Products, productType } from "@/utils/products";
import { Separator } from "../ui/separator";
import ChangeLayout from "./ChangeLayout";
import ProductsGrid from "./ProductsGrid";
import ProductsList from "./ProductsList";

export default function ProductsContainer({ layout }: { layout: string }) {
  // const products = await fetchAllProducts({ search });
  const products: productType[] = Products;
  // const totalProducts = products.length;
  const totalProducts: number = 10;

  return (
    <div className="grow-5">
      <section>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-lg">
            {totalProducts} product{totalProducts > 1 && "s"}
          </h4>
          <ChangeLayout layout={layout} />
        </div>
        <Separator className="mt-4" />
      </section>
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <h5 className="text-2xl mt-16">
            Sorry, no products matched your search...
          </h5>
        ) : layout === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </div>
  );
}
