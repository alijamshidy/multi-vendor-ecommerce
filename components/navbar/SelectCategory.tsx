import { Categorys } from "@/utils/category";
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
        {Categorys.map(item => {
          return (
            <SelectItem
              key={item.id}
              value={item.href}>
              {item.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
