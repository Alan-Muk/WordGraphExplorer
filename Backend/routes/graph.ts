import { Router } from "express";
import { normalize } from "../util/normalise";
import { expandGraph } from "../graph/expand";

const router = Router();

router.get("/:word", async (req, res) => {
  try {
    const word = normalize(req.params.word);

    const graph = await expandGraph(word, 2);

    const data = await fetchNode(word);

    if (!data || data.error) {
      return {
        nodes: [
          { data: { id: word, label: word } }
        ],
        edges: []
      };
    }

    res.json(graph);
  } catch (err: any) {
    console.error(err.message);

    res.status(503).json({
      error: "Graph expansion failed"
    });
  }
});

export default router;

/* --------------------------------------------------------------------------
 * End of graph route
 *
 * Route summary:
 * - Normalizes the requested word.
 * - Expands the graph from the starting node.
 * - Returns a fallback graph if the node cannot be found.
 * - Responds with a 503 error if graph expansion fails unexpectedly.
 *
 * -------------------------------------------------------------------------- */
