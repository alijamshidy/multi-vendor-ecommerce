export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const user = await getCurrentUser();

  // if (!user) redirect('/auth/login');

  // if (!['ADMIN', 'SELLER'].includes(user.role)) {
  //   notFound();
  // }

  return (
    // <PanelShell role={user.role}>
    { children }
    // {/* </PanelShell> */}
  );
}
