import { RelationType } from "./Relations";


export interface Synset {

  id: string;

  word: string;

  pos: string;

  definition: string;

  relations: SynsetRelation[];

}

export interface SynsetRelation {
  type: RelationType;
  target: string;
}