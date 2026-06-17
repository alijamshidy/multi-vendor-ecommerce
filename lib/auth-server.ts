import { API_BASE_URL } from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { cookies } from "next/headers";

export async function getAccessTokenFromServerCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value?.trim();
  const customerToken = cookieStore.get("customerToken")?.value?.trim();
  const rawToken = accessToken ?? customerToken;
  if (!rawToken) return null;

  try {
    return decodeURIComponent(rawToken);
  } catch {
    return rawToken;
  }
}

export async function getUserProfileImage(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(item => `${item.name}=${item.value}`)
    .join("; ");

  if (!cookieHeader) return null;

  try {
    const response = await fetch(`${API_BASE_URL}${apiEndpoints.auth.getUser}`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      userInfo?: { image?: string };
    };
    return data.userInfo?.image ?? null;
  } catch {
    return null;
  }
}
