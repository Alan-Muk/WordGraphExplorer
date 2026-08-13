import { RelationType } from "../models/Relations";


export const RelationWeights: Record<RelationType, number> = {
  synonym: 1,
  hypernym: 1,
  hyponym: 1,
  meronym: 2,
  holonym: 2,
  antonym: 3,
  unknown: 5,
};


export function relationWeight(
  type: string
): number {

  return (
    RelationWeights[type as RelationType]
    ?? RelationWeights.unknown
  );

}

/*
 * Defines the weight assigned to each type of relationship in the graph.
 * Lower weights represent stronger or more closely related relationships.
 *
 * relationWeight() returns the configured weight for a given relation type
 * and falls back to the unknown relation weight when the type is not recognized.
 */
