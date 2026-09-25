import { WordNetService } from "./WordNetService";
import { GraphBuilder } from "../engine/GraphBuilder";
import { Graph } from "../engine/Graph";
import { dijkstra } from "../engine/Dijkstra";
import { findNodeByLabel } from "../util/findNodeByLabel";
import { NotFoundError } from "../util/errors";
import { DEFAULT_DEPTH } from "../config";
import {
  GroupedGraph,
  GroupedNode,
  RelationGroup,
} from "../models/GroupedGraph";
import type { RelationType } from "../models/Relations";

export interface PathNode {
  id: string;
  label?: string;
  definition?: string;
}

export interface PathResult {
  start: string;
  end: string;
  distance: number | null;
  path: PathNode[];
}

export class SemanticGraphService {
  private wordnet: WordNetService;
  private builder: GraphBuilder;

  constructor() {
    this.wordnet = new WordNetService();
    this.builder = new GraphBuilder();
  }

  async build(word: string, depth = DEFAULT_DEPTH): Promise<Graph> {
    const synsets = await this.wordnet.expand(word, depth);

    if (synsets.length === 0) {
      throw new NotFoundError(`No WordNet entry for "${word}"`);
    }

    return this.builder.build(synsets);
  }

  async path(start: string, end: string, depth = 5): Promise<PathResult> {
    const graph = await this.build(start, depth);

    const startNode = findNodeByLabel(graph, start);
    const endNode = findNodeByLabel(graph, end);

    if (!startNode || !endNode) {
      return { start, end, distance: null, path: [] };
    }

    const result = dijkstra(graph, startNode.id, endNode.id);

    if (result.distance === Infinity || result.path.length === 0) {
      return { start, end, distance: null, path: [] };
    }

    return {
      start,
      end,
      distance: result.distance,
      path: result.path.map((id) => {
        const node = graph.getNode(id);
        return {
          id,
          label: node?.label,
          definition: node?.definition,
        };
      }),
    };
  }

  async grouped(word: string, limit = 30): Promise<GroupedGraph> {
    const graph = await this.build(word, 1);

    const lower = word.toLowerCase();
    const nodes = graph.getNodes();
    const rootNode =
      nodes.find((n) => n.label.toLowerCase() === lower) ?? nodes[0];

    if (!rootNode) {
      throw new NotFoundError(`No graph for "${word}"`);
    }

    // Compute total degree (in + out) for every node in one pass.
    const degree = new Map<string, number>();
    for (const edge of graph.getEdges()) {
      degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
      degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
    }

    const root: GroupedNode = {
      id: rootNode.id,
      label: rootNode.label,
      definition: rootNode.definition,
    };

    const byRelation = new Map<RelationType, GroupedNode[]>();

    for (const edge of graph.getNeighbors(rootNode.id)) {
      const target = graph.getNode(edge.target);
      if (!target) continue;

      const bucket = byRelation.get(edge.label as RelationType) ?? [];
      bucket.push({
        id: target.id,
        label: target.label,
        definition: target.definition,
      });
      byRelation.set(edge.label as RelationType, bucket);
    }

    const ORDER: RelationType[] = [
      "hypernym",
      "hyponym",
      "meronym",
      "holonym",
      "antonym",
      "unknown",
    ];

    const groups: RelationGroup[] = [...byRelation.entries()]
      .map(([relation, bucket]) => {
        const sorted = bucket.slice().sort((a, b) => {
          const da = degree.get(a.id) ?? 0;
          const db = degree.get(b.id) ?? 0;
          if (db !== da) return db - da;
          return a.label.localeCompare(b.label);
        });

        return {
          relation,
          total: sorted.length,
          nodes: sorted.slice(0, limit),
        };
      })
      .sort((a, b) => ORDER.indexOf(a.relation) - ORDER.indexOf(b.relation));

    return { word, root, groups };
  }
}
