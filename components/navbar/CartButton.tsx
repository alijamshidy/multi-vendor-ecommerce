// import { fetchCartItems } from "@/utils/actions";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { Button } from "../ui/button";

export default async function CartButton() {
  const numItemsInCart = 3;
  return (
    <Button
      asChild
      variant={"link"}
      size={"icon"}
      className="flex justify-center items-center relative rounded-full text-green-500 border">
      <Link href={"/whishlist"}>
        <FaShoppingCart />
        <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
          {numItemsInCart}
        </span>
      </Link>
    </Button>
  );
}
