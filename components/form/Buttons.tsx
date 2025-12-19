"use client";

import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { LuTrash2 } from "react-icons/lu";
import { Button } from "../ui/button";

type btnSize = "default" | "lg" | "sm";
type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};
export default function SubmitButton({
  className = "",
  text = "submit",
  size = "lg",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn("capitalize", className)}
      size={size}
      disabled={pending}>
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Pleace wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

type actionType = "edit" | "delete";
export const IconButton = ({ actionType }: { actionType: actionType }) => {
  const { pending } = useFormStatus();

  const renderIcon = () => {
    switch (actionType) {
      case "edit":
        return <FaRegPenToSquare />;
      case "delete":
        return <LuTrash2 />;
      default:
        const never: never = actionType;
        throw new Error(`Invalid action type: ${never}`);
    }
  };
  return (
    <Button
      type="submit"
      size={"icon"}
      variant={"link"}
      className="p-2 cursor-pointer">
      {pending ? <ReloadIcon className="animate-spin" /> : renderIcon()}
    </Button>
  );
};

export const CardSignInButton = () => {
  return (
    <Button
      type="button"
      size={"icon"}
      variant={"outline"}
      className="p-2 cursor-pointer"
      asChild>
      <FaRegHeart />
    </Button>
  );
};

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size={"icon"}
      variant={"outline"}
      className="p-2 cursor-pointer">
      {pending ? (
        <ReloadIcon className="animate-spin" />
      ) : isFavorite ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};

export const ProductSignInButton = () => {
  return (
    <Button
      type="button"
      className="mt-8 capitalize">
      sign in
    </Button>
  );
};
