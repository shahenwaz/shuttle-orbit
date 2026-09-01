import { prisma } from "@/lib/db/prisma";

export async function getFeaturedTournament() {
  return prisma.tournament.findFirst({
    orderBy: {
      eventDate: "desc",
    },
    select: {
      name: true,
      slug: true,
      location: true,
      eventDate: true,
      description: true,
      categories: {
        orderBy: {
          code: "asc",
        },
        select: {
          id: true,
          code: true,
        },
      },
    },
  });
}

export async function getAllTournaments() {
  return prisma.tournament.findMany({
    orderBy: {
      eventDate: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      location: true,
      eventDate: true,
      categories: {
        orderBy: {
          code: "asc",
        },
        select: {
          id: true,
          code: true,
        },
      },
      _count: {
        select: {
          teamEntries: true,
          matches: true,
        },
      },
    },
  });
}

export async function getTournamentSitemapEntries() {
  return prisma.tournament.findMany({
    orderBy: {
      eventDate: "desc",
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}

export async function getTournamentCategorySitemapEntries() {
  return prisma.tournament.findMany({
    select: {
      slug: true,
      categories: {
        select: {
          code: true,
          updatedAt: true,
        },
      },
    },
  });
}

export async function getTournamentMetadataBySlug(slug: string) {
  return prisma.tournament.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
    },
  });
}

export async function getTournamentBySlug(slug: string) {
  return prisma.tournament.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      location: true,
      eventDate: true,
      description: true,
      categories: {
        orderBy: {
          code: "asc",
        },
        select: {
          id: true,
          name: true,
          code: true,
          stages: {
            select: {
              groups: {
                select: {
                  id: true,
                },
              },
            },
          },
          _count: {
            select: {
              teamEntries: true,
              matches: true,
            },
          },
        },
      },
      _count: {
        select: {
          teamEntries: true,
          matches: true,
        },
      },
    },
  });
}

export async function getCategoryMetadataByTournamentAndCode(
  tournamentSlug: string,
  categoryCode: string,
) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      slug: tournamentSlug,
    },
    select: {
      name: true,
      categories: {
        where: {
          code: categoryCode,
        },
        select: {
          name: true,
          rulesSummary: true,
        },
      },
    },
  });

  return {
    tournament,
    category: tournament?.categories[0] ?? null,
  };
}

export async function getCategoryOverviewByTournamentAndCode(
  tournamentSlug: string,
  categoryCode: string,
) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      slug: tournamentSlug,
    },
    select: {
      name: true,
      slug: true,
      categories: {
        where: {
          code: categoryCode,
        },
        select: {
          name: true,
          code: true,
          rulesSummary: true,
        },
      },
    },
  });

  return {
    tournament,
    category: tournament?.categories[0] ?? null,
  };
}

export async function getCategoryTeamsByTournamentAndCode(
  tournamentSlug: string,
  categoryCode: string,
) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      slug: tournamentSlug,
    },
    select: {
      name: true,
      slug: true,
      categories: {
        where: {
          code: categoryCode,
        },
        select: {
          name: true,
          code: true,
          rulesSummary: true,
          teamEntries: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              teamName: true,
              player1: {
                select: {
                  id: true,
                  fullName: true,
                  nickname: true,
                },
              },
              player2: {
                select: {
                  id: true,
                  fullName: true,
                  nickname: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    tournament,
    category: tournament?.categories[0] ?? null,
  };
}

export async function getCategoryByTournamentAndCode(
  tournamentSlug: string,
  categoryCode: string,
) {
  const tournament = await prisma.tournament.findUnique({
    where: { slug: tournamentSlug },
    select: {
      name: true,
      slug: true,
      categories: {
        where: {
          code: categoryCode,
        },
        select: {
          name: true,
          code: true,
          rulesSummary: true,
          stages: {
            orderBy: {
              stageOrder: "asc",
            },
            select: {
              id: true,
              name: true,
              stageType: true,
              stageOrder: true,
              groups: {
                orderBy: {
                  groupOrder: "asc",
                },
                select: {
                  id: true,
                  name: true,
                  memberships: {
                    select: {
                      teamEntry: {
                        select: {
                          id: true,
                          teamName: true,
                          player1: {
                            select: {
                              fullName: true,
                            },
                          },
                          player2: {
                            select: {
                              fullName: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              matches: {
                orderBy: [
                  {
                    scheduledAt: "asc",
                  },
                  {
                    createdAt: "asc",
                  },
                ],
                select: {
                  id: true,
                  groupId: true,
                  status: true,
                  roundLabel: true,
                  scoreSummary: true,
                  winnerId: true,
                  teamAId: true,
                  teamBId: true,
                  teamA: {
                    select: {
                      teamName: true,
                      player1: {
                        select: {
                          fullName: true,
                        },
                      },
                      player2: {
                        select: {
                          fullName: true,
                        },
                      },
                    },
                  },
                  teamB: {
                    select: {
                      teamName: true,
                      player1: {
                        select: {
                          fullName: true,
                        },
                      },
                      player2: {
                        select: {
                          fullName: true,
                        },
                      },
                    },
                  },
                  sets: {
                    orderBy: {
                      setNumber: "asc",
                    },
                    select: {
                      setNumber: true,
                      teamAScore: true,
                      teamBScore: true,
                    },
                  },
                },
              },
            },
          },
          teamEntries: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              teamName: true,
              player1: {
                select: {
                  id: true,
                  fullName: true,
                  nickname: true,
                },
              },
              player2: {
                select: {
                  id: true,
                  fullName: true,
                  nickname: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    tournament,
    category: tournament?.categories[0] ?? null,
  };
}

export async function getAdminDashboardStats() {
  const [tournamentCount, playerCount, matchCount, clubCount, leagueCount] =
    await Promise.all([
      prisma.tournament.count(),
      prisma.player.count(),
      prisma.match.count(),
      prisma.club.count(),
      prisma.league.count(),
    ]);

  return {
    tournamentCount,
    playerCount,
    matchCount,
    clubCount,
    leagueCount,
  };
}
