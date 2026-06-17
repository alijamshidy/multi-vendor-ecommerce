"use client";

import type { AuthRole } from "@/lib/auth-cookie";
import { getAuthRoleFromCookie } from "@/lib/auth-cookie";
import { getAuthenticatedUserId } from "@/lib/auth-session";
import useAuthStore from "@/store/authStore";
import { useSyncExternalStore } from "react";

function subscribeAuth(callback: () => void) {
  return useAuthStore.persist.onFinishHydration(callback);
}

function getAuthSnapshot() {
  return getAuthenticatedUserId();
}

function getServerAuthSnapshot() {
  return null;
}

/** Reactive session check — works before and after Zustand rehydration. */
export function useAuthenticatedUserId(): string | null {
  useAuthStore(state => state.user?.id);
  useAuthStore(state => state.accessToken);

  return useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );
}

export function useIsAuthenticated(): boolean {
  return Boolean(useAuthenticatedUserId());
}

function getAuthRoleSnapshot(): AuthRole | null {
  const fromStore = useAuthStore.getState().user?.role ?? null;
  return fromStore ?? getAuthRoleFromCookie();
}

function getServerAuthRoleSnapshot(): AuthRole | null {
  return null;
}

/** Resolves role from Zustand, falling back to the authRole cookie after refresh. */
export function useAuthRole(): AuthRole | null {
  useAuthStore(state => state.user?.role);
  useAuthStore(state => state.isAuthenticated);

  return useSyncExternalStore(
    subscribeAuth,
    getAuthRoleSnapshot,
    getServerAuthRoleSnapshot,
  );
}
