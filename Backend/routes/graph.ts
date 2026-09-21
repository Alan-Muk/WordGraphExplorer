import { Router } from "express";
import normalise from "../util/normalise";
import { SemanticGraphService } from "../services/SemanticGraphService";
import { NotFoundError } from "../util/errors";

const router = Router();
const service = new SemanticGraphService();

router.get("/:word", async (req, res) => {
  try {
    const word = normalise(req.params.word);

    const depthValue = Number(req.query.depth ?? 5);
    const depth =
      Number.isFinite(depthValue) && depthValue > 0
        ? Math.min(depthValue, 5)
        : 2;

    const graph = await service.build(word, depth);

    res.json({
      word,
      ...graph.toJSON(),
      stats: graph.getStats(),
    });
  } catch (err: unknown) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }

    console.error("Graph build failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
