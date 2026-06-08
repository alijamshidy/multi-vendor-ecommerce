"use client";

import { useStoreInitOnce } from "@/hooks/use-store-init";
import useContentStore from "@/store/contentStore";
import { useTranslations } from "next-intl";
import { LuPhone } from "react-icons/lu";
import CategoryDropdown from "../layout/CategoryDropdown";
import { Label } from "../ui/label";

const FALLBACK_PHONES = ["+98 918 123 4986", "+87 33 12 4986"];

export default function Navbar() {
  const t = useTranslations("common");
  const contact = useContentStore(state => state.contact);
  const fetchContact = useContentStore(state => state.fetchContact);

  useStoreInitOnce(() => fetchContact(), [fetchContact]);

  const phones =
    contact.phones.length > 0 ? contact.phones : FALLBACK_PHONES;

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 rounded-md border p-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <Label className="order-1 flex flex-row justify-between gap-2 sm:order-2 sm:items-center sm:justify-start">
        <div className="flex items-center gap-x-1 sm:me-3">
          <span>{t("phone")}</span>
          <LuPhone className="size-4 shrink-0" />
        </div>
        <div className="flex flex-col items-start gap-y-1 text-sm sm:gap-x-4 sm:gap-y-0">
          {phones.map(phone => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s/g, "")}`}
              dir="ltr"
              className="hover:text-primary">
              {phone}
            </a>
          ))}
        </div>
      </Label>

      <div className="order-2 w-full min-w-0 sm:order-1 sm:w-auto">
        <CategoryDropdown />
      </div>
    </div>
  );
}
