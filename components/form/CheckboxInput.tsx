import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type CheckboxInputProps = {
  name: string;
  label: string;
  defaultChecked?: boolean;
};
export default function CheckboxInput({
  name,
  label,
  defaultChecked,
}: CheckboxInputProps) {
  return (
    <div className="mb-2 flex items-center space-x-2">
      <Checkbox
        id={name}
        name={name}
        defaultChecked={defaultChecked}
      />
      <Label
        className="capitalize text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
        htmlFor={name}>
        {label}
      </Label>
    </div>
  );
}
