export interface PathNode {
  id: string;
  label?: string;
  definition?: string;
}

export interface PathEdge {
  source: string;
  target: string;
  relation: string;
}

export interface PathResponse {
  start: string;
  end: string;
  distance: number | null;
  path: PathNode[];
  edges: PathEdge[];
}
