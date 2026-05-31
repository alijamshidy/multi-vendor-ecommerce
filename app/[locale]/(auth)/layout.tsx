import AuthTopBar from "@/components/auth/AuthTopBar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden bg-muted/30">
      <AuthTopBar />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
