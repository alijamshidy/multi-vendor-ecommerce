import { cn } from "@/lib/utils";
import Logo from "../layout/Logo";
import Search from "../layout/Search";
import ThemeToggle from "../layout/ThemeToggle";
import Container from "./Container";
interface SidebarProps {
  className?: string;
}
export default function Header({ className }: SidebarProps) {
  return (
    <section
      className={cn(className, "fixed top-5 w-full z-30 hidden md:block")}>
      <header
        className={`w-[90%] mx-auto border rounded-md py-4 bg-background`}>
        <Container className="pl-4 xl:pl-0 flex justify-start items-center gap-x-4">
          <Logo />
          <ThemeToggle />
          <Search />
        </Container>
      </header>
    </section>
  );
}
