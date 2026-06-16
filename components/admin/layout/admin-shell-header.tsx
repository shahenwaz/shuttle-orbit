type AdminShellHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function AdminShellHeader({
  title,
  description,
  actions,
}: AdminShellHeaderProps) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
