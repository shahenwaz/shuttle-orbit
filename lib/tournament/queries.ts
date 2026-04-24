import { prisma } from "@/lib/db/prisma";

export async function getFeaturedTournament() {
  return prisma.tournament.findFirst({
    orderBy: {
      eventDate: "asc",
    },
    include: {
      categories: {
        orderBy: {
          code: "asc",
        },
      },
    },
  });
}

export async function getAllTournaments() {
  return prisma.tournament.findMany({
    orderBy: {
      eventDate: "asc",
    },
    include: {
      categories: {
        orderBy: {
          code: "asc",
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

export async function getTournamentBySlug(slug: string) {
  return prisma.tournament.findUnique({
    where: { slug },
    include: {
      categories: {
        orderBy: {
          code: "asc",
        },
        include: {
          stages: {
            orderBy: {
              stageOrder: "asc",
            },
            include: {
              groups: {
                orderBy: {
                  groupOrder: "asc",
                },
                include: {
                  memberships: {
                    include: {
                      teamEntry: {
                        include: {
                          player1: true,
                          player2: true,
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
                include: {
                  teamA: {
                    include: {
                      player1: true,
                      player2: true,
                    },
                  },
                  teamB: {
                    include: {
                      player1: true,
                      player2: true,
                    },
                  },
                  winner: {
                    include: {
                      player1: true,
                      player2: true,
                    },
                  },
                  sets: {
                    orderBy: {
                      setNumber: "asc",
                    },
                  },
                },
              },
            },
          },
          teamEntries: {
            include: {
              player1: true,
              player2: true,
            },
            orderBy: {
              createdAt: "asc",
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

export async function getCategoryByTournamentAndCode(
  tournamentSlug: string,
  categoryCode: string,
) {
  const tournament = await prisma.tournament.findUnique({
    where: { slug: tournamentSlug },
    include: {
      categories: {
        where: {
          code: categoryCode,
        },
        include: {
          stages: {
            orderBy: {
              stageOrder: "asc",
            },
            include: {
              groups: {
                orderBy: {
                  groupOrder: "asc",
                },
                include: {
                  memberships: {
                    include: {
                      teamEntry: {
                        include: {
                          player1: true,
                          player2: true,
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
                include: {
                  teamA: {
                    include: {
                      player1: true,
                      player2: true,
                    },
                  },
                  teamB: {
                    include: {
                      player1: true,
                      player2: true,
                    },
                  },
                  winner: {
                    include: {
                      player1: true,
                      player2: true,
                    },
                  },
                  sets: {
                    orderBy: {
                      setNumber: "asc",
                    },
                  },
                },
              },
            },
          },
          teamEntries: {
            include: {
              player1: true,
              player2: true,
            },
            orderBy: {
              createdAt: "asc",
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
  const [tournamentCount, playerCount, teamCount, matchCount] =
    await Promise.all([
      prisma.tournament.count(),
      prisma.player.count(),
      prisma.teamEntry.count(),
      prisma.match.count(),
    ]);

  return {
    tournamentCount,
    playerCount,
    teamCount,
    matchCount,
  };
}
