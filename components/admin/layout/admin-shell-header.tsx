import { Shield } from "lucide-react";

import { AdminShellNav } from "@/components/admin/layout/admin-shell-nav";

type AdminShellHeaderProps = {
  activeItem: "overview" | "players" | "tournaments";
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function AdminShellHeader({
  activeItem,
  title,
  description,
  actions,
}: AdminShellHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          <Shield className="h-3.5 w-3.5" />
          Admin workspace
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>

      <AdminShellNav activeItem={activeItem} />

      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </section>
  );
}
