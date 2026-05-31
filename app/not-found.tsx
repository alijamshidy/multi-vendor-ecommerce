import Container from "@/components/Global/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">
        404
      </p>
      <h1 className="text-3xl font-semibold sm:text-4xl">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </Container>
  );
}
