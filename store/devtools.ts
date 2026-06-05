import type { DevtoolsOptions } from "zustand/middleware";

const CONNECTION_NAME = "MultiVendorStore";

export function withStoreDevtools(store: string): DevtoolsOptions {
  return {
    name: CONNECTION_NAME,
    store,
    enabled: process.env.NODE_ENV === "development",
  };
}
