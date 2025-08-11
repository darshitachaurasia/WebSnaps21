import { useEffect, useState } from "react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getStreak } from "./streakUtils";

export default function App() {
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("");
  const [challenge, setChallenge] = useState("");

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: import.meta.env.
VITE_GOOGLE_API_KEY ,
  });

  useEffect(() => {
    const currentStreak = getStreak();
    setStreak(currentStreak);

    async function fetchMotivation() {
  const res = await model.invoke([
    {
      role: "system",
      content: "You are a motivational streak coach. Give very short outputs."
    },
    {
      role: "user",
      content: `My current streak is ${currentStreak} days. 
                Give me 1 motivational sentence and 1 short daily task, separated by a newline.`
    }
  ]);

  // Handle response type
  let aiText = "";
  if (typeof res.content === "string") {
    aiText = res.content;
  } else if (Array.isArray(res.content) && res.content.length > 0) {
    aiText = res.content.map(c => c.text || "").join("\n");
  } else {
    aiText = "Keep going!\nDo one positive action today.";
  }

  const lines = aiText.split("\n").map(l => l.trim()).filter(Boolean);
  setMessage(lines[0] || "Keep going strong!");
  setChallenge(lines[1] || "Do one positive action today.");
}


    fetchMotivation();
  }, []);

  const markTodayDone = () => {
    localStorage.setItem("lastDate", new Date().toDateString());
    localStorage.setItem("streak", streak + 1);
    setStreak(streak + 1);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold">🔥 {streak}-Day Streak</h1>
      <p className="mt-4">{message}</p>
      <p className="mt-2 text-green-700 font-semibold">{challenge}</p>
      <button
        onClick={markTodayDone}
        className="mt-6 w-full py-2 bg-green-600 text-white rounded-lg"
      >
        Mark Today as Complete
      </button>
    </div>
  );
}
