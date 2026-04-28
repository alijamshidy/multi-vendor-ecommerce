import { category } from "@/utils/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
export function SelectCategory() {
  return (
    <Select>
      <SelectTrigger className="w-[180px] rounded-none py-[20px]">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        {category.map(category => {
          return (
            <SelectItem
              key={category._id}
              value={category.name}>
              {category.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
