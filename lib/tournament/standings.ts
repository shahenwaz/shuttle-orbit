type TeamIdentity = {
  id: string;
  teamName: string | null;
  player1: {
    fullName: string;
  };
  player2: {
    fullName: string;
  };
};

type GroupMembership = {
  id: string;
  teamEntry: TeamIdentity;
};

type MatchSet = {
  setNumber: number;
  teamAScore: number;
  teamBScore: number;
};

type MatchItem = {
  id: string;
  status: string;
  teamAId: string;
  teamBId: string;
  winnerId: string | null;
  teamA: TeamIdentity;
  teamB: TeamIdentity;
  sets: MatchSet[];
};

export type StandingRow = {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifference: number;
};

function getDisplayTeamName(team: TeamIdentity) {
  return team.teamName ?? `${team.player1.fullName} / ${team.player2.fullName}`;
}

export function computeGroupStandings(
  memberships: GroupMembership[],
  matches: MatchItem[],
): StandingRow[] {
  const table = new Map<string, StandingRow>();

  for (const membership of memberships) {
    const team = membership.teamEntry;

    table.set(team.id, {
      teamId: team.id,
      teamName: getDisplayTeamName(team),
      played: 0,
      won: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDifference: 0,
    });
  }

  for (const match of matches) {
    if (match.status !== "completed") {
      continue;
    }

    const teamARow = table.get(match.teamAId);
    const teamBRow = table.get(match.teamBId);

    if (!teamARow || !teamBRow) {
      continue;
    }

    let teamATotal = 0;
    let teamBTotal = 0;

    for (const set of match.sets) {
      teamATotal += set.teamAScore;
      teamBTotal += set.teamBScore;
    }

    teamARow.played += 1;
    teamBRow.played += 1;

    teamARow.pointsFor += teamATotal;
    teamARow.pointsAgainst += teamBTotal;

    teamBRow.pointsFor += teamBTotal;
    teamBRow.pointsAgainst += teamATotal;

    if (match.winnerId === match.teamAId) {
      teamARow.won += 1;
      teamBRow.lost += 1;
    } else if (match.winnerId === match.teamBId) {
      teamBRow.won += 1;
      teamARow.lost += 1;
    }
  }

  const standings = Array.from(table.values()).map((row) => ({
    ...row,
    pointDifference: row.pointsFor - row.pointsAgainst,
  }));

  standings.sort((a, b) => {
    if (b.won !== a.won) return b.won - a.won;
    if (b.pointDifference !== a.pointDifference) {
      return b.pointDifference - a.pointDifference;
    }
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
    return a.teamName.localeCompare(b.teamName);
  });

  return standings;
}
