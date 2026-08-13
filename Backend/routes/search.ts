import { Router } from "express";
import normalise from "../util/normalise";
import { WordNetService } from "../services/WordNetService";

const router = Router();

const service = new WordNetService();

router.get("/", async (req, res) => {
  try {
    const word = normalise(req.query.word as string);

    if (!word) {
      return res.status(400).json({
        error: "Missing word",
      });
    }

    const results = await service.lookup(word);

    res.json({
      word,
      results,
    });
  } catch (err: any) {
    console.error(err.message);

    res.status(500).json({
      error: "Search failed",
    });
  }
});

export default router;
