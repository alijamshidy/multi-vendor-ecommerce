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
