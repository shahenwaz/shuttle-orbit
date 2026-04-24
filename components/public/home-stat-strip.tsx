type HomeStatStripProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function HomeStatStrip({ items }: HomeStatStripProps) {
  return (
    <section className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
