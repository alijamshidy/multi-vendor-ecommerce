"use client";

import { useTranslations } from "next-intl";
import { LuPhone } from "react-icons/lu";
import CategoryDropdown from "../layout/CategoryDropdown";
import { Label } from "../ui/label";

export default function Navbar() {
  const t = useTranslations("common");

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 rounded-md border p-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <Label className="order-1 flex gap-2 sm:order-2 flex-row sm:items-center justify-between sm:justify-start">
        <div className="flex items-center gap-x-1 sm:me-3">
          <span>{t("phone")}</span>
          <LuPhone className="size-4 shrink-0" />
        </div>
        <div className="flex flex-col items-start gap-y-1 text-sm  sm:gap-x-4 sm:gap-y-0">
          <span dir="ltr">+98 918 123 4986</span>
          <span dir="ltr">+87 33 12 4986</span>
        </div>
      </Label>

      <div className="order-2 w-full min-w-0 sm:order-1 sm:w-auto">
        <CategoryDropdown />
      </div>
    </div>
  );
}
