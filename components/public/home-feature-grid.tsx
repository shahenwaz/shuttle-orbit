import { LucideIcon } from "lucide-react";

type HomeFeatureGridProps = {
  items: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
  }>;
};

export function HomeFeatureGrid({ items }: HomeFeatureGridProps) {
  return (
    <section className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
        Why players will love it
      </p>
      <h2 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
        Follow tournaments, results, and player progress in one place
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/5"
            >
              <div className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-background/60">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
