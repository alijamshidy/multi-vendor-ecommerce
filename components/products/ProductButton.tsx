import { cn } from "@/lib/utils";
import { FaEye, FaHeart, FaIdCard } from "react-icons/fa";
import { Button } from "../ui/button";

export type ProductButtonType = "wishlist" | "details" | "addToCart";

export default function ProductButton({
  type,
  className,
}: {
  type: ProductButtonType;
  className?: string;
}) {
  const icon =
    type === "details" ? (
      <FaEye />
    ) : type === "addToCart" ? (
      <FaIdCard />
    ) : (
      <FaHeart />
    );
  return (
    <Button
      className={cn("rounded-full cursor-pointer", className)}
      variant={"default"}>
      {icon}
    </Button>
  );
}
