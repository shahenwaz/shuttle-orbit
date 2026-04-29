import { Shield } from "lucide-react";

type AdminShellHeaderProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function AdminShellHeader({
  title,
  description,
  actions,
}: AdminShellHeaderProps) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-primary/18 bg-primary/8 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            <Shield className="h-3.5 w-3.5" />
            Admin workspace
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
        </div>
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {actions}
        </div>
      ) : null}
    </section>
  );
}
