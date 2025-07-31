import { useEffect, useRef, useState } from 'react';

function App() {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const recognitionRef = useRef(null);

  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // ✅ from .env file

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

  const fetchYouTubeVideo = async (query) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        setVideoUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
        return `Playing "${data.items[0].snippet.title}" on YouTube!`;
      }
      return 'Sorry, I could not find a video for that.';
    } catch (error) {
      console.error(error);
      return 'Error fetching video from YouTube.';
    }
  };

  const generateResponse = async (text) => {
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
      reply = "You can ask me the time, date, a joke, or say 'play [song name]' to play on YouTube.";
    } else if (msg.includes('thanks') || msg.includes('thank you')) {
      reply = "You're welcome! Happy to help.";
    } else if (msg.includes('who made you')) {
      reply = "I was created by an awesome developer — could be you!";
    } else if (msg.startsWith('play') || msg.startsWith('search')) {
      const query = msg.replace(/play|search/g, '').trim();
      reply = await fetchYouTubeVideo(query);
    }

    setResponse(reply);
    const utterance = new SpeechSynthesisUtterance(reply);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 text-[#1F2937]">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 md:p-12 text-center border border-[#D1D5DB]">
        <h1 className="text-4xl font-extrabold text-[#2E8B57] mb-6">Alexify</h1>

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

        <div className="text-left space-y-4 mb-6">
          <div className="p-4 bg-[#F9FAFB] rounded border border-[#D1D5DB]">
            <p><span className="font-semibold text-[#3B82F6]">Transcript:</span> {transcript || <em className="text-[#D1D5DB]">None yet</em>}</p>
          </div>
          <div className="p-4 bg-[#FFF9E5] rounded border border-[#FACC15]">
            <p><span className="font-semibold text-[#FACC15]">Response:</span> {response || <em className="text-[#D1D5DB]">No response yet</em>}</p>
          </div>
        </div>

        {videoUrl && (
          <div className="mt-6">
            <iframe
              width="100%"
              height="315"
              src={videoUrl}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
