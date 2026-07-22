export interface GraphNode {

  id: string;

  label: string;

  definition?: string;

}


export interface GraphEdge {

  source: string;

  target: string;

  label: string;

  weight: number;

}


export interface GraphResponse {

  word: string;

  nodes: GraphNode[];

  edges: GraphEdge[];

  stats: {

    nodes:number;

    edges:number;

  };

}