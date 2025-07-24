import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Loader2, Send, Cat, Sun, Smile } from 'lucide-react';

const socket = io('http://localhost:5000');

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Generate Image using ClipDrop API
  const generateImage = async (prompt) => {
    if (!prompt) return;
    setLoading(true);
    setError('');
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
      addMessage('assistant', null, imageObjectUrl);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Listen for backend responses
  useEffect(() => {
    socket.on('botMessage', (data) => {
      if (data.type === 'text') {
        addMessage('assistant', data.text);
      }
    });
    return () => socket.off('botMessage');
  }, []);

  const sendMessage = (msg) => {
    if (!msg) return;
    addMessage('user', msg);
    socket.emit('message', msg);
  };

  const addMessage = (sender, text, imageUrl = null) => {
    setMessages((prev) => [...prev, { sender, text, imageUrl }]);
  };

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* ✅ Header */}
      <div className="bg-green-600 text-white py-4 px-6 font-bold text-lg flex items-center justify-center shadow-md">
        EchoBot
      </div>

      {/* ✅ Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-chat-pattern p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-6">Start chatting using the buttons below!</p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-lg text-sm shadow-md ${
                msg.sender === 'user'
                  ? 'bg-green-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text && <p>{msg.text}</p>}
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Generated"
                  className="mt-2 rounded-lg border border-gray-300 max-h-40 object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Action Buttons */}
      <div className="grid grid-cols-2 gap-3 bg-white p-4 border-t border-gray-200">
        {/* Backend Response Buttons */}
        <button
          onClick={() => sendMessage('hello')}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105 text-sm"
        >
          <Smile size={16} /> Hello
        </button>
        <button
          onClick={() => sendMessage('how are you')}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105 text-sm"
        >
          <Send size={16} /> How Are You?
        </button>

        {/* Frontend Image Generation Buttons */}
        <button
          onClick={() => generateImage('cute cat')}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105 text-sm"
        >
          <Cat size={16} /> Show Cat
        </button>
        <button
          onClick={() => generateImage('beautiful sunset')}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105 text-sm"
        >
          <Sun size={16} /> Show Sunset
        </button>
      </div>

      {/* ✅ Status Messages */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium p-3 bg-green-50 border-t">
          <Loader2 className="animate-spin" size={18} /> Generating image...
        </div>
      )}
      {error && <p className="p-3 text-red-600 text-center bg-red-50">{error}</p>}
    </div>
  );
}
