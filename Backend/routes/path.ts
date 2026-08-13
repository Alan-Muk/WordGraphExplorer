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
      return res.status(400).json({
        error: "Missing from or to",
      });
    }

    const result = await service.path(from, to);

    res.json(result);
  } catch (err: any) {
    console.error(err.message);

    res.status(500).json({
      error: "Path calculation failed",
    });
  }
});

export default router;
