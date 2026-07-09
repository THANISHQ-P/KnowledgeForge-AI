import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import knowledgeRoutes from "./routes/knowledgeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import { fileURLToPath } from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env")
});

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://knowledge-forge-ai.vercel.app"
  ],
  credentials: true
}));

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
