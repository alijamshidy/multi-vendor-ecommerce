import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ImageInput() {
  const name = "image";
  return (
    <div className="mb-2">
      <Label
        className="capitalize mb-2"
        htmlFor={name}>
        Image
      </Label>
      <Input
        type="file"
        id={name}
        name={name}
        required
        accept="image/*"
      />
    </div>
  );
}
