import { getStoredAccessToken } from "@/lib/auth-cookie";
import { getUserIdFromToken } from "@/lib/auth-utils";
import useAuthStore from "@/store/authStore";

/** Resolves the logged-in user id from Zustand or the JWT in storage. */
export function getAuthenticatedUserId(): string | null {
  const fromStore = useAuthStore.getState().user?.id;
  if (fromStore) return fromStore;

  const token = getStoredAccessToken();
  if (!token) return null;

  return getUserIdFromToken(token);
}

export function isAuthenticatedSession(): boolean {
  return Boolean(getAuthenticatedUserId());
}
