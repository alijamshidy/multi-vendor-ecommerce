import Link from "next/link";
import { LuShoppingCart } from "react-icons/lu";
import { Button } from "../ui/button";

export default async function CardButton() {
  // const numItemsInCart = await fetchCartItems();
  const numItemsInCart = 0;
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className="flex justify-center items-center relative">
      <Link
        href={"/cart"}
        className="w-full h-full justify-center items-center flex">
        <LuShoppingCart />
        <span className="absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
          {numItemsInCart}
        </span>
      </Link>
    </Button>
  );
}
