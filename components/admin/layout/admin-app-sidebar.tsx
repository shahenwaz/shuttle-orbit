"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy } from "lucide-react";

import { adminNavItems } from "@/components/admin/layout/admin-sidebar-config";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function AdminSidebarNavLink({
  href,
  title,
  active,
  icon: Icon,
}: {
  href: string;
  title: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={title}
        isActive={active}
        className={cn(
          "h-9 rounded-xl px-2.5 text-sm font-medium transition",
          active
            ? "bg-primary/12 text-foreground ring-1 ring-primary/20"
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
        )}
      >
        <Link
          href={href}
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false);
            }
          }}
        >
          <Icon className={cn("h-4 w-4", active ? "text-primary" : "")} />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AdminAppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="text-foreground">
      <SidebarHeader className="px-3 py-3">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-white/5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
            <Trophy className="h-4.5 w-4.5 text-primary" />
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/80">
              Admin workspace
            </p>
            <p className="truncate font-heading text-[13px] font-semibold leading-5 text-foreground">
              Tournament Control
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-3 pt-1">
        <SidebarGroup className="p-2 pt-1">
          <SidebarGroupLabel className="px-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <AdminSidebarNavLink
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  icon={item.icon}
                  active={item.match(pathname)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
