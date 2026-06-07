"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useStoreInit(
  init: () => void | Promise<unknown>,
  deps: unknown[] = [],
) {
  const pathname = usePathname();

  useEffect(() => {
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, ...deps]);
}

/** Runs init once on mount (or when deps change), not on every route change. */
export function useStoreInitOnce(
  init: () => void | Promise<unknown>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
