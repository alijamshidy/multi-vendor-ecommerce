import Container from "../Global/Container";
import { Label } from "../ui/label";
import ResetFilterButton from "./ResetFilterButton";

export default async function Filter() {
  return (
    <Container className="hidden md:inline-block md:w-[30%] xl:w-[20%] min-h-full mt-10 border rounded-sm p-2">
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
