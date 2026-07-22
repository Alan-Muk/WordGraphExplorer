import { useState } from "react";

import Toolbar from "./components/Toolbar";
import StatsCard from "./components/StatsCard";
import Legend from "./components/Legend";
import GraphCanvas from "./components/GraphCanvas";
import NodePanel from "./components/NodePanel";

import { fetchGraph } from "./api/graph";

import type {
  GraphResponse
} from "./types/graph";


export default function App() {


  const [graph, setGraph] =
    useState<GraphResponse | null>(null);


  const [selected, setSelected] =
    useState<string | null>(null);



  async function search(
    word: string,
    depth: number
  ) {

    const result =
      await fetchGraph(
        word,
        depth
      );


    setGraph(result);

    // clear old selection
    setSelected(null);

  }



  return (

    <div className="app">


      <Toolbar
        onSearch={search}
      />



      {
        graph &&

        <StatsCard

          nodes={
            graph.stats.nodes
          }

          edges={
            graph.stats.edges
          }

        />

      }



      <div className="canvas">


        {
          graph &&

          <GraphCanvas
            graph={graph}
            selectedId={selected}
            onSelect={(node)=>
              setSelected(node.id)
            }
          />

        }



        {
          selected &&
          graph &&

          <NodePanel

            node={
              graph.nodes.find(
                node =>
                  node.id === selected
              ) ?? null
            }


            nodes={
              graph.nodes
            }


            edges={
              graph.edges
            }


            onClose={() =>
              setSelected(null)
            }

          />

        }


      </div>



      <Legend />


    </div>

  );

}