import type {
  GraphNode,
  GraphEdge
} from "../types/graph";


interface Props {

  node: GraphNode | null;

  nodes: GraphNode[];

  edges: GraphEdge[];

  onClose: () => void;

}


export default function NodePanel({

  node,

  nodes,

  edges,

  onClose

}: Props) {


  if (!node) {

    return null;

  }



  const relations =
    edges
      .filter(edge =>
        edge.source === node.id ||
        edge.target === node.id
      )
      .map(edge => {


        const targetId =
          edge.source === node.id
            ? edge.target
            : edge.source;


        const target =
          nodes.find(
            n =>
              n.id === targetId
          );


        return {

          type:
            edge.label,

          target:
            target?.label ?? targetId

        };

      });



  return (

    <aside className="node-panel">


      <button
        className="close"
        onClick={onClose}
      >
        ×
      </button>



      <h2>
        {node.label}
      </h2>



      <p className="definition">

        {
          node.definition ??
          "No definition available"
        }

      </p>



      <hr />



      <h3>
        Relations
      </h3>



      {
        relations.length === 0 &&

        <p>
          No relations
        </p>

      }



      {
        relations.map(
          (relation,index) => (

            <div
              className="relation"
              key={index}
            >

              <span>
                {relation.type}
              </span>

              →

              <strong>
                {relation.target}
              </strong>


            </div>

          )
        )
      }


    </aside>

  );

}