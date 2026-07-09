import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_RETRIES = 2;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found");
  }

  return new GoogleGenAI({ apiKey });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getResponseText(response) {
  return typeof response.text === "function" ? response.text() : response.text;
}

function isRateLimitError(err) {
  const status = err?.status ?? err?.statusCode ?? err?.code;
  const message = `${err?.message ?? ""} ${err?.details ?? ""}`.toLowerCase();

  return (
    status === 429 ||
    status === "429" ||
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("resource_exhausted") ||
    message.includes("quota") ||
    message.includes("too many requests")
  );
}

async function generateWithRetry(prompt, model = DEFAULT_MODEL) {
  const ai = getAI();
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return getResponseText(response);
    } catch (err) {
      lastError = err;

      if (!isRateLimitError(err) || attempt === MAX_RETRIES) {
        throw err;
      }

      const waitMs = 1000 * (attempt + 1) * 2;
      console.warn(`Gemini rate limited. Retrying in ${waitMs}ms...`);
      await sleep(waitMs);
    }
  }

  if (isRateLimitError(lastError)) {
    const rateLimitError = new Error(
      "The AI service is temporarily rate-limited. Please try again in a moment."
    );
    rateLimitError.status = 429;
    throw rateLimitError;
  }

  throw lastError;
}

export async function processKnowledge(text) {
  const prompt = `
You are an Industrial Knowledge Engineer.

Analyze the uploaded industrial document.

Return ONLY valid JSON.

{
"title":"",
"summary":"",
"keywords":["","",""],
"sop":"",
"repair_steps":"",
"safety_checklist":"",
"required_tools":"",
"estimated_time":""
}

Document:

${text}
`;

  try {
    const output = await generateWithRetry(prompt);
    const clean = output.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(clean);
    } catch (err) {
      console.log("Invalid JSON from Gemini");
      console.log(clean);

      return {
        title: "",
        summary: "",
        keywords: [],
        sop: "",
        repair_steps: "",
        safety_checklist: "",
        required_tools: "",
        estimated_time: "",
      };
    }
  } catch (err) {
    if (isRateLimitError(err)) {
      throw err;
    }

    console.error("Gemini knowledge processing failed:", err);
    return {
      title: "",
      summary: "",
      keywords: [],
      sop: "",
      repair_steps: "",
      safety_checklist: "",
      required_tools: "",
      estimated_time: "",
    };
  }
}

export async function askGemini(question, doc, intent = "chat") {

  let prompt = "";

  switch (intent) {

    case "ai":

      prompt = `
You are KnowForge AI.

You answer ONLY from the uploaded company resource.

The employee may ask for:
- Summary
- Explanation
- What is...
- Overview

If the employee asks "What is CNC Machine?", DO NOT explain CNC using outside knowledge.

Instead, explain what THIS uploaded company resource is about.

First show:

📄 Resource Information

Title: ${doc.title}
Department: ${doc.department}
Category: ${doc.category}
Status: ${doc.status}

--------------------------------

Then explain or summarize the uploaded resource using ONLY the information below.

Uploaded Resource:

${doc.extracted_text}

Employee Question:

${question}

Always mention the source title.
`;

      break;

    default:

      prompt = `
You are KnowForge AI.

Answer ONLY using the uploaded company resource.

If the answer does not exist in the uploaded resource, reply exactly:

Information not found in company resources.

Uploaded Resource:

${doc.extracted_text}

Employee Question:

${question}
`;
  }

  return generateWithRetry(prompt);
}