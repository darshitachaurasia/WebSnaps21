import { useState } from "react";

export default function App() {
  const [mood, setMood] = useState("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateQuote() {
    if (!mood.trim()) {
      setQuote("Please enter your mood first!");
      return;
    }

    setLoading(true);
    setQuote("");

    try {
      const prompt = `Give me a short, uplifting quote for someone feeling ${mood}. Keep it under 20 words.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No quote generated.";
      setQuote(text.trim());
    } catch (err) {
      console.error(err);
      setQuote("Error generating quote. Check console.");
    }

    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1>Mood → Quote</h1>
      <input
        type="text"
        placeholder="Enter your mood..."
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          width: "250px",
          marginBottom: "1rem",
        }}
      />
      <br />
      <button
        onClick={generateQuote}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Generate Quote"}
      </button>
      {quote && (
        <div
          style={{
            marginTop: "1.5rem",
            background: "white",
            padding: "1rem",
            borderRadius: "8px",
            width: "300px",
            marginInline: "auto",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          {quote}
        </div>
      )}
    </div>
  );
}
