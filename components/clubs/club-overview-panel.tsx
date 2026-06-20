import { MapPin, Users } from "lucide-react";

import { surfaceCardClassName } from "@/components/shared/surface-card";

type ClubOverviewPanelProps = {
  description: string | null;
  homeVenue: string | null;
  memberCount: number;
};

const detailAccentClassName = "text-purple-300";

export function ClubOverviewPanel({
  description,
  homeVenue,
  memberCount,
}: ClubOverviewPanelProps) {
  return (
    <section
      className={surfaceCardClassName({
        variant: "elevated",
        className: "space-y-5 p-4 sm:p-5",
      })}
    >
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-300">
          About
        </p>

        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          {description || "Club details will be updated soon."}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        {homeVenue ? (
          <p className="flex items-start gap-2 leading-6">
            <MapPin
              className={`mt-1 h-3.5 w-3.5 shrink-0 ${detailAccentClassName}`}
            />
            <span>
              <span className={`font-semibold ${detailAccentClassName}`}>
                Home Venue:
              </span>{" "}
              <span className="text-muted-foreground">{homeVenue}</span>
            </span>
          </p>
        ) : null}

        {memberCount > 0 ? (
          <p className="flex items-start gap-2 leading-6">
            <Users
              className={`mt-1 h-3.5 w-3.5 shrink-0 ${detailAccentClassName}`}
            />
            <span>
              <span className={`font-semibold ${detailAccentClassName}`}>
                Club Members:
              </span>{" "}
              <span className="text-muted-foreground">{memberCount}</span>
            </span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
