import express from "express";
import cors from "cors";

import graphRoutes from "./routes/graph";
import pathRoutes from "./routes/path";
import searchRoutes from "./routes/search";
import similarityRoutes from "./routes/similarity";

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET"],
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Word Graph API",
    status: "running",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/search", searchRoutes);
app.use("/similarity", similarityRoutes);
app.use("/graph", graphRoutes);
app.use("/path", pathRoutes);

const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Word Graph API running on port ${port}`);
});
