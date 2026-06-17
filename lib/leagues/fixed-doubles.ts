export type FixedDoublesMatch = {
  teamAIndex: number;
  teamBIndex: number;
  matchOrder: number;
  roundLabel: string;
};

export function createFixedDoublesMatches(teamCount: number) {
  const matches: FixedDoublesMatch[] = [];
  let matchOrder = 1;

  for (let teamAIndex = 0; teamAIndex < teamCount; teamAIndex += 1) {
    for (
      let teamBIndex = teamAIndex + 1;
      teamBIndex < teamCount;
      teamBIndex += 1
    ) {
      matches.push({
        teamAIndex,
        teamBIndex,
        matchOrder,
        roundLabel: `Match ${matchOrder}`,
      });

      matchOrder += 1;
    }
  }

  return matches;
}
