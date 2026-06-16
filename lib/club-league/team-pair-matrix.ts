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

type MatchWithPlayers = GeneratedMatch & {
  playerIds: string[];
  pairKeys: string[];
};

function createPairKey(player1Id: string, player2Id: string) {
  return [player1Id, player2Id].sort().join(":");
}

function getMatchPlayerIds(
  match: GeneratedMatch,
  sideAEntries: GeneratedEntry[],
  sideBEntries: GeneratedEntry[],
) {
  const entryA = sideAEntries[match.entryAIndex];
  const entryB = sideBEntries[match.entryBIndex];

  return [
    entryA.player1Id,
    entryA.player2Id,
    entryB.player1Id,
    entryB.player2Id,
  ];
}

function getMatchPairKeys(
  match: GeneratedMatch,
  sideAEntries: GeneratedEntry[],
  sideBEntries: GeneratedEntry[],
) {
  const entryA = sideAEntries[match.entryAIndex];
  const entryB = sideBEntries[match.entryBIndex];

  return [
    createPairKey(entryA.player1Id, entryA.player2Id),
    createPairKey(entryB.player1Id, entryB.player2Id),
  ];
}

function countSharedItems(itemsA: string[], itemsB: string[]) {
  const itemSet = new Set(itemsA);
  return itemsB.filter((item) => itemSet.has(item)).length;
}

function scoreCandidateMatch({
  candidate,
  previousMatch,
  twoMatchesAgo,
  playerAppearances,
  pairAppearances,
}: {
  candidate: MatchWithPlayers;
  previousMatch: MatchWithPlayers | null;
  twoMatchesAgo: MatchWithPlayers | null;
  playerAppearances: Map<string, number>;
  pairAppearances: Map<string, number>;
}) {
  let score = 0;

  if (previousMatch) {
    score +=
      countSharedItems(candidate.playerIds, previousMatch.playerIds) * 12;
    score += countSharedItems(candidate.pairKeys, previousMatch.pairKeys) * 8;
  }

  if (twoMatchesAgo) {
    score += countSharedItems(candidate.playerIds, twoMatchesAgo.playerIds) * 4;
    score += countSharedItems(candidate.pairKeys, twoMatchesAgo.pairKeys) * 3;
  }

  for (const playerId of candidate.playerIds) {
    score += (playerAppearances.get(playerId) ?? 0) * 2;
  }

  for (const pairKey of candidate.pairKeys) {
    score += pairAppearances.get(pairKey) ?? 0;
  }

  return score;
}

function reorderMatchesByPlayerRest(
  matches: GeneratedMatch[],
  sideAEntries: GeneratedEntry[],
  sideBEntries: GeneratedEntry[],
) {
  const remainingMatches: MatchWithPlayers[] = matches.map((match) => ({
    ...match,
    playerIds: getMatchPlayerIds(match, sideAEntries, sideBEntries),
    pairKeys: getMatchPairKeys(match, sideAEntries, sideBEntries),
  }));

  const orderedMatches: MatchWithPlayers[] = [];
  const playerAppearances = new Map<string, number>();
  const pairAppearances = new Map<string, number>();

  while (remainingMatches.length > 0) {
    const previousMatch = orderedMatches.at(-1) ?? null;
    const twoMatchesAgo = orderedMatches.at(-2) ?? null;

    const bestMatch = remainingMatches
      .map((candidate, index) => ({
        candidate,
        index,
        score: scoreCandidateMatch({
          candidate,
          previousMatch,
          twoMatchesAgo,
          playerAppearances,
          pairAppearances,
        }),
      }))
      .sort((a, b) => a.score - b.score || a.index - b.index)[0];

    const [selectedMatch] = remainingMatches.splice(bestMatch.index, 1);

    for (const playerId of selectedMatch.playerIds) {
      playerAppearances.set(
        playerId,
        (playerAppearances.get(playerId) ?? 0) + 1,
      );
    }

    for (const pairKey of selectedMatch.pairKeys) {
      pairAppearances.set(pairKey, (pairAppearances.get(pairKey) ?? 0) + 1);
    }

    orderedMatches.push(selectedMatch);
  }

  return orderedMatches.map((match, index) => ({
    entryAIndex: match.entryAIndex,
    entryBIndex: match.entryBIndex,
    matchOrder: index + 1,
    roundLabel: `Match ${index + 1}`,
  }));
}

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
  sideAEntries: GeneratedEntry[],
  sideBEntries: GeneratedEntry[],
): GeneratedMatch[] {
  const matches: GeneratedMatch[] = [];
  let matchOrder = 1;

  for (let a = 0; a < sideAEntries.length; a++) {
    for (let b = 0; b < sideBEntries.length; b++) {
      matches.push({
        entryAIndex: a,
        entryBIndex: b,
        matchOrder,
        roundLabel: `Match ${matchOrder}`,
      });

      matchOrder++;
    }
  }

  return reorderMatchesByPlayerRest(matches, sideAEntries, sideBEntries);
}
