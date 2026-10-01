import { Router } from "express";
import normalise from "../util/normalise";
import { SemanticGraphService } from "../services/SemanticGraphService";

const router = Router();
const service = new SemanticGraphService();

router.get("/", async (req, res) => {
  try {
    const from = normalise(req.query.from as string);
    const to = normalise(req.query.to as string);

    if (!from || !to) {
      return res.status(400).json({ error: "Missing from or to" });
    }

    const algorithm = req.query.algorithm === "bfs" ? "bfs" : "dijkstra";

    const result = await service.path(from, to, 5, algorithm);

    res.json(result);
  } catch (err: unknown) {
    console.error("Path calculation failed:", err);
    res.status(500).json({ error: "Path calculation failed" });
  }
});

export default router;
