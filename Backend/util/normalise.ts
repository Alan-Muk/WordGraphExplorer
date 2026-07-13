export function normalize(word: string) {
  return word
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

/* --------------------------------------------------------------------------
 * End of normalization utility
 *
 * Function summary:
 * - Removes leading and trailing whitespace.
 * - Converts text to lowercase for consistent processing.
 * - Replaces spaces with underscores to match ConceptNet's
 *   expected word format.
 *
 * -------------------------------------------------------------------------- */
