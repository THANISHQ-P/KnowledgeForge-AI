import express from "express";
import { searchKnowledge } from "../services/searchService.js";
import { askGemini } from "../services/aiService.js";
import { detectIntent } from "../services/intentService.js";

import {
    extractRepair,
    extractSafety,
    extractTools,
    extractTime,
    extractSOP
} from "../services/textExtractor.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question required" });
    }

    const document = await searchKnowledge(question);

    if (!document) {
      return res.json({
        answer: "Information not found in company resources.",
        source: null,
      });
    }

    const intent = detectIntent(question);
    let answer = "";
    let usedAI = false;


switch(intent){

case "repair":

answer =
document.repair_steps ||
extractRepair(document.extracted_text);

break;

case "safety":

answer =
document.safety_checklist ||
extractSafety(document.extracted_text);

break;

case "tools":

answer =
document.required_tools ||
extractTools(document.extracted_text);

break;

case "time":

answer =
document.estimated_time ||
extractTime(document.extracted_text);

break;

case "sop":

answer =
document.sop ||
extractSOP(document.extracted_text);

break;

default:
usedAI = true;
console.log("Intent:", intent);
console.log("Question:", question);
answer = await askGemini(question, document, intent);

}

    res.json({
      success: true,
      answer,
      ai: usedAI,
      source: {
        title: document.title,
        expert: document.uploaded_by_name || document.uploaded_by || null,
        machine: document.machine_name,
        department: document.department,
        category: document.category,
        file: document.file_url,
      },
    });
  } catch (err) {
    console.error("Chat request failed:", err);

    const status = err?.status || err?.statusCode || 500;
    const message =
      status === 429
        ? "The AI service is temporarily rate-limited. Please try again in a moment."
        : err.message || "Something went wrong while processing your question.";

    res.status(status).json({
      success: false,
      error: message,
      retryable: status === 429,
    });
  }
});

export default router;