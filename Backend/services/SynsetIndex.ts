import fs from "fs/promises";
import path from "path";
import readline from "readline";
import { createReadStream } from "fs";

/**
 * Single-char pos → full synset type. Mirrors wordnet's internal map.
 */
const SYNSET_TYPE_MAP: Record<string, string> = {
  n: "noun",
  v: "verb",
  a: "adjective",
  s: "adjective satellite",
  r: "adverb",
};

interface ParsedWord {
  word: string;
  lexId: number;
}

interface ParsedPointer {
  pointerSymbol: string;
  synsetOffset: number;
  pos: string;
  sourceTargetHex: string;
}

export interface ParsedSynset {
  glossary: string;
  meta: {
    synsetOffset: number;
    lexFilenum: number;
    synsetType: string;
    wordCount: number;
    words: ParsedWord[];
    pointerCount: number;
    pointers: ParsedPointer[];
  };
}

export class SynsetIndex {
  private index = new Map<string, ParsedSynset>();
  private loaded = false;
  private loading: Promise<void> | null = null;

  /**
   * Reads all four WordNet data files into memory, keyed on
   * `${synsetOffset}.${posChar}` (e.g. "2084071.n").
   *
   * Safe to call concurrently — repeated calls share the same promise.
   */
  async load(dbDir: string): Promise<void> {
    if (this.loaded) return;
    if (this.loading) return this.loading;

    this.loading = (async () => {
      const exts = ["noun", "verb", "adj", "adv"];

      await Promise.all(
        exts.map(async (ext) => {
          const filePath = path.join(dbDir, `data.${ext}`);

          const rl = readline.createInterface({
            input: createReadStream(filePath, { encoding: "utf8" }),
            crlfDelay: Infinity,
          });

          for await (const line of rl) {
            if (!line || line.startsWith(" ")) continue;

            const parsed = parseDataLine(line);
            const key = `${parsed.meta.synsetOffset}.${posFromFullType(parsed.meta.synsetType)}`;
            this.index.set(key, parsed);
          }
        }),
      );

      this.loaded = true;
      this.loading = null;
    })();

    return this.loading;
  }

  /**
   * Resolves a synset by its offset and single-char pos.
   *
   * `posChar` is the one-letter form used in pointer records ("n", "v",
   * "a", "s", "r"). Internally the index key uses the same char.
   */
  get(offset: number, posChar: string): ParsedSynset | undefined {
    return this.index.get(`${offset}.${posChar}`);
  }

  get size(): number {
    return this.index.size;
  }
}

/**
 * Convert a full synset type (e.g. "noun") back to the one-char form used
 * in WordNet pointer records (e.g. "n"). Needed so the key we store under
 * matches the key we look up with, because pointers reference targets by
 * single-char pos.
 */
function posFromFullType(fullType: string): string {
  switch (fullType) {
    case "noun":
      return "n";
    case "verb":
      return "v";
    case "adjective":
      return "a";
    case "adjective satellite":
      return "s";
    case "adverb":
      return "r";
    default:
      return fullType;
  }
}

/**
 * Parses a single WordNet data line.
 *
 * Format:
 *   synset_offset lex_filenum ss_type w_cnt word lex_id [word lex_id...]
 *   p_cnt [ptr_symbol synset_offset pos sourceTargetHex]... | gloss
 *
 * Note: w_cnt and lex_id are hex; synset_offset (both top-level and pointer)
 * are decimal.
 */
function parseDataLine(line: string): ParsedSynset {
  const [metaPart, ...glossParts] = line.split("|");
  const glossary = glossParts.join("|").trim();
  const metadata = metaPart.trim().split(/\s+/);

  const [synsetOffsetRaw, lexFilenumRaw, synsetTypeRaw, ...parts] = metadata;

  const wordCount = parseInt(parts.shift()!, 16);
  const words: ParsedWord[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push({
      word: parts.shift()!,
      lexId: parseInt(parts.shift()!, 16),
    });
  }

  const pointerCount = parseInt(parts.shift()!, 10);
  const pointers: ParsedPointer[] = [];
  for (let i = 0; i < pointerCount; i++) {
    pointers.push({
      pointerSymbol: parts.shift()!,
      synsetOffset: parseInt(parts.shift()!, 10),
      pos: parts.shift()!,
      sourceTargetHex: parts.shift()!,
    });
  }

  // Any remaining tokens before the glossary are verb frames — not used here.

  return {
    glossary,
    meta: {
      synsetOffset: parseInt(synsetOffsetRaw, 10),
      lexFilenum: parseInt(lexFilenumRaw, 10),
      synsetType: SYNSET_TYPE_MAP[synsetTypeRaw] ?? synsetTypeRaw,
      wordCount,
      words,
      pointerCount,
      pointers,
    },
  };
}
