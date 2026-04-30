import Container from "../Global/Container";
import { Label } from "../ui/label";
import ResetFilterButton from "./ResetFilterButton";

export default async function Filter() {
  return (
    <Container className="hidden md:inline-block md:max-w-[25dvw] 2xl:max-w-[20dvw] w-auto min-h-full mt-10 border rounded-sm p-2">
      <div className="flex justify-between items-center">
        <Label>Filter</Label>
        <ResetFilterButton />
      </div>
      <div className="flex items-center">
        {/* <Label>Range</Label>
        <RangeSlider className="" /> */}
      </div>
    </Container>
  );
}
