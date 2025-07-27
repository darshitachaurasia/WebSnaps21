import { useState, useCallback, useEffect, useRef } from "react";

export default function App() {
  const [length, setLength] = useState(12);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [charAllowed, setCharAllowed] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`";

    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="bg-white shadow-2xl border border-gray-200 rounded-2xl p-8 w-full max-w-lg text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          🔐 Password Generator
        </h1>

        {/* Password Display */}
        <div className="flex items-center border rounded-lg overflow-hidden mb-6">
          <input
            type="text"
            value={password}
            ref={passwordRef}
            readOnly
            className="w-full px-4 py-3 text-lg font-semibold outline-none"
          />
          <button
            onClick={copyPasswordToClipboard}
            className={`px-5 py-3 font-semibold transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {copied ? "✅ Copied" : "Copy"}
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Length Slider */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password Length: <span className="text-blue-600">{length}</span>
            </label>
            <input
              type="range"
              min={6}
              max={32}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Toggle Options */}
          <div className="flex justify-between items-center text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
                className="w-5 h-5 accent-blue-600"
              />
              Include Numbers
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={charAllowed}
                onChange={() => setCharAllowed((prev) => !prev)}
                className="w-5 h-5 accent-blue-600"
              />
              Include Symbols
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={passwordGenerator}
          className="mt-8 w-full py-3 text-lg font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          🔄 Generate New Password
        </button>
      </div>
    </div>
  );
}
