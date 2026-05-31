import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "../ui/button";

type BadgeIconButtonProps = {
  href: string;
  count: number;
  icon: ReactNode;
  label: string;
  className?: string;
};

export default function BadgeIconButton({
  href,
  count,
  icon,
  label,
  className,
}: BadgeIconButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("flex justify-center items-center relative", className)}
      asChild>
      <Link
        href={href}
        aria-label={label}
        className="justify-center items-center flex">
        {icon}
        <span className="absolute -top-3 -end-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
          {count}
        </span>
      </Link>
    </Button>
  );
}
