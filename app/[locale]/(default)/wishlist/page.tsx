import WishlistPageContent from "@/components/pages/WishlistPageContent";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <WishlistPageContent locale={locale} />;
}
