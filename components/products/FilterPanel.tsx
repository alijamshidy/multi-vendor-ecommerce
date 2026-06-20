"use client";

import AvailabilityFilter from "../filter/AvailabilityFilter";
import CategoryFilter from "../filter/CategoryFilter";
import CreatedDateFilter from "../filter/CreatedDateFilter";
import DiscountFilter from "../filter/DiscountFilter";
import ManagementSearchFilter from "../filter/ManagementSearchFilter";
import RangeSlider from "../filter/RangeSlider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Label } from "../ui/label";
import { useTranslations } from "next-intl";
import ResetFilterButton from "./ResetFilterButton";

export type FilterPanelVariant = "storefront" | "management";

type FilterSection =
  | "search"
  | "priceRange"
  | "category"
  | "availability"
  | "discount"
  | "createdDate";

type FilterPanelProps = {
  variant?: FilterPanelVariant;
  hiddenSections?: FilterSection[];
};

export default function FilterPanel({
  variant = "storefront",
  hiddenSections = [],
}: FilterPanelProps) {
  const t = useTranslations("filters");
  const hidden = new Set(hiddenSections);

  const filterItems = [
    ...(variant === "management" && !hidden.has("search")
      ? [
          {
            value: "search" as const,
            trigger: t("search"),
            content: <ManagementSearchFilter />,
          },
        ]
      : []),
    ...(variant === "storefront" && !hidden.has("priceRange")
      ? [
          {
            value: "priceRange" as const,
            trigger: t("priceRange"),
            content: <RangeSlider />,
          },
        ]
      : []),
    ...(!hidden.has("category")
      ? [
          {
            value: "category" as const,
            trigger: t("category"),
            content: <CategoryFilter />,
          },
        ]
      : []),
    ...(!hidden.has("availability")
      ? [
          {
            value: "availability" as const,
            trigger: t("availability"),
            content: <AvailabilityFilter />,
          },
        ]
      : []),
    ...(!hidden.has("discount")
      ? [
          {
            value: "discount" as const,
            trigger: t("discount"),
            content: <DiscountFilter />,
          },
        ]
      : []),
    ...(!hidden.has("createdDate")
      ? [
          {
            value: "createdDate" as const,
            trigger: t("createdDate"),
            content: <CreatedDateFilter />,
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <Label>{t("title")}</Label>
        <ResetFilterButton />
      </div>
      <Accordion
        type="multiple"
        className="w-full">
        {filterItems.map(item => (
          <AccordionItem
            key={item.value}
            value={item.value}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
