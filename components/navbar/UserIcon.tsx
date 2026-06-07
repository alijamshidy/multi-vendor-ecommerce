import { getUserProfileImage } from "@/lib/auth-server";
import UserIconClient from "./UserIconClient";

export default async function UserIcon() {
  const imageUrl = await getUserProfileImage();
  return <UserIconClient imageUrl={imageUrl} />;
}