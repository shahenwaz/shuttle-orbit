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
    <section className={cn("space-y-3", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
          {eyebrow}
        </p>
      ) : null}

      <div className="space-y-3">
        <h1 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        {description ? (
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
