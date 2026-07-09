import dotenv from "dotenv";
import { processKnowledge } from "./services/aiService.js";
dotenv.config();

console.log(process.env.GEMINI_API_KEY);


const text = `
Telephone Etiquette

Always greet the customer politely.

Introduce yourself.

Listen carefully.

Thank the customer.
`;

const result = await processKnowledge(text);

console.log(result);