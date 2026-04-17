import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["warn", "error"],
});

async function main() {
  await prisma.matchSet.deleteMany();
  await prisma.match.deleteMany();
  await prisma.groupMembership.deleteMany();
  await prisma.group.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.teamEntry.deleteMany();
  await prisma.playerTournamentStat.deleteMany();
  await prisma.rankingLedger.deleteMany();
  await prisma.tournamentCategory.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.player.deleteMany();

  const players = await prisma.$transaction([
    prisma.player.create({
      data: { fullName: "Shahenwaz Muzahid", nickname: "Shahenwaz" },
    }),
    prisma.player.create({
      data: { fullName: "Rafi Islam", nickname: "Rafi" },
    }),
    prisma.player.create({
      data: { fullName: "Siam Hossain", nickname: "Siam" },
    }),
    prisma.player.create({
      data: { fullName: "Nabil Ahmed", nickname: "Nabil" },
    }),
    prisma.player.create({
      data: { fullName: "Tahmid Hasan", nickname: "Tahmid" },
    }),
    prisma.player.create({
      data: { fullName: "Rakib Chowdhury", nickname: "Rakib" },
    }),
    prisma.player.create({
      data: { fullName: "Imran Kabir", nickname: "Imran" },
    }),
    prisma.player.create({
      data: { fullName: "Fahim Rahman", nickname: "Fahim" },
    }),
  ]);

  const tournament = await prisma.tournament.create({
    data: {
      name: "Dublin Community Badminton Cup",
      slug: "dublin-community-badminton-cup-apr-2026",
      location: "Dublin",
      startDate: new Date("2026-04-21T10:00:00.000Z"),
      status: "upcoming",
      description: "Community badminton tournament for Group B and Group C.",
    },
  });

  const categoryB = await prisma.tournamentCategory.create({
    data: {
      tournamentId: tournament.id,
      name: "Group B",
      code: "B",
      rulesSummary: "Round robin groups, one set to 21, top teams qualify.",
      status: "published",
    },
  });

  const groupStage = await prisma.stage.create({
    data: {
      categoryId: categoryB.id,
      name: "Group Stage",
      stageType: "round_robin",
      stageOrder: 1,
      configJson: {
        pointsToWin: 21,
        qualifiersPerGroup: 2,
        tieBreakers: ["wins", "pointDifference", "headToHead"],
      },
    },
  });

  const groupB1 = await prisma.group.create({
    data: {
      stageId: groupStage.id,
      name: "B1",
      groupOrder: 1,
    },
  });

  const team1 = await prisma.teamEntry.create({
    data: {
      tournamentId: tournament.id,
      categoryId: categoryB.id,
      player1Id: players[0].id,
      player2Id: players[1].id,
      teamName: "Thunder Smash",
    },
  });

  const team2 = await prisma.teamEntry.create({
    data: {
      tournamentId: tournament.id,
      categoryId: categoryB.id,
      player1Id: players[2].id,
      player2Id: players[3].id,
      teamName: "Net Raiders",
    },
  });

  await prisma.groupMembership.createMany({
    data: [
      { groupId: groupB1.id, teamEntryId: team1.id },
      { groupId: groupB1.id, teamEntryId: team2.id },
    ],
  });

  const match = await prisma.match.create({
    data: {
      tournamentId: tournament.id,
      categoryId: categoryB.id,
      stageId: groupStage.id,
      groupId: groupB1.id,
      roundLabel: "Match 1",
      teamAId: team1.id,
      teamBId: team2.id,
      winnerId: team1.id,
      status: "completed",
      scoreSummary: "21-16",
    },
  });

  await prisma.matchSet.create({
    data: {
      matchId: match.id,
      setNumber: 1,
      teamAScore: 21,
      teamBScore: 16,
    },
  });

  console.log("Seed data inserted successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
