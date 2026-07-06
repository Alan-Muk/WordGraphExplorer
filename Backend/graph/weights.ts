export const EDGE_WEIGHT: Record<string, number> = {
  IsA: 1,
  UsedFor: 2,
  CapableOf: 2,
  HasProperty: 2,
  PartOf: 3,
  Causes: 3,
  RelatedTo: 5
};

export function getWeight(rel: string) {
  return EDGE_WEIGHT[rel] ?? 10;
}

/**
 * Returns the weight associated with a relationship type.
 *
 * Looks up the predefined weight for the given relationship. If the
 * relationship type is not defined in `EDGE_WEIGHT`, a default weight
 * of `10` is returned.
 *
 * @param rel - The relationship type (e.g., "IsA", "PartOf").
 * @returns The numeric weight assigned to the relationship.
 *
 * @example
 * getWeight("IsA");       // 1
 * getWeight("RelatedTo"); // 5
 * getWeight("Unknown");   // 10
 */
