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
  const sessions = await prisma.clubSession.findMany({
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
  });

  const summary = sessions.map((session) => ({
    title: session.title,
    club: session.club.name,
    startAt: session.startAt,
    endAt: session.endAt,
    courtNumbers: session.courtNumbers,
    status: session.status,
    visibility: session.visibility,
    publicNotes: session.publicNotes,
    privateNotes: session.privateNotes,
    costPerPlayer: session.costPerPlayer?.toString() ?? null,
    attendance: session.attendance.map((item) => ({
      status: item.status,
      note: item.note,
      name: item.member.player?.fullName ?? item.member.name,
      nickname: item.member.player?.nickname ?? item.member.nickname,
    })),
  }));

  const backupDir = path.join(process.cwd(), "backups");
  mkdirSync(backupDir, { recursive: true });

  const filePath = path.join(
    backupDir,
    `session-summary-${new Date().toISOString().replaceAll(":", "-")}.json`,
  );

  writeFileSync(filePath, JSON.stringify(summary, null, 2), "utf8");

  console.log(`Session summary saved: ${filePath}`);
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
