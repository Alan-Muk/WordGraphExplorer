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