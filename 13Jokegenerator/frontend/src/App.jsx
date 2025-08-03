// App.jsx
import { useState } from "react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const SELECTED_MODEL = "gemini-2.5-flash";
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateJoke() {
    const userText = prompt.trim();
    if (!userText) return;

    setLoading(true);
    setJoke("");

    const messages = [
      new SystemMessage("You are a funny and creative joke generator. Always return short, witty, and humorous jokes based on the topic provided."),
      new HumanMessage(`Generate a joke about: ${userText}`)
    ];

    const llm = new ChatGoogleGenerativeAI({
      model: SELECTED_MODEL,
      temperature: 0.9, // More creative for jokes
      apiKey: GOOGLE_KEY,
    });

    try {
      const aiMsg = await llm.invoke(messages);
      setJoke(aiMsg.content);
    } catch (err) {
      console.error("Joke generation failed", err);
      setJoke(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">😂 AI Joke Generator</h1>
      <p className="text-center text-gray-600">Enter a topic, and get a joke instantly!</p>

      <div className="bg-white p-4 rounded-lg border h-40 flex items-center justify-center shadow-sm">
        {loading ? (
          <div className="italic text-gray-500">Thinking of something funny…</div>
        ) : joke ? (
          <div className="text-lg font-medium text-center">{joke}</div>
        ) : (
          <div className="text-gray-400">Your joke will appear here</div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateJoke()}
          className="flex-grow px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
          placeholder="Enter a topic (e.g., cats, programming)…"
          disabled={loading}
        />
        <button
          onClick={generateJoke}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-md"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
