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

const cGroupPlayers = [
  { fullName: "MOKSHUD CHOWDHURY", nickname: "mokshud" },
  { fullName: "ABDUR RAHIM BHUIYAN", nickname: "rahim" },
  { fullName: "AHMED NAZIR", nickname: "nazir" },
  { fullName: "SAIFUL ISLAM", nickname: "saiful" },
  { fullName: "RAHIB AHMED", nickname: "rahib" },
  { fullName: "TUFAYEL AHMED", nickname: "tufayel" },
  { fullName: "MD ZAKARIA AHMAD", nickname: "zakaria" },
  { fullName: "NAHID ISLAM", nickname: "nahid" },
  { fullName: "MD AKHTHER HUSSAIN", nickname: "akhther" },
  { fullName: "ABDUL AZIM TOWHID", nickname: "towhid" },
  { fullName: "WAHIDUL ALAM MURAD", nickname: "murad" },
  { fullName: "GOLAM MORSHED KAMRUL", nickname: "kamrul" },
  { fullName: "RAFIQUL ISLAM", nickname: "rafiqul" },
  { fullName: "MUNWAR HOSSAIN RONY", nickname: "rony" },
  { fullName: "QAMRUZZAMAN", nickname: "qamrul" },
  { fullName: "MANIK MONIRUZZAMAN", nickname: "manik" },
  { fullName: "MD SHARIA HOSSAIN ANIK", nickname: "anik" },
  { fullName: "MD SHAMIM MIAH", nickname: "shamim" },
  { fullName: "JAKIR HUSAIN JABUL", nickname: "jakir-jabul" },
  { fullName: "JAKIR HUSSAIN", nickname: "jakir-hussain" },
  { fullName: "SHAH ALAM", nickname: "shahalam" },
  { fullName: "SOWKAT ALI KHAN", nickname: "sowkat" },
  { fullName: "SALIM JAIGIRDAR", nickname: "salim" },
  { fullName: "KUHINUR RAHMAN", nickname: "kuhinur" },
];

async function main() {
  await prisma.player.createMany({
    data: cGroupPlayers,
    skipDuplicates: true,
  });

  console.log("C Group players seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
