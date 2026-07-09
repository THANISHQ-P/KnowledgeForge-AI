import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import knowledgeRoutes from "./routes/knowledgeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", knowledgeRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("KnowForge AI Backend Running 🚀");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});