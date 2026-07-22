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