import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className={cn("w-full max-w-sm", className)}>{children}</div>
    </div>
  );
}
