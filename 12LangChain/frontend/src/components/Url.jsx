import { useState } from "react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function App() {
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!prompt) return;
    setLoading(true);

    const humanMsg = { role: "user", content: prompt };
    setHistory(h => [...h, humanMsg]);
    setPrompt("");

    const messages = [
      new SystemMessage("You are a helpful assistant."),
      ...history.map(m => new HumanMessage(m.content)),
      new HumanMessage(prompt)
    ];

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0‑flash",
      temperature: 0.5,
      apiKey: GOOGLE_KEY
    });

    try {
      const aiMsg = await llm.invoke(messages);
      setHistory(h => [...h, { role: "assistant", content: aiMsg.content }]);
    } catch (e) {
      console.error(e);
      setHistory(h => [...h, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "1rem auto", fontFamily: "sans-serif" }}>
      <h1>LangChain + Gemini Chat</h1>
      <div style={{ border: "1px solid #ddd", padding: 12, minHeight: 300 }}>
        {history.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "8px 0" }}>
            <strong>{m.role === "user" ? "You" : "Gemini"}:</strong> {m.content}
          </div>
        ))}
        {loading && <em>Gemini is thinking…</em>}
      </div>
      <div style={{ marginTop: 12 }}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Type your message…"
          style={{ width: "80%", padding: "8px" }}
        />
        <button onClick={send} style={{ padding: "8px 16px" }} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
