import { fetchProductRating } from "@/utils/actions";
import { FaStar } from "react-icons/fa";

export default async function ProductRating({
  productId,
}: {
  productId: string;
}) {
  const { count, rating } = await fetchProductRating(productId);
  const calssName = "flex gap-1 items-center text-md mt-1 mb-4";
  const countValue = `(${count} reviews)`;
  return (
    <span className={calssName}>
      <FaStar className="w-3 h-3" />
      {rating} {countValue}
    </span>
  );
}
