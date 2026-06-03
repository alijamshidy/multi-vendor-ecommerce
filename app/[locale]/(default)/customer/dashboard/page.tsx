import CustomerDashboardContent from "@/components/pages/CustomerDashboardContent";

export default async function CustomerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <CustomerDashboardContent locale={locale} />;
}
