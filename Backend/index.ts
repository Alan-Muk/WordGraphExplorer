import express from "express";
import cors from "cors";

import graphRoutes from "./routes/graph";
import pathRoutes from "./routes/path";
import searchRoutes from "./routes/search";
import similarityRoutes from "./routes/similarity";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/search", searchRoutes);
app.use("/similarity", similarityRoutes);
app.use("/graph", graphRoutes);
app.use("/path", pathRoutes);

app.listen(3001, () => {
  console.log("Word Graph API running on port 3001");
});

app.get("/", (req, res) => {
  res.json({
    name: "Word Graph API",
    status: "running"
  });
});
