import { RelationType } from "../models/Relations";

/**
 * Returns the inverse relationship type.
 *
 * When GraphBuilder adds a reverse edge, it labels it with the inverse so
 * the direction is semantically correct. For example, if "dog" has a
 * "hypernym" edge to "animal", then "animal" should have a "hyponym" edge
 * back to "dog" — not another "hypernym" edge.
 *
 * Symmetric relations (antonym) map to themselves. Unknown types pass
 * through unchanged.
 */
export function inverseRelation(type: RelationType): RelationType {
  switch (type) {
    case "hypernym":
      return "hyponym";
    case "hyponym":
      return "hypernym";
    case "meronym":
      return "holonym";
    case "holonym":
      return "meronym";
    case "antonym":
      return "antonym";
    default:
      return type;
  }
}
