type FixtureTemplatePreviewCardProps = {
  title: string;
  description: string;
  groups: Array<{
    label: string;
    size: number;
    qualifiers: number;
  }>;
  knockoutMatches?: Array<{
    roundLabel: string;
    pairing: string;
  }>;
  isSelected?: boolean;
};

export function FixtureTemplatePreviewCard({
  title,
  description,
  groups,
  knockoutMatches = [],
  isSelected = false,
}: FixtureTemplatePreviewCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 sm:p-5",
        isSelected
          ? "border-primary/30 bg-primary/8"
          : "border-white/10 bg-white/4",
      ].join(" ")}
    >
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          {title}
        </h3>
        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          {description}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
            Group stage
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.label}
                className="rounded-xl border border-white/10 bg-background/40 px-3 py-2.5"
              >
                <p className="text-sm font-semibold text-foreground">
                  Group {group.label}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                  {group.size} teams · top {group.qualifiers} qualify
                </p>
              </div>
            ))}
          </div>
        </div>

        {knockoutMatches.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
              Knockout stage
            </p>

            <div className="space-y-2">
              {knockoutMatches.map((match) => (
                <div
                  key={match.roundLabel}
                  className="rounded-xl border border-white/10 bg-background/40 px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {match.roundLabel}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                    {match.pairing}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
