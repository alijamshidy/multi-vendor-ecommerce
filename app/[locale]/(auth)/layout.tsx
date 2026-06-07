import AuthTopBar from "@/components/auth/AuthTopBar";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden bg-muted/30">
      <AuthTopBar />
      <main className="mx-[4%] flex min-w-0 flex-1 flex-col gap-4 py-6">
        <AppBreadcrumb />
        {children}
      </main>
    </div>
  );
}
