import type { ReactNode } from "react";

import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";

type AdminDetailHeaderProps = {
  title: string;
  actions?: ReactNode;
  meta?: ReactNode;
  summary?: ReactNode;
  children?: ReactNode;
};

export function AdminDetailHeader({
  title,
  actions,
  meta,
  summary,
  children,
}: AdminDetailHeaderProps) {
  return (
    <section className="relative -mx-4 overflow-hidden bg-[#101923] px-4 pt-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,color-mix(in_oklab,var(--primary)_24%,transparent),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-[#0b1118]/45" />

      <div className="relative">
        <div className="space-y-3 pb-3">
          <AdminShellHeader title={title} actions={actions} />

          {meta ? (
            <div className="flex min-w-0 items-center gap-2 text-xs">
              {meta}
            </div>
          ) : null}

          {summary ? (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {summary}
            </div>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}
