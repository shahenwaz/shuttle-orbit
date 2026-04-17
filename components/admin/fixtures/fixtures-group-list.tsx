import { formatTeamName } from "@/lib/utils/format";

type MatchRow = {
  id: string;
  roundLabel: string | null;
  status: string;
  scoreSummary: string | null;
  teamA: {
    teamName: string | null;
    player1: {
      fullName: string;
      nickname: string;
    };
    player2: {
      fullName: string;
      nickname: string;
    };
  };
  teamB: {
    teamName: string | null;
    player1: {
      fullName: string;
      nickname: string;
    };
    player2: {
      fullName: string;
      nickname: string;
    };
  };
};

type GroupFixtureRow = {
  id: string;
  name: string;
  memberships: Array<{ id: string }>;
  matches: MatchRow[];
};

type FixturesGroupListProps = {
  groups: GroupFixtureRow[];
};

export function FixturesGroupList({ groups }: FixturesGroupListProps) {
  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No groups available yet. Create groups first before generating fixtures.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <div key={group.id} className="surface-panel p-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-foreground">
              {group.name}
            </h4>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
              {group.memberships.length} teams
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
              {group.matches.length} matches
            </span>
          </div>

          {group.matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No fixtures generated yet for this group.
            </p>
          ) : (
            <div className="grid gap-3">
              {group.matches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {match.roundLabel ?? "Match"}
                    </p>
                    <span className="rounded-full border border-white/10 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
                      {match.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-foreground">
                      {formatTeamName(
                        match.teamA.player1.fullName,
                        match.teamA.player2.fullName,
                        match.teamA.teamName,
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">vs</p>
                    <p className="text-sm text-foreground">
                      {formatTeamName(
                        match.teamB.player1.fullName,
                        match.teamB.player2.fullName,
                        match.teamB.teamName,
                      )}
                    </p>
                  </div>

                  {match.scoreSummary ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Score: {match.scoreSummary}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
