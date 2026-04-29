import { cn } from "@/lib/utils";
import { FaEye, FaHeart, FaIdCard } from "react-icons/fa";
import { Button } from "../ui/button";

export default function ProductButton({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const icon =
    type === "details" ? (
      <FaEye />
    ) : type === "addToCard" ? (
      <FaIdCard />
    ) : (
      <FaHeart />
    );
  return (
    <Button
      className={cn("rounded-full cursor-pointer", className)}
      variant={"ghost"}>
      {icon}
    </Button>
  );
}
