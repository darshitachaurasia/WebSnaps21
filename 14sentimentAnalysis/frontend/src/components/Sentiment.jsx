import React, { useState } from "react";
import axios from "axios";

const SentimentAnalyzer = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  const analyzeSentiment = async () => {
    if (!text) {
      setStatus("❌ Please enter text");
      return;
    }
    setStatus("⏳ Analyzing...");
    try {
      const response = await axios.post("http://localhost:5000/api/sentiment", {
        text,
      });
      setResult(response.data.result);
      setStatus("✅ Analysis complete!");
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      setStatus("❌ Failed to analyze sentiment");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🧠 Sentiment Analyzer
        </h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze sentiment..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={analyzeSentiment}
          className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
        >
          Analyze Sentiment
        </button>

        {status && (
          <p
            className={`mt-4 text-center font-medium ${
              status.includes("✅")
                ? "text-green-600"
                : status.includes("❌")
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {status}
          </p>
        )}

        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h5 className="text-gray-700 font-semibold mb-2">Result:</h5>
            <pre className="text-sm text-gray-800">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
