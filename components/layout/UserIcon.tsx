import UserIconClient from "./UserIconClient";

export default async function UserIcon() {
  // const user = await currentUser();
  const user = { id: 1, imageUrl: "" };
  return <UserIconClient imageUrl={user?.imageUrl ?? null} />;
}
