// App.jsx
import { useState } from "react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const GPT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",     // fallback if 2.5 is unavailable
];
const SELECTED_MODEL = "gemini-2.5-flash"; // Or allow dropdown to choose

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export default function App() {
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const userText = prompt.trim();
    if (!userText) return;

    setPrompt("");
    setLoading(true);

    const newHuman = { role: "user", content: userText };
    setHistory((h) => [...h, newHuman]);

    const messages = [
      new SystemMessage("You are a helpful assistant."),
      ...history.map((m) => new HumanMessage(m.content)),
      new HumanMessage(userText),
    ];

    const llm = new ChatGoogleGenerativeAI({
      model: SELECTED_MODEL,      // ASCII hyphens only
      temperature: 0.5,
      apiKey: GOOGLE_KEY,
    });
    llm.verbose = true;
    console.log("LLM model:", Array.from(llm.model).map((c) => c.charCodeAt(0)));

    try {
      const aiMsg = await llm.invoke(messages);
      setHistory((h) => [...h, { role: "assistant", content: aiMsg.content }]);
    } catch (err) {
      console.error("Gemini call failed", err);
      setHistory((h) => [...h, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Gemini Flash Chat</h1>

      <div className="bg-white p-4 rounded-lg border h-80 overflow-y-auto space-y-2 shadow-sm">
        {history.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} max-w-xs px-3 py-2 rounded-lg`}>
              <span className="font-semibold">{m.role === "user" ? "You:" : "Gemini:"}</span> {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="italic text-center text-gray-600">Thinking…</div>}
      </div>

      <div className="flex space-x-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-grow px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
          placeholder="Type your message…"
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
