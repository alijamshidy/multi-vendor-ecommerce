import RangeSlider from "../filter/RangeSlider";
import Container from "../Global/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Label } from "../ui/label";
import ResetFilterButton from "./ResetFilterButton";

export default async function Filter() {
  const items = [
    {
      value: "priceRange",
      trigger: "Price Range",
      content: <RangeSlider />,
    },
    {
      value: "item-2",
      trigger: "Can I change my subscription plan?",
      content:
        "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
    },
    {
      value: "item-3",
      trigger: "What payment methods do you accept?",
      content:
        "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
    },
  ];
  return (
    <Container className="hidden md:inline-block md:max-w-[25dvw] 2xl:max-w-[20dvw] w-auto mt-10 border rounded-sm p-2">
      <div className="flex justify-between items-center">
        <Label>Filter</Label>
        <ResetFilterButton />
      </div>

      <Accordion
        type={"multiple"}
        className="max-w-lg">
        {items.map(item => {
          return (
            <AccordionItem
              key={item.value}
              value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Container>
  );
}
