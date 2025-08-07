import axios from "axios";
import * as cheerio from "cheerio";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// 1. Initialize Gemini Flash model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // "gemini-1.5-flash" is current as of Aug 2025
  generationConfig: {
    temperature: 0.5, // Slight creativity
  },
});

// 2. Fetch TailwindCSS page content
async function fetchTailwindContent() {
  const res = await axios.get("https://tailwindcss.com/");
  const $ = cheerio.load(res.data);
  return $("body").text(); // Extract visible page text
}

// 3. Ask Gemini about Tailwind
async function askGeminiAboutTailwind() {
  const pageText = await fetchTailwindContent();

  const prompt = `
You are an expert developer assistant. The following is content from the TailwindCSS homepage:
---
${pageText.slice(0, 15000)}
---
Based on this, answer: What is Tailwind CSS?
Keep the answer concise, beginner-friendly, and clear.
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  console.log("Answer:", response.text());
}

askGeminiAboutTailwind();
