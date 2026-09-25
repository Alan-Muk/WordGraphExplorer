import { Router } from "express";
import normalise from "../util/normalise";
import { SemanticGraphService } from "../services/SemanticGraphService";
import { DEFAULT_DEPTH, MAX_DEPTH } from "../config";

const router = Router();
const service = new SemanticGraphService();

router.get("/:word", async (req, res) => {
  try {
    const word = normalise(req.params.word);

    if (req.query.view === "grouped") {
      const grouped = await service.grouped(word);
      return res.json(grouped);
    }

    const depthValue = Number(req.query.depth ?? DEFAULT_DEPTH);
    const depth =
      Number.isFinite(depthValue) && depthValue > 0
        ? Math.min(Math.floor(depthValue), MAX_DEPTH)
        : DEFAULT_DEPTH;

    console.log(`[graph] word=${word} depth=${depth}`);

    const graph = await service.build(word, depth);

    res.json({
      word,
      ...graph.toJSON(),
      stats: graph.getStats(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (err instanceof Error && err.name === "NotFoundError") {
      return res.status(404).json({ error: message });
    }

    console.error("Graph build failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
