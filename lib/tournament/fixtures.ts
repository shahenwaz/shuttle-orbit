type FixtureTeam = {
  id: string;
};

export type RoundRobinPairing = {
  teamAId: string;
  teamBId: string;
  roundLabel: string;
};

export function generateRoundRobinPairings(
  teams: FixtureTeam[],
): RoundRobinPairing[] {
  if (teams.length < 2) {
    return [];
  }

  const pairings: RoundRobinPairing[] = [];

  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      pairings.push({
        teamAId: teams[i].id,
        teamBId: teams[j].id,
        roundLabel: `Match ${pairings.length + 1}`,
      });
    }
  }

  return pairings;
}
