export type RelationType =
  | "hypernym"
  | "hyponym"
  | "meronym"
  | "holonym"
  | "antonym"
  | "unknown";


export interface Relation {
  type: RelationType;
  target: string;
}