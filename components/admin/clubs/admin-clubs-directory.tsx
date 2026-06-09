import Link from "next/link";
import { Eye, EyeOff, Settings2, Shield } from "lucide-react";

import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { EmptyState } from "@/components/shared/empty-state";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { Button } from "@/components/ui/button";

type AdminClubRow = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  description: string | null;
  homeVenue: string | null;
  isPublic: boolean;
  _count: {
    members: number;
    sessions: number;
  };
};

type AdminClubsDirectoryProps = {
  clubs: AdminClubRow[];
};

export function AdminClubsDirectory({ clubs }: AdminClubsDirectoryProps) {
  if (clubs.length === 0) {
    return (
      <EmptyState message="No clubs created yet. Add your first club profile to start managing members and sessions." />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      {clubs.map((club) => {
        const VisibilityIcon = club.isPublic ? Eye : EyeOff;

        return (
          <div key={club.id} className="surface-card p-4 sm:p-5">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {club.name}
                    </h4>

                    {club.shortName ? (
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                        {club.shortName}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                    <div className="inline-flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5" />/{club.slug}
                    </div>

                    <div className="inline-flex items-center gap-1.5">
                      <VisibilityIcon className="h-3.5 w-3.5" />
                      {club.isPublic ? "Public profile" : "Private profile"}
                    </div>
                  </div>

                  {club.homeVenue ? (
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary/80">
                      {club.homeVenue}
                    </p>
                  ) : null}

                  {club.description ? (
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {club.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <CompactStatRow className="justify-start">
                <CompactStatPill label="Members" value={club._count.members} />
                <CompactStatPill
                  label="Sessions"
                  value={club._count.sessions}
                />
              </CompactStatRow>

              <div className="grid grid-cols-1 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                <Button
                  asChild
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "create",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link href={`/admin/clubs/${club.id}/edit`}>
                    <Settings2 className="mr-1 h-3.5 w-3.5" />
                    Manage
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "link",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link href={`/admin/clubs/${club.id}/edit`}>
                    Edit profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
