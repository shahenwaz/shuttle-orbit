import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-black/10",
        className,
      )}
    >
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
