import { useState } from "react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const SELECTED_MODEL = "gemini-2.5-pro";
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// ✅ UPDATED: System prompt is now structured for providing general health information.
const systemPrompt = `
You are a helpful AI Health Assistant. Your goal is to provide clear, general, and easy-to-understand information about health conditions.
Format your response using Markdown with clear headings.

The sections must be:
1.  **Condition Overview**: A short, one-paragraph description of the condition.
2.  **Common Symptoms**: A bulleted list of typical signs and symptoms.
3.  **Potential Causes & Risk Factors**: A summary of known or suspected causes and factors that might increase risk.
4.  **General Treatment Approaches**: A brief overview of common strategies, including lifestyle changes, therapies, and types of medications (do not suggest specific drug names or dosages).
5.  **Disclaimer**: You MUST end with this exact disclaimer: "This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or another qualified health provider with any questions you may have regarding a medical condition."
`;

// ✅ RENAMED: Function name changed for clarity.
export function useHealthInfoGenerator() {
  // ✅ RENAMED: State variables changed for clarity.
  const [healthInfo, setHealthInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ RENAMED: Function name changed for clarity.
  async function generateHealthInfo(prompt) {
    if (!prompt) return;

    setLoading(true);
    setHealthInfo("");
    setError(null);

    const messages = [
      new SystemMessage(systemPrompt),
      // ✅ UPDATED: Human message now asks for a health guide.
      new HumanMessage(`Generate a health guide for: ${prompt}`),
    ];

    const llm = new ChatGoogleGenerativeAI({
      model: SELECTED_MODEL,
      temperature: 0.5, // Lowered temperature for more factual, less creative health info
      apiKey: GOOGLE_KEY,
      streaming: true,
    });

    try {
      const stream = await llm.stream(messages);
      for await (const chunk of stream) {
        setHealthInfo((prev) => prev + chunk.content);
      }
    } catch (err) {
      console.error("Health info generation failed", err);
      setError(`Error: Could not generate the guide. ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return { healthInfo, loading, error, generateHealthInfo };
}