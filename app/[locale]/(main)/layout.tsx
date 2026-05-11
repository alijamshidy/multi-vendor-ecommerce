import LayoutContent from "@/components/layout/LayoutContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <TooltipProvider>
        <LayoutContent>{children}</LayoutContent>
      </TooltipProvider>
    </SidebarProvider>
  );
}
