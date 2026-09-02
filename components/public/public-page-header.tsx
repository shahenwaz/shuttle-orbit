import { cn } from "@/lib/utils";

type PublicPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function PublicPageHeader({
  eyebrow,
  title,
  description,
  className,
}: PublicPageHeaderProps) {
  return (
    <section className={cn("space-y-1", className)}>
      {eyebrow ? (
        <p className="text-[10px] leading-4 font-semibold uppercase tracking-[0.18em] text-primary/80 sm:text-[11px]">
          {eyebrow}
        </p>
      ) : null}

      <div className="space-y-1">
        <h1 className="max-w-3xl text-xl leading-tight font-bold tracking-tight sm:text-2xl sm:leading-tight">
          {title}
        </h1>

        {description ? (
          <p className="max-w-2xl text-sm leading-5 text-muted-foreground sm:leading-6">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
