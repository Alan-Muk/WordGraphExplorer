import fs from "fs/promises";
import path from "path";
import readline from "readline";
import { createReadStream } from "fs";

import { mapPointer } from "./wordnetRelations";
import type { RelationType } from "../models/Relations";

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

export interface ParsedRelation {
  type: RelationType;
  target: ParsedSynset;
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
  private rankMap = new Map<string, number>();
  private loaded = false;
  private loading: Promise<void> | null = null;

  async load(dbDir: string): Promise<void> {
    if (this.loaded) return;
    if (this.loading) return this.loading;

    this.loading = (async () => {
      const exts = ["noun", "verb", "adj", "adv"];

      // Load data files and index files in parallel per extension.
      await Promise.all(
        exts.map(async (ext) => {
          await Promise.all([
            this.loadDataFile(path.join(dbDir, `data.${ext}`)),
            this.loadIndexFile(path.join(dbDir, `index.${ext}`)),
          ]);
        }),
      );

      this.loaded = true;
      this.loading = null;
    })();

    return this.loading;
  }

  get(offset: number, posChar: string): ParsedSynset | undefined {
    return this.index.get(`${offset}.${posChar}`);
  }

  /**
   * Returns the tagsense count for a lemma in a given POS.
   *
   * Higher values indicate a more common sense in the tagged corpora.
   * Returns 0 if the lemma is unknown or untagged.
   *
   * `posChar` is the one-letter form used in WordNet index files:
   * "n" (noun), "v" (verb), "a" (adjective), "r" (adverb).
   */
  rank(lemma: string, posChar: string): number {
    return this.rankMap.get(`${lemma.toLowerCase()}.${posChar}`) ?? 0;
  }

  get size(): number {
    return this.index.size;
  }

  get rankSize(): number {
    return this.rankMap.size;
  }

  getRankStats(): { zero: number; nonZero: number; total: number } {
    let zero = 0;
    let nonZero = 0;
    for (const v of this.rankMap.values()) {
      if (v === 0) zero++;
      else nonZero++;
    }
    return { zero, nonZero, total: zero + nonZero };
  }

  private async loadDataFile(filePath: string): Promise<void> {
    const rl = readline.createInterface({
      input: createReadStream(filePath, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line || line.startsWith(" ")) continue;

      const parsed = parseDataLine(line);
      const key = `${parsed.meta.synsetOffset}.${posFromFullType(
        parsed.meta.synsetType,
      )}`;
      this.index.set(key, parsed);
    }
  }

  private async loadIndexFile(filePath: string): Promise<void> {
    const rl = readline.createInterface({
      input: createReadStream(filePath, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line || line.startsWith(" ")) continue;

      const parsed = parseIndexLine(line);
      if (!parsed) continue;

      const key = `${parsed.lemma}.${parsed.pos}`;
      this.rankMap.set(key, parsed.tagsenseCount);
    }
  }

  /**
   * Returns the outgoing relations of a synset by ID, with each target
   * resolved to a full ParsedSynset.
   *
   * The synset ID format is `<offset>.<fullType>` (e.g. "2084071.noun").
   * Returns an empty array if the synset or any target can't be resolved.
   */
  relations(synsetId: string): ParsedRelation[] {
    const parsed = this.parseSynsetId(synsetId);
    if (!parsed) return [];

    const synset = this.get(parsed.offset, parsed.posChar);
    if (!synset) return [];

    const result: ParsedRelation[] = [];

    for (const pointer of synset.meta.pointers) {
      const relationType = mapPointer(pointer.pointerSymbol);
      if (!relationType) continue;

      const target = this.get(pointer.synsetOffset, pointer.pos);
      if (!target) continue;

      result.push({
        type: relationType,
        target,
      });
    }

    return result;
  }

  private parseSynsetId(
    synsetId: string,
  ): { offset: number; posChar: string } | null {
    const dotIndex = synsetId.indexOf(".");
    if (dotIndex === -1) return null;

    const offsetStr = synsetId.slice(0, dotIndex);
    const fullType = synsetId.slice(dotIndex + 1);

    const offset = parseInt(offsetStr, 10);
    if (!Number.isFinite(offset)) return null;

    return { offset, posChar: posCharOf(fullType) };
  }
}

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
 * Parses one line of a WordNet data file.
 *
 * Format:
 *   synset_offset lex_filenum ss_type w_cnt word lex_id [word lex_id...]
 *   p_cnt [ptr_symbol synset_offset pos sourceTargetHex]... | gloss
 *
 * Note: w_cnt and lex_id are hex; synset_offset is decimal.
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

interface ParsedIndex {
  lemma: string;
  pos: string;
  tagsenseCount: number;
}

/**
 * Parses one line of a WordNet index file.
 *
 * Format:
 *   lemma pos synset_cnt p_cnt [ptr_symbol...] sense_cnt tagsense_cnt synset_offset [...]
 *
 * Only `lemma`, `pos`, and `tagsense_cnt` are extracted.
 */
function parseIndexLine(line: string): ParsedIndex | null {
  const parts = line.trim().split(/\s+/);
  if (parts.length < 8) return null;

  const lemma = parts[0];
  const pos = parts[1];
  const pointerCount = parseInt(parts[3], 10);

  // Skip past the pointer symbols (starting at index 4).
  const afterPointers = 4 + pointerCount;

  // Fields after pointers: sense_cnt, tagsense_cnt, synset_offset...
  const tagsenseCount = parseInt(parts[afterPointers + 1] ?? "0", 10);

  return { lemma, pos, tagsenseCount };
}

function posCharOf(fullType: string): string {
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
