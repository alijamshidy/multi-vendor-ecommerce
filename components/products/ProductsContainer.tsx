import { Products, productType } from "@/utils/products";
import Link from "next/link";
import { LuLayoutGrid, LuLayoutList } from "react-icons/lu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProductsGrid from "./ProductsGrid";
import ProductsList from "./ProductsList";

export default async function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  // const products = await fetchAllProducts({ search });
  const getProducts = async () => {
    return Products;
  };
  const products: productType[] = await getProducts();
  // const totalProducts = products.length;
  const totalProducts: number = 10;
  const searchTerm = search ? `&search=${search}` : "";

  return (
    <div className="grow-5">
      <section>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-lg">
            {totalProducts} product{totalProducts > 1 && "s"}
          </h4>
          <div className="flex gap-x-4">
            <Button
              variant={layout === "grid" ? "default" : "ghost"}
              size={"icon"}>
              <Link
                href={`/en/products?layout=grid${searchTerm}`}
                className="w-full h-full justify-center items-center flex">
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={layout !== "grid" ? "default" : "ghost"}
              size={"icon"}>
              <Link
                href={`/en/products?layout=list${searchTerm}`}
                className="w-full h-full justify-center items-center flex">
                <LuLayoutList />
              </Link>
            </Button>
          </div>
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
