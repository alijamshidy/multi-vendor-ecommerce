import { Input } from "../ui/input";
import { Label } from "../ui/label";
type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
};

export default function FormInput({
  name,
  type,
  label,
  placeholder,
  defaultValue,
}: FormInputProps) {
  return (
    <div className="mb-2">
      <Label
        className="capitalize mb-2"
        htmlFor={name}>
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
      />
    </div>
  );
}
