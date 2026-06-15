import Container from "@/components/global/Container";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageShell({ children, className }: PageShellProps) {
  return (
    <Container className={cn("mt-8 space-y-8", className)}>
      {children}
    </Container>
  );
}
