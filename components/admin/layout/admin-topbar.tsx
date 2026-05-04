"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { AdminLogoutButton } from "@/components/admin/layout/admin-logout-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function toTitleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AdminTopbar() {
  const pathname = usePathname();

  const segments = useMemo(() => {
    return pathname
      .split("/")
      .filter(Boolean)
      .slice(1)
      .map((segment) => toTitleCase(segment));
  }, [pathname]);

  const currentLabel =
    segments.length > 0 ? segments[segments.length - 1] : "Overview";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0b1118] px-4 sm:h-16 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger />

        <Separator
          orientation="vertical"
          className="mx-1 hidden data-[orientation=vertical]:h-4 sm:block"
        />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbPage>Admin</BreadcrumbPage>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden sm:block" />

            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center">
        <AdminLogoutButton />
      </div>
    </header>
  );
}
