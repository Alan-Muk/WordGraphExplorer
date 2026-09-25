/**
 * Normalises user input into a form WordNet can match.
 *
 * - Lowercases for consistent lookups.
 * - Strips surrounding quotes (users often paste "dog" with quotes).
 * - Converts whitespace to underscores, since WordNet lemmas use
 *   underscores for multi-word concepts (e.g. "domestic_dog").
 * - Trims leading/trailing whitespace.
 */
export default function normalise(word: string): string {
  if (typeof word !== "string") {
    return "";
  }

  return word
    .toLowerCase()
    .replace(/^["']|["']$/g, "")
    .replace(/\s+/g, "_")
    .trim();
}
