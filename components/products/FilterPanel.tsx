import RangeSlider from "../filter/RangeSlider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Label } from "../ui/label";
import ResetFilterButton from "./ResetFilterButton";

const filterItems = [
  {
    value: "priceRange",
    trigger: "Price Range",
    content: <RangeSlider />,
  },
  {
    value: "category",
    trigger: "Category",
    content:
      "Browse by electronics, fashion, home goods, and more from verified sellers.",
  },
  {
    value: "rating",
    trigger: "Rating",
    content: "Filter products by customer rating and review count.",
  },
];

export default function FilterPanel() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Label>Filter</Label>
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
