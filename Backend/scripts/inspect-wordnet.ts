import wordnet from "wordnet";

async function main() {
  await wordnet.init();

  const results = await wordnet.lookup("dog");

  console.dir(results[0], {
    depth: 5,
  });
}

main();
