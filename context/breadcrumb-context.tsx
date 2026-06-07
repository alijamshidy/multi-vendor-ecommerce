"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BreadcrumbContextValue = {
  dynamicLabel: string | null;
  setDynamicLabel: (label: string | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [dynamicLabel, setDynamicLabelState] = useState<string | null>(null);

  const setDynamicLabel = useCallback((label: string | null) => {
    setDynamicLabelState(label);
  }, []);

  const value = useMemo(
    () => ({ dynamicLabel, setDynamicLabel }),
    [dynamicLabel, setDynamicLabel],
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbDynamicLabel() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      "useBreadcrumbDynamicLabel must be used within BreadcrumbProvider",
    );
  }
  return context.dynamicLabel;
}

export function useSetBreadcrumbLabel(label: string | null) {
  const context = useContext(BreadcrumbContext);
  const setDynamicLabel = context?.setDynamicLabel;

  useEffect(() => {
    if (!setDynamicLabel) return;
    setDynamicLabel(label);
    return () => setDynamicLabel(null);
  }, [label, setDynamicLabel]);
}
