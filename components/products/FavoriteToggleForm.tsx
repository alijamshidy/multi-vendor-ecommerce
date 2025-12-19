"use client";

// import { toggleFavoriteAction } from "@/utils/actions";
import { usePathname } from "next/navigation";
import { CardSubmitButton } from "../form/Buttons";
import FormContainer from "../form/FormContainer";

type FavoriteToggleFormProps = {
  productId: string;
  favoriteId: string | null;
};

export default function FavoriteToggleForm({
  productId,
  favoriteId,
}: FavoriteToggleFormProps) {
  const pathName = usePathname();
  // const toggleAction = toggleFavoriteAction.bind(null, {
  //   productId,
  //   favoriteId,
  //   pathName,
  // });
  return (
    <FormContainer action={() => console.log(2)}>
      <CardSubmitButton isFavorite={favoriteId ? true : false} />
    </FormContainer>
  );
}
