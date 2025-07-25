import React, { useState } from "react";
import axios from "axios";

function EmailSender() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = async () => {
    if (!name || !email) {
      setStatus("❌ Please fill in all fields.");
      return;
    }
    setStatus("⏳ Sending...");
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL, {
        name,
        email,
      });
      if (response.data.success) {
        setStatus("✅ Email sent successfully!");
      } else {
        setStatus("❌ Failed to send email.");
      }
    } catch (error) {
      setStatus("❌ Error sending email.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-auto bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Email Bot
        </h2>

        {/* Input fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Recipient Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Recipient Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Button */}
        <button
          onClick={sendEmail}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Send Email
        </button>

        {/* Status Message */}
        <p
          className={`mt-4 text-center text-sm font-medium ${
            status.includes("✅")
              ? "text-green-600"
              : status.includes("❌")
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}

export default EmailSender;
