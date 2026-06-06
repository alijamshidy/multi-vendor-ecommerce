"use client";

import { useEffect } from "react";

export function useStoreInit(
  init: () => void | Promise<unknown>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
