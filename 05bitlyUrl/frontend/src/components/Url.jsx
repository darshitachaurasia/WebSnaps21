import React, { useState } from "react";
import axios from "axios";

const Url = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shorten, setShorten] = useState("");
  const [status, setStatus] = useState("");

  const shortenUrl = async () => {
    if (!originalUrl) {
      setStatus("❌ Please enter a URL");
      return;
    }
    setStatus("⏳ Shortening...");
    try {
      const response = await axios.post("http://localhost:5000/api/shorten", {
        originalUrl,
      });
      setShorten(response.data.shortUrl);
      setStatus("✅ URL shortened successfully!");
    } catch (error) {
      console.error("Error shortening URL:", error);
      setStatus("❌ Failed to shorten URL");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(shorten).then(() => {
      alert("Copied to clipboard");
    });
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🔗 URL Shortener
        </h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your long URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={shortenUrl}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            Shorten URL
          </button>
        </div>

        {/* Status Message */}
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

        {/* Shortened URL Section */}
        {shorten && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg text-center">
            <h5 className="text-gray-700 font-semibold mb-2">
              Your Shortened URL:
            </h5>
            <p className="text-indigo-600 font-bold break-all">{shorten}</p>
            <button
              onClick={copy}
              className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Url;
