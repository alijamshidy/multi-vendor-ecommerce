import Header from "@/components/Global/Header";
import Side from "@/components/Global/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider
        defaultOpen={false}
        className="min-h-0 sm:max-w-full"
        style={{ "--sidebar-width": "100%" }}>
        <Side />
      </SidebarProvider>

      <Header />

      {children}
    </>
  );
}
