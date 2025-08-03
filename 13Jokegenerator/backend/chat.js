import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",  // Or gemini-2.5-flash
  temperature: 0.9,           // More creative for jokes
  apiKey: process.env.VITE_GOOGLE_API_KEY, // Make sure your key is in .env
});

// Get topic from command-line argument or default
const topic = process.argv[2] || "programming";

console.log(`\n🎭 Generating a joke about: ${topic}...\n`);

const messages = [
  { role: "system", content: "You are a funny and witty joke generator. Always respond with a short, clever joke related to the given topic. Keep it light and humorous." },
  { role: "user", content: `Tell me a joke about ${topic}` },
];

try {
  const response = await llm.invoke(messages);
  console.log("😂 Joke:", response.content);
} catch (error) {
  console.error("❌ Error generating joke:", error.message);
}
