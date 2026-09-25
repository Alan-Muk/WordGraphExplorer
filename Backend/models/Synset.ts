import { RelationType } from "./Relations";

export interface Synset {
  id: string;

  word: string;

  pos: string;

  definition: string;

  relations: SynsetRelation[];
}

export interface SynsetSummary {
  id: string;
  word: string;
  pos: string;
  definition: string;
}

export interface SynsetRelation {
  type: RelationType;
  target: Synset; // was: string
}
