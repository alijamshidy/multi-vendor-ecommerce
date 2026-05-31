import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center p-4 pb-10 md:p-8",
        className,
      )}>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
