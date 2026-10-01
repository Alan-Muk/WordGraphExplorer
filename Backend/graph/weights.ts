import { RelationType } from "../models/Relations";

/**
 * Base weight per relation type. Lower = "cheaper" to traverse.
 * These are the semantic costs, before structural adjustments.
 */
export const RelationWeights: Record<RelationType, number> = {
  hypernym: 1,
  hyponym: 1,
  meronym: 2,
  holonym: 2,
  antonym: 3,
  unknown: 5,
};

/**
 * Combines the relation's semantic weight with a structural adjustment
 * based on the target's degree (number of outgoing edges).
 *
 * Formula: base × (1 + 1 / max(1, degree))
 *
 * A target with degree 0 or 1 costs 2× base.
 * A target with degree 2 costs 1.5× base.
 * A target with degree 10 costs 1.1× base.
 * As degree grows, the weight approaches the base.
 */
export function edgeWeight(type: RelationType, targetDegree: number): number {
  return relationWeight(type) * (1 + 1 / Math.max(1, targetDegree));
}

/**
 * Base weight for a relation type, before structural adjustment.
 */
export function relationWeight(type: RelationType): number {
  return RelationWeights[type] ?? RelationWeights.unknown;
}
