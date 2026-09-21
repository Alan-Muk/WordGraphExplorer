import { RelationType } from "./Relations";

export interface GraphEdge {
  source: string;
  target: string;
  label: RelationType;
  weight: number;
}
