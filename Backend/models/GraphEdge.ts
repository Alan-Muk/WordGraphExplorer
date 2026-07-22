import { RelationType } from "./Relations";

export interface GraphEdge {

  source: string;

  target: string;

  relation: RelationType;

  weight: number;

}