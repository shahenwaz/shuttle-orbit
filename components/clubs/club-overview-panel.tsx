import { MapPin } from "lucide-react";

type ClubOverviewPanelProps = {
  description: string | null;
  homeVenue: string | null;
};

export function ClubOverviewPanel({
  description,
  homeVenue,
}: ClubOverviewPanelProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          About the club
        </h2>

        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          {description || "Club details will be updated soon."}
        </p>
      </div>

      {homeVenue ? (
        <div className="space-y-1 border-t border-white/10 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
            Home venue
          </p>

          <p className="inline-flex items-center gap-1.5 text-sm text-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary/80" />
            {homeVenue}
          </p>
        </div>
      ) : null}
    </section>
  );
}
