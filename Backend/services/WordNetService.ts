import wordnet from "wordnet";
import { mapPointer } from "./wordnetRelations";
import { Synset, SynsetSummary } from "../models/Synset";
import { CacheService } from "./CacheService";
import { DEFAULT_DEPTH } from "../config";
import { SynsetIndex } from "./SynsetIndex";
import path from "path";
import { createRequire } from "module";

const synsetIndex = new SynsetIndex();
const wordnetPkgDir = path.dirname(require.resolve("wordnet/package.json"));
const wordnetDbDir = path.join(wordnetPkgDir, "db");

let initialized = false;
let initPromise: Promise<void> | null = null;

async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const require = createRequire(__filename);

    const wordnetDbDir = path.join(
      path.dirname(require.resolve("wordnet")),
      "..",
      "db",
    );

    await wordnet.init();
    await synsetIndex.load(wordnetDbDir);
    console.log(`[SynsetIndex] loaded ${synsetIndex.size} synsets`);

    initialized = true;
  })();

  return initPromise;
}

export class WordNetService {
  private expandCache = new CacheService<Synset[]>();
  private lookupCache = new CacheService<SynsetSummary[]>();

  async lookup(word: string): Promise<SynsetSummary[]> {
    await ensureInitialized();

    return this.lookupCache.get(word, async () => {
      try {
        const definitions = await wordnet.lookup(word);

        return definitions.map((definition) => ({
          id: `${definition.meta.synsetOffset}.${definition.meta.synsetType}`,
          word: definition.meta.words?.[0]?.word ?? word,
          pos: definition.meta.synsetType,
          definition: definition.glossary ?? "",
        }));
      } catch (err) {
        console.error(`WordNet lookup failed for "${word}":`, err);
        return [];
      }
    });
  }

  async expand(word: string, depth = DEFAULT_DEPTH): Promise<Synset[]> {
    await ensureInitialized();

    return this.expandCache.get(`${word}:${depth}`, async () => {
      let definitions;
      try {
        definitions = await wordnet.lookup(word);
      } catch (err) {
        console.error(`WordNet lookup failed for "${word}":`, err);
        return [];
      }

      if (!definitions || definitions.length === 0) {
        return [];
      }

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

          const target =
            pointer.data ?? synsetIndex.get(pointer.synsetOffset, pointer.pos);
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
    });
  }
}
