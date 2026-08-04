import { Graph } from "./Graph";
import { Synset } from "../models/Synset";
import { relationWeight } from "../graph/weights";


export class GraphBuilder {

  build(
    synsets: Synset[]
  ): Graph {

    const graph =
      new Graph();


    // Add all nodes first
    for (const synset of synsets) {

      graph.addNode({
        id: synset.id,
        label: synset.word,
        definition: synset.definition
      });

    }


    // Add relations as edges
// Add relations as edges
for (const synset of synsets) {

  for (const relation of synset.relations) {

    const weight =
      relationWeight(
        relation.type
      );


    // Ensure target node exists
    graph.addNode({

      id:
        relation.target.id,

      label:
        relation.target.lemma,

      definition:
        relation.target.definition

    });


    graph.addEdge({

      source:
        synset.id,

      target:
        relation.target.id,

      label:
        relation.type,

      weight

    });


    // Reverse edge for traversal
    graph.addEdge({

      source:
        relation.target.id,

      target:
        synset.id,

      label:
        relation.type,

      weight

    });

  }

}
    return graph;

  }

}

/*
 * -----------------------------------------------------------------------------
 * GraphBuilder Class
 * -----------------------------------------------------------------------------
 * This class is responsible for converting a collection of Synset objects into
 * a Graph that can be used by graph traversal and pathfinding algorithms.
 *
 * How it works:
 * - Creates an empty Graph instance.
 * - Adds every synset as a graph node.
 * - Iterates through each synset's semantic relations.
 * - Assigns a weight to each relation using the relationWeight() function.
 * - Ensures every related target synset exists as a node in the graph.
 * - Creates a directed edge from the source synset to the target synset.
 * - Creates a reverse edge to allow traversal in both directions.
 *
 * Main Steps:
 * 1. Initialize an empty graph.
 * 2. Add all synsets as nodes.
 * 3. Process every semantic relation.
 * 4. Calculate the relation weight.
 * 5. Add missing target nodes if necessary.
 * 6. Insert both forward and reverse edges.
 * 7. Return the completed graph.
 *
 * Dependencies:
 * - Graph: Stores nodes and edges.
 * - Synset: Represents a word sense and its semantic relationships.
 * - relationWeight(): Determines the traversal cost for each relation type.
 *
 * Complexity:
 * - Time: O(V + E)
 *   - V = number of synsets (nodes)
 *   - E = total number of relations (edges)
 * - Space: O(V + E)
 *
 * Notes:
 * - Reverse edges are intentionally added so the graph can be traversed in
 *   either direction, even if the original semantic relation is one-way.
 * - Duplicate nodes and edges are safely ignored by the Graph class.
 * - The resulting graph is suitable for algorithms such as Dijkstra's shortest
 *   path algorithm and other graph traversal operations.
 * -----------------------------------------------------------------------------
 */
