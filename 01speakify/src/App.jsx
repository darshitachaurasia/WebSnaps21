import { useEffect, useRef, useState } from 'react';

function App() {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1][0].transcript;
      setTranscript(lastResult);
      generateResponse(lastResult);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const generateResponse = (text) => {
    let reply = 'I heard you, but do not understand!';
    const msg = text.toLowerCase();

    if (msg.includes('hello')) {
      reply = 'Hi there! How can I help you today?';
    } else if (msg.includes('time')) {
      const now = new Date().toLocaleTimeString();
      reply = `It's currently ${now}`;
    } else if (msg.includes('your name')) {
      reply = "I'm your voice assistant, Speakify!";
    } else if (msg.includes('date')) {
      const today = new Date().toLocaleDateString();
      reply = `Today is ${today}`;
    } else if (msg.includes('joke')) {
      reply = "Why did the scarecrow win an award? Because he was outstanding in his field!";
    } else if (msg.includes('time zone')) {
      reply = `I'm set to the ${Intl.DateTimeFormat().resolvedOptions().timeZone} time zone.`;
    } else if (msg.includes('help')) {
      reply = "Sure! You can ask me the time, date, a joke, or even to tell you my name.";
    } else if (msg.includes('thanks') || msg.includes('thank you')) {
      reply = "You're welcome! Happy to help.";
    } else if (msg.includes('who made you')) {
      reply = "I was created by an awesome developer — could be you!";
    }

    setResponse(reply);
    const utterance = new SpeechSynthesisUtterance(reply);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4 text-[#1F2937]">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 md:p-12 text-center border border-[#D1D5DB]">
        <h1 className="text-4xl font-extrabold text-[#2E8B57] mb-6">Speakify</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={startListening}
            className="px-5 py-2 bg-[#2E8B57] hover:bg-[#3CB371] text-white font-semibold rounded-lg transition"
          >
            Start Listening
          </button>
          <button
            onClick={stopListening}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Stop Listening
          </button>
        </div>

        <div className="text-left space-y-4">
          <div className="p-4 bg-[#F9FAFB] rounded border border-[#D1D5DB]">
            <p><span className="font-semibold text-[#3B82F6]">Transcript:</span> {transcript || <em className="text-[#D1D5DB]">None yet</em>}</p>
          </div>
          <div className="p-4 bg-[#FFF9E5] rounded border border-[#FACC15]">
            <p><span className="font-semibold text-[#FACC15]">Response:</span> {response || <em className="text-[#D1D5DB]">No response yet</em>}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;