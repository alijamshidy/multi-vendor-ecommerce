import UserIconClient from "./UserIconClient";

export default async function UserIcon() {
  // const user = await currentUser();
  const user = true;
  return <UserIconClient imageUrl={user?.imageUrl ?? null} />;
}
