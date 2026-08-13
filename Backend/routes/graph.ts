import { Router } from "express";
import normalise from "../util/normalise";
import { SemanticGraphService } from "../services/SemanticGraphService";

const router = Router();

const service = new SemanticGraphService();

router.get("/:word", async (req, res) => {
  try {
    const word = normalise(req.params.word);

    const depthValue = Number(req.query.depth ?? 2);

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
  } catch (err: any) {
    console.error(err.message);

    res.status(404).json({
      error: "Word graph unavailable",
    });
  }
});

export default router;
