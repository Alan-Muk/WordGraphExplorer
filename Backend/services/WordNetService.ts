import wordnet from "wordnet";
import { Synset } from "../models/Synset";
import { mapPointer } from "./wordnetRelations";

let initialized = false;

async function ensureInitialized() {
  if (initialized) {
    return;
  }

  await wordnet.init();

  initialized = true;
}

export class WordNetService {

  async lookup(word: string): Promise<Synset[]> {

    await ensureInitialized();

    try {

      const definitions =
        await wordnet.lookup(word);

      return definitions.map((definition, index) => ({
        id: `${word}.${index}`,

        word,

        definition:
          definition.glossary,

        relations: []

      }));

    } catch {

      return [];

    }

  }


  async expand(
    word: string,
    depth = 2
  ): Promise<Synset[]> {

    await ensureInitialized();

    const visited = new Set<number>();

    const results: Synset[] = [];


    const walk = async (
      definition: any,
      level: number
    ): Promise<void> => {

      const offset =
        definition?.meta?.synsetOffset;


      if (
        offset === undefined ||
        visited.has(offset) ||
        level > depth
      ) {
        return;
      }


      visited.add(offset);


      const synsetId =
        `${offset}.${definition.meta.synsetType}`;


      const synset: Synset = {

        id: synsetId,

        word:
          definition.meta.words?.[0]?.word
          ?? word,

        definition:
          definition.glossary
          ?? "",

        relations: []

      };


      results.push(synset);


      const pointers =
        definition.meta?.pointers ?? [];


      for (const pointer of pointers) {

        const relation =
          mapPointer(
            pointer.pointerSymbol
          );


        if (!relation) {
          continue;
        }


        const target =
          pointer.data;


        if (!target?.meta) {
          continue;
        }


        const targetId =
          `${target.meta.synsetOffset}.${target.meta.synsetType}`;


        const targetNode: Synset = {

          id: targetId,

          word:
            target.meta.words?.[0]?.word
            ?? "",

          definition:
            target.glossary
            ?? "",

          relations: []

        };


        synset.relations.push({

          type: relation,

          target: targetNode

        });


        await walk(
          target,
          level + 1
        );

      }

    };


    const definitions =
      await wordnet.lookup(word);


    for (const definition of definitions) {

      await walk(
        definition,
        0
      );

    }


    return results;

  }

}