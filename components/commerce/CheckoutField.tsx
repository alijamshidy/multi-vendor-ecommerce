import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutFieldProps = {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
};

export default function CheckoutField({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: CheckoutFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
