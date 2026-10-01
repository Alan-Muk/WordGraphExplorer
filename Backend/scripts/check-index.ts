import { SynsetIndex } from "../services/SynsetIndex";

async function main() {
  const idx = new SynsetIndex();
  await idx.load("node_modules/wordnet/db");

  console.log("synsets:", idx.size);
  console.log("ranks:", idx.rankSize);
  console.log("dog/n:", idx.rank("dog", "n"));
  console.log("canine/n:", idx.rank("canine", "n"));
  console.log("poodle/n:", idx.rank("poodle", "n"));
  console.log("run/v:", idx.rank("run", "v"));
  console.log("hot/a:", idx.rank("hot", "a"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
