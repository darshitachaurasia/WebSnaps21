import React from "react";

import SentimentAnalyzer from "./components/Sentiment";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-8 md:px-16 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2">
             Sentiment Analysis App
          </h1>
          <p className="text-gray-600 text-lg">
            Analyse your sentiments instantly!
          </p>
        </header>

        <div className="flex justify-center">
          <SentimentAnalyzer/>
        </div>
      </div>
    </div>
  );
}

export default App;

