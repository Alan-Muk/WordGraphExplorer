// scripts/index-stats.ts
import { SynsetIndex } from "../services/SynsetIndex";

async function main() {
  const before = process.memoryUsage().heapUsed;
  const idx = new SynsetIndex();
  await idx.load("node_modules/wordnet/db");
  const after = process.memoryUsage().heapUsed;

  console.log("Synsets loaded:", idx.size);
  console.log("Ranks loaded:", idx.rankSize);
  console.log("Heap delta:", ((after - before) / 1024 / 1024).toFixed(1), "MB");
  console.log("Total heap:", (after / 1024 / 1024).toFixed(1), "MB");

  const rankStats = idx.getRankStats();
  console.log("Ranked lemmas:", rankStats.nonZero);
  console.log("Unranked lemmas:", rankStats.zero);
  console.log(
    "Rank coverage:",
    ((rankStats.nonZero / rankStats.total) * 100).toFixed(1) + "%",
  );
}

main();
