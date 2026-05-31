import { FieldDescription } from "@/components/ui/field";

export default function AuthFooterNote() {
  return (
    <FieldDescription className="px-2 text-center text-xs sm:px-4">
      By continuing, you agree to our{" "}
      <a
        href="#"
        className="underline-offset-4 hover:underline">
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href="#"
        className="underline-offset-4 hover:underline">
        Privacy Policy
      </a>
      .
    </FieldDescription>
  );
}
