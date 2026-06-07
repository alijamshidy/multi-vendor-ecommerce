import type { UserProfile } from "@/lib/api-types";
import { resolveMediaUrl, unwrapEntity } from "@/lib/api-utils";
import { API_BASE_URL } from "@/lib/axios";
import { cookies } from "next/headers";

export async function getAccessTokenFromServerCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("accessToken")?.value?.trim();
  if (!rawToken) return null;

  try {
    return decodeURIComponent(rawToken);
  } catch {
    return rawToken;
  }
}

export async function getUserProfileImage(): Promise<string | null> {
  const token = await getAccessTokenFromServerCookies();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/me/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = unwrapEntity<UserProfile>(await response.json());
    return data?.image ? resolveMediaUrl(data.image) : null;
  } catch {
    return null;
  }
}
