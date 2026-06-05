"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useQueryParams() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const setQueryParam = useCallback(
    (name: string, value: string | number) => {
      const params = new URLSearchParams(searchParams);
      const nextValue = String(value);

      if (nextValue) {
        params.set(name, nextValue);
      } else {
        params.delete(name);
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams],
  );

  const setQueryParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams);

      for (const [name, value] of Object.entries(updates)) {
        if (value == null || value === "") {
          params.delete(name);
        } else {
          params.set(name, String(value));
        }
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams],
  );

  const replaceQuery = useCallback(
    (href: string) => {
      replace(href);
    },
    [replace],
  );

  return {
    pathname,
    searchParams,
    setQueryParam,
    setQueryParams,
    replaceQuery,
  };
}
