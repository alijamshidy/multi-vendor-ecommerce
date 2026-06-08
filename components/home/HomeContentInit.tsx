"use client";

import { useStoreInit } from "@/hooks/use-store-init";
import useContentStore from "@/store/contentStore";
import { useLocale } from "next-intl";

export default function HomeContentInit() {
  const locale = useLocale();
  const fetchAll = useContentStore(state => state.fetchAll);

  useStoreInit(() => fetchAll(locale), [locale, fetchAll]);

  return null;
}
