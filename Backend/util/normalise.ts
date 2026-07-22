export default function normalise(word: string) {
  return word
    .toLowerCase()
    .replace(/^["']|["']$/g, "")
    .trim();
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
