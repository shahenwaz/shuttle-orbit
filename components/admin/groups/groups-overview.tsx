import { formatTeamName } from "@/lib/utils/format";

type GroupMembershipRow = {
  id: string;
  teamEntry: {
    id: string;
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

type GroupRow = {
  id: string;
  name: string;
  groupOrder: number;
  memberships: GroupMembershipRow[];
};

type GroupsOverviewProps = {
  groups: GroupRow[];
};

export function GroupsOverview({ groups }: GroupsOverviewProps) {
  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No groups created yet. Add the first group for this category.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((group) => (
        <div key={group.id} className="surface-panel p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  {group.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Order {group.groupOrder}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">Teams</p>
                <p className="mt-1 text-base font-semibold">
                  {group.memberships.length}
                </p>
              </div>
            </div>

            {group.memberships.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No teams assigned yet.
              </p>
            ) : (
              <div className="space-y-2">
                {group.memberships.map((membership) => {
                  const team = membership.teamEntry;

                  return (
                    <div
                      key={membership.id}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                    >
                      <p className="font-medium text-foreground">
                        {formatTeamName(
                          team.player1.fullName,
                          team.player2.fullName,
                          team.teamName,
                        )}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        @{team.player1.nickname} · @{team.player2.nickname}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
