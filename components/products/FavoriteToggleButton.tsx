import FavoriteToggleForm from "./FavoriteToggleForm";

export default async function FavoriteToggleButton({
  productId,
}: {
  productId: string;
}) {
  // const userId = (await auth()).userId;
  // if (!userId) return <CardSignInButton />;
  // const favoriteId = await fetchFavoriteId({ productId });
  const favoriteId = "98798";
  return (
    <FavoriteToggleForm
      favoriteId={favoriteId}
      productId={productId}
    />
  );
}
