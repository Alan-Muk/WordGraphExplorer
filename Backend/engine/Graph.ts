import { GraphEdge } from "../models/GraphEdge";

export interface GraphNode {
    id: string;
    label: string;
    definition?: string;
}


export class Graph {

    private nodes = new Map<string, GraphNode>();
    private adjacency = new Map<string, GraphEdge[]>();


    addNode(node: GraphNode) {

        if (!this.nodes.has(node.id)) {

            this.nodes.set(
                node.id,
                node
            );

            this.adjacency.set(
                node.id,
                []
            );

        }

    }


    addEdge(edge: GraphEdge) {

        if (!this.adjacency.has(edge.source)) {

            this.adjacency.set(
                edge.source,
                []
            );

        }


        const exists =
            this.adjacency
                .get(edge.source)!
                .some(existing =>
                    existing.target === edge.target &&
                    existing.label === edge.label
                );


        if (!exists) {

            this.adjacency
                .get(edge.source)!
                .push(edge);

        }

    }


    getNode(id: string) {

        return this.nodes.get(id);

    }


    getNeighbors(id: string): GraphEdge[] {

        return this.adjacency.get(id) ?? [];

    }


    getNodes() {

        return [
            ...this.nodes.values()
        ];

    }


    getEdges(): GraphEdge[] {

        const edges: GraphEdge[] = [];


        for (const list of this.adjacency.values()) {

            edges.push(
                ...list
            );

        }


        return edges;

    }


    getAdjacency() {

        return this.adjacency;

    }


    toJSON() {

        return {

            nodes:
                this.getNodes(),

            edges:
                this.getEdges()

        };

    }

    getStats() {

    return {
        nodes: this.nodes.size,
        edges: this.getEdges().length
        };

    }

}

/*
 * -----------------------------------------------------------------------------
 * Graph Class
 * -----------------------------------------------------------------------------
 * This class represents a directed graph using an adjacency list. It provides
 * methods for adding nodes and edges, retrieving graph data, exporting the
 * graph, and obtaining basic statistics.
 *
 * Features:
 * - Stores nodes in a Map for fast lookup by ID.
 * - Stores outgoing edges for each node using an adjacency list.
 * - Prevents duplicate edges with the same source, target, and label.
 * - Supports efficient retrieval of neighbors for graph traversal algorithms.
 * - Can serialize the graph into a JSON-friendly format.
 *
 * Main Methods:
 * - addNode()      : Adds a node if it does not already exist.
 * - addEdge()      : Adds a directed edge while preventing duplicates.
 * - getNode()      : Retrieves a node by its ID.
 * - getNeighbors() : Returns all outgoing edges from a node.
 * - getNodes()     : Returns all nodes in the graph.
 * - getEdges()     : Returns a flattened list of all edges.
 * - getAdjacency() : Returns the internal adjacency list.
 * - toJSON()       : Exports the graph as an object containing nodes and edges.
 * - getStats()     : Returns the total number of nodes and edges.
 *
 * Data Structure:
 * - Nodes are stored in a Map<string, GraphNode>.
 * - Edges are stored in a Map<string, GraphEdge[]> where each key represents
 *   a source node and its value contains all outgoing edges.
 *
 * Complexity:
 * - addNode()      : O(1)
 * - addEdge()      : O(Eₛ), where Eₛ is the number of outgoing edges from the
 *                    source node (duplicate check).
 * - getNode()      : O(1)
 * - getNeighbors() : O(1)
 * - getNodes()     : O(V)
 * - getEdges()     : O(E)
 * - getStats()     : O(E) (because getEdges() creates a flattened edge list).
 *
 * Notes:
 * - The graph is directed; each edge represents a one-way connection.
 * - Nodes should generally be added before edges referencing them.
 * - This implementation is suitable for traversal and shortest-path algorithms
 *   such as BFS, DFS, and Dijkstra's algorithm.
 * -----------------------------------------------------------------------------
 */
