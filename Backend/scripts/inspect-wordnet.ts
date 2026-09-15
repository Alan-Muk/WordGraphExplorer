import wordnet from "wordnet";

async function main() {
  await wordnet.init();

  const results = await wordnet.lookup("word");

  console.dir(results[0], {
    depth: 5,
  });
}

main();
