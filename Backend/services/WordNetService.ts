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
    let definitions;
    try {
      definitions = await wordnet.lookup(word);
      return definitions.map((definition) => ({
        id: `${definition.meta.synsetOffset}.${definition.meta.synsetType}`,
        word: definition.meta.words?.[0]?.word ?? word,
        pos: definition.meta.synsetType,
        definition: definition.glossary ?? "",
        relations: [],
      }));
    } catch (err) {
      console.error(`WordNet lookup failed for "${word}":`, err);
      return [];
    }
  }

  async expand(word: string, depth = 5): Promise<Synset[]> {
    await ensureInitialized();

    let definitions;
    try {
      definitions = await wordnet.lookup(word);
    } catch (err) {
      console.error(`WordNet lookup failed for "${word}":`, err);
      return [];
    }

    if (!definitions || definitions.length === 0) return [];

    const visited = new Set<string>();
    const results: Synset[] = [];

    const walk = async (definition: any, level: number): Promise<void> => {
      const offset = definition?.meta?.synsetOffset;
      const type = definition?.meta?.synsetType;
      if (offset === undefined || type === undefined) return;

      const synsetId = `${offset}.${type}`;
      if (visited.has(synsetId) || level > depth) return;
      visited.add(synsetId);

      const synset: Synset = {
        id: synsetId,
        word: definition.meta.words?.[0]?.word ?? word,
        pos: type,
        definition: definition.glossary ?? "",
        relations: [],
      };
      results.push(synset);

      const pointers = definition.meta?.pointers ?? [];
      for (const pointer of pointers) {
        const relation = mapPointer(pointer.pointerSymbol);
        if (!relation) continue;

        const target = pointer.data;
        if (!target?.meta) continue;

        const targetOffset = target.meta.synsetOffset;
        const targetType = target.meta.synsetType;
        const targetId = `${targetOffset}.${targetType}`;

        synset.relations.push({
          type: relation,
          target: {
            id: targetId,
            word: target.meta.words?.[0]?.word ?? "",
            pos: targetType,
            definition: target.glossary ?? "",
            relations: [],
          },
        });

        await walk(target, level + 1);
      }
    };

    for (const definition of definitions) {
      await walk(definition, 0);
    }

    return results;
  }
}
