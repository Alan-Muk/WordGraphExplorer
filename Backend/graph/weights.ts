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