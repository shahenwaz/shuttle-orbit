type PlayerInput = {
  id: string;
  name: string;
};

type GeneratedEntry = {
  sideKey: "A" | "B";
  player1Id: string;
  player2Id: string;
  displayName: string;
  entryOrder: number;
};

type GeneratedMatch = {
  entryAIndex: number;
  entryBIndex: number;
  matchOrder: number;
  roundLabel: string;
};

export function createDoublesEntries(
  sideKey: "A" | "B",
  players: PlayerInput[],
  startOrder = 1,
): GeneratedEntry[] {
  const entries: GeneratedEntry[] = [];

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const player1 = players[i];
      const player2 = players[j];

      entries.push({
        sideKey,
        player1Id: player1.id,
        player2Id: player2.id,
        displayName: `${player1.name} + ${player2.name}`,
        entryOrder: startOrder + entries.length,
      });
    }
  }

  return entries;
}

export function createTeamPairMatrixMatches(
  sideAEntryCount: number,
  sideBEntryCount: number,
): GeneratedMatch[] {
  const matches: GeneratedMatch[] = [];
  let matchOrder = 1;

  for (let a = 0; a < sideAEntryCount; a++) {
    for (let b = 0; b < sideBEntryCount; b++) {
      matches.push({
        entryAIndex: a,
        entryBIndex: b,
        matchOrder,
        roundLabel: `Round ${matchOrder}`,
      });

      matchOrder++;
    }
  }

  return matches;
}
