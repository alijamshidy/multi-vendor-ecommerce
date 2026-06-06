import { cn } from "@/lib/utils";
import { FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";
import { Button } from "../ui/button";

export type ProductButtonType = "wishlist" | "details" | "addToCart";

export default function ProductButton({
  type,
  className,
  onClick,
  disabled,
}: {
  type: ProductButtonType;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}) {
  const icon =
    type === "details" ? (
      <FaEye />
    ) : type === "addToCart" ? (
      <FaShoppingCart />
    ) : (
      <FaHeart />
    );
  return (
    <Button
      type="button"
      className={cn("rounded-full cursor-pointer h-10 w-10", className)}
      variant={"default"}
      onClick={onClick}
      disabled={disabled}>
      {icon}
    </Button>
  );
}
