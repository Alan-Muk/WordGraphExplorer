import { WordNetService } from "./WordNetService";
import { GraphBuilder } from "../engine/GraphBuilder";
import { Graph } from "../engine/Graph";
import { findNodeByLabel } from "../util/findNodeByLabel";
import { NotFoundError } from "../util/errors";
import { DEFAULT_DEPTH } from "../config";
import { dijkstra } from "../engine/Dijkstra";
import { bfs } from "../engine/BFS";
import {
  GroupedGraph,
  GroupedNode,
  RelationGroup,
} from "../models/GroupedGraph";
import type { RelationType } from "../models/Relations";
import { Synset, SynsetSummary, SynsetRelation } from "../models/Synset";

import type { GraphTree, TreeNode, TreeEdge } from "../models/GraphTree";
import type { PathResponse } from "../models/PathResponse";

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

  async path(
    start: string,
    end: string,
    depth = 5,
    algorithm: "dijkstra" | "bfs" = "dijkstra",
  ): Promise<PathResponse> {
    const graph = await this.build(start, depth);

    const startNode = findNodeByLabel(graph, start);
    const endNode = findNodeByLabel(graph, end);

    if (!startNode || !endNode) {
      return { start, end, distance: null, path: [], edges: [] };
    }

    const result =
      algorithm === "bfs"
        ? bfs(graph, startNode.id, endNode.id)
        : dijkstra(graph, startNode.id, endNode.id);

    if (result.distance === Infinity || result.path.length === 0) {
      return { start, end, distance: null, path: [], edges: [] };
    }

    return {
      start,
      end,
      distance: result.distance,
      path: result.path.map((id) => {
        const node = graph.getNode(id);
        return { id, label: node?.label, definition: node?.definition };
      }),
      edges: result.path.slice(0, -1).map((fromId, i) => {
        const toId = result.path[i + 1];
        const edge = graph.getNeighbors(fromId).find((e) => e.target === toId);
        return {
          source: fromId,
          target: toId,
          relation: edge?.label ?? "unknown",
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

    // Total degree (in + out) for every node, computed in one pass.
    const degree = new Map<string, number>();
    for (const edge of graph.getEdges()) {
      degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
      degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
    }

    const rankOf = (id: string, label: string): number => {
      const posChar = posCharOf(id);
      return this.wordnet.rank(label, posChar);
    };

    const root: GroupedNode = {
      id: rootNode.id,
      label: rootNode.label,
      definition: rootNode.definition,
      rank: rankOf(rootNode.id, rootNode.label),
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
        rank: rankOf(target.id, target.label),
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
        // Sort the full group by degree (desc), then label (asc).
        const sorted = bucket.slice().sort((a, b) => {
          const da = degree.get(a.id) ?? 0;
          const db = degree.get(b.id) ?? 0;
          if (db !== da) return db - da;
          return a.label.localeCompare(b.label);
        });

        // Pick the "top" node by rank (desc), falling back to degree
        // (desc) and then label when ranks tie (which is common —
        // most synsets are untagged and have rank 0).
        const top = bucket.slice().sort((a, b) => {
          if (b.rank !== a.rank) return b.rank - a.rank;
          const da = degree.get(a.id) ?? 0;
          const db = degree.get(b.id) ?? 0;
          if (db !== da) return db - da;
          return a.label.localeCompare(b.label);
        })[0];

        return {
          relation,
          total: sorted.length,
          top,
          nodes: sorted.slice(0, limit),
        };
      })
      .sort((a, b) => ORDER.indexOf(a.relation) - ORDER.indexOf(b.relation));

    return { word, root, groups };
  }

  async tree(word: string, depth = 4): Promise<GraphTree> {
    if (depth < 0) depth = 0;

    const graph = await this.build(word, 1);

    const lower = word.toLowerCase();
    const nodes = graph.getNodes();
    const rootNode =
      nodes.find((n) => n.label.toLowerCase() === lower) ?? nodes[0];

    if (!rootNode) {
      throw new NotFoundError(`No graph for "${word}"`);
    }

    const visited = new Set<string>();
    const resultNodes: TreeNode[] = [];
    const resultEdges: TreeEdge[] = [];

    const root: TreeNode = {
      id: rootNode.id,
      label: rootNode.label,
      definition: rootNode.definition,
      rank: this.rankOf(rootNode.id, rootNode.label),
      layer: 0,
    };

    visited.add(root.id);
    resultNodes.push(root);

    const walk = async (parent: TreeNode, level: number): Promise<void> => {
      if (level >= depth) return;

      const relations = await this.wordnet.relations(parent.id);
      const picks = this.topChildPerRelation(relations);

      for (const { relation, child } of picks) {
        if (visited.has(child.id)) continue;

        const childNode: TreeNode = {
          id: child.id,
          label: child.label,
          definition: child.definition,
          rank: child.rank,
          layer: level + 1,
        };

        visited.add(child.id);
        resultNodes.push(childNode);
        resultEdges.push({
          source: parent.id,
          target: child.id,
          relation,
        });

        await walk(childNode, level + 1);
      }
    };

    await walk(root, 0);

    return {
      word,
      root,
      nodes: resultNodes,
      edges: resultEdges,
    };
  }

  private rankOf(id: string, label: string): number {
    const posChar = posCharOf(id);
    return this.wordnet.rank(label, posChar);
  }

  private topChildPerRelation(
    relations: SynsetRelation[],
  ): { relation: RelationType; child: GroupedNode }[] {
    const byRelation = new Map<RelationType, GroupedNode[]>();

    for (const rel of relations) {
      const bucket = byRelation.get(rel.type) ?? [];
      bucket.push({
        id: rel.target.id,
        label: rel.target.word,
        definition: rel.target.definition,
        rank: this.rankOf(rel.target.id, rel.target.word),
      });
      byRelation.set(rel.type, bucket);
    }

    const picks: { relation: RelationType; child: GroupedNode }[] = [];

    for (const [relation, bucket] of byRelation.entries()) {
      const top = bucket.slice().sort((a, b) => {
        if (b.rank !== a.rank) return b.rank - a.rank;
        return a.label.localeCompare(b.label);
      })[0];

      if (top) picks.push({ relation, child: top });
    }

    return picks;
  }
}

/**
 * Converts a synset ID's trailing type ("noun", "verb", "adjective",
 * "adjective satellite", "adverb") to the one-char pos used in WordNet
 * index files ("n", "v", "a", "s", "r").
 */
function posCharOf(synsetId: string): string {
  const full = synsetId.split(".").pop() ?? "";
  switch (full) {
    case "noun":
      return "n";
    case "verb":
      return "v";
    case "adjective":
      return "a";
    case "adjective satellite":
      return "s";
    case "adverb":
      return "r";
    default:
      return full;
  }
}
