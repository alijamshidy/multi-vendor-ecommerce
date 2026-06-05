"use client";

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

export default function FilterPanel() {
  const t = useTranslations("filters");

  const filterItems = [
    {
      value: "priceRange",
      trigger: t("priceRange"),
      content: <RangeSlider />,
    },
    {
      value: "category",
      trigger: t("category"),
      content: t("categoriesDescription"),
    },
    {
      value: "rating",
      trigger: t("rating"),
      content: t("ratingDescription"),
    },
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
