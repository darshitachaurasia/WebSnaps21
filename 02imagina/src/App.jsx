import { useEffect, useRef, useState } from "react";

function App() {
  const inputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef(null);

  const generateImage = async (promptText) => {
    const prompt = promptText || inputRef.current.value.trim();
    if (!prompt) return;

    setLoading(true);
    setError('');
    setImageUrl('');
    const apiKey = import.meta.env.VITE_CLIPDROP_API_KEY;

    try {
      const res = await fetch('https://clipdrop-api.co/text-to-image/v1', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to generate image');

      const imageBlob = await res.blob();
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectUrl);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your system does not support voice recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1][0].transcript;
      setTranscript(lastResult);
      inputRef.current.value = lastResult;
      generateResponse(lastResult);
    };

    recognition.onerror = (e) => console.error("Speech recognition error:", e.error);

    recognitionRef.current = recognition;

    return () => recognitionRef.current?.stop();
  }, []);

  const startListening = () => recognitionRef.current?.start();

  const generateResponse = (text) => {
    const reply = 'I heard you, generating your image!';
    generateImage(text);
    setResponse(reply);
    const utterance = new SpeechSynthesisUtterance(reply);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-white to-green-50 flex flex-col items-center justify-center px-4 sm:px-6 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-4">Imaginaa</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          Type or <span className="font-semibold">Speak</span> your prompt and watch the magic happen!
        </p>

        {/* ✅ Input & Mic Button Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Describe your image (e.g., A futuristic city at night)"
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            className="flex-grow px-4 py-3 border-2 border-green-300 rounded-xl shadow focus:ring-2 focus:ring-green-500 focus:outline-none text-base"
          />
          <button
            onClick={startListening}
            className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-md flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M5 8a1 1 0 0 1 1 1v3a4.006 4.006 0 0 0 4 4h4a4.006 4.006 0 0 0 4-4V9a1 1 0 1 1 2 0v3.001A6.006 6.006 0 0 1 14.001 18H13v2h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2H9.999A6.006 6.006 0 0 1 4 12.001V9a1 1 0 0 1 1-1Z"
                clipRule="evenodd"
              />
              <path d="M7 6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V6Z" />
            </svg>
          </button>
        </div>

        {/* ✅ Generate Button */}
        <button
          onClick={() => generateImage()}
          className="w-full py-3 bg-green-700 text-white text-lg font-semibold rounded-xl hover:bg-green-800 transition-all shadow-md"
        >
          Generate Image
        </button>

        {/* ✅ Loading & Errors */}
        {loading && <p className="mt-4 text-green-700 animate-pulse">Generating image...</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}

        {/* ✅ Generated Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated"
            className="mt-6 rounded-xl shadow-2xl max-h-[400px] sm:max-h-[500px] mx-auto border border-gray-300 w-full max-w-full h-auto object-contain"
          />
        )}

        {/* ✅ Voice & Response Info */}
        {transcript && (
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            <strong>You said:</strong> {transcript}
          </p>
        )}
        {response && (
          <p className="text-green-600 font-medium mt-2 text-sm sm:text-base">{response}</p>
        )}
      </div>
    </div>
  );
}

export default App;
