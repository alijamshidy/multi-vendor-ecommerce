import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type TextAreaInputProps = {
  name: string;
  labelText?: string;
  defaultValue?: string;
};
export default function TextAreaInput({
  name,
  labelText,
  defaultValue,
}: TextAreaInputProps) {
  return (
    <div className="mb-2">
      <Label
        className="capitalize mb-2"
        htmlFor={name}>
        {labelText || name}
      </Label>
      <Textarea
        className="resize-none leading-loose"
        rows={5}
        id={name}
        name={name}
        defaultValue={defaultValue}
        required
      />
    </div>
  );
}
