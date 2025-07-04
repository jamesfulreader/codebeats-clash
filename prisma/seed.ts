import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

async function main() {
  const themes = [
    { name: "Lofi", description: "Chill beats laid back" },
    { name: "House", description: "dance floor vibes" },
    { name: "Hip Hop", description: "Rhythmic and lyrical" },
    { name: "Techno", description: "Electronic and energetic" },
  ];

  for (const t of themes) {
    await prisma.moodWave.upsert({
      where: { name: t.name },
      update: {},
      create: t,
    });
  }

  console.log("Seeded MoodWaves 🌊");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
