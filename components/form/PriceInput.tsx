import { Input } from "../ui/input";
import { Label } from "../ui/label";

const name = "price";
type FormInputNumberProps = {
  defaultValue?: number;
};
export default function PriceInput({ defaultValue }: FormInputNumberProps) {
  return (
    <div className="mb-2">
      <Label
        className="capitalize mb-2"
        htmlFor={name}>
        Price ($)
      </Label>
      <Input
        type="number"
        id={name}
        name={name}
        defaultValue={defaultValue || 100}
        min={0}
        required
      />
    </div>
  );
}
