import { AdminAppSidebar } from "@/components/admin/layout/admin-app-sidebar";
import { AdminTopbar } from "@/components/admin/layout/admin-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-mobile": "17rem",
          } as React.CSSProperties
        }
      >
        <AdminAppSidebar />
        <SidebarInset className="min-h-screen bg-[#0b1118]">
          <AdminTopbar />
          <div className="flex flex-1 flex-col bg-[#0b1118]">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
