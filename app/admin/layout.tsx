import type { CSSProperties } from "react";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminAppSidebar } from "@/components/admin/layout/admin-app-sidebar";
import { AdminTopbar } from "@/components/admin/layout/admin-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-mobile": "17rem",
          } as CSSProperties
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
