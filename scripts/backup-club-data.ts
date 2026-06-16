import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from your .env file.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const backup = {
    exportedAt: new Date().toISOString(),

    clubs: await prisma.club.findMany({
      orderBy: { createdAt: "asc" },
    }),

    players: await prisma.player.findMany({
      orderBy: { createdAt: "asc" },
    }),

    clubMembers: await prisma.clubMember.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        club: true,
        player: true,
      },
    }),

    clubSessions: await prisma.clubSession.findMany({
      orderBy: { startAt: "asc" },
      include: {
        club: true,
        attendance: {
          include: {
            member: {
              include: {
                player: true,
              },
            },
          },
        },
      },
    }),

    clubLeagues: await prisma.clubLeague.findMany({
      orderBy: { playedAt: "asc" },
      include: {
        club: true,
        sides: true,
        entries: {
          include: {
            player1: true,
            player2: true,
            side: true,
          },
        },
        matches: {
          include: {
            entryA: true,
            entryB: true,
            winnerEntry: true,
            sets: true,
          },
        },
        playerStats: {
          include: {
            player: true,
          },
        },
      },
    }),
  };

  const backupDir = path.join(process.cwd(), "backups");
  mkdirSync(backupDir, { recursive: true });

  const filePath = path.join(
    backupDir,
    `club-data-backup-${new Date().toISOString().replaceAll(":", "-")}.json`,
  );

  writeFileSync(filePath, JSON.stringify(backup, null, 2), "utf8");

  console.log(`Backup saved: ${filePath}`);
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
