import { useState } from "react";
import { Typography, Input, Button, Card, Spin, Alert } from "antd";
import { useHealthInfoGenerator } from "./hooks/useHealthInfoGenerator"; // Correct hook
import ReactMarkdown from "react-markdown";

const { Title } = Typography;

// Your updated list of health-related prompts
const SUGGESTION_PROMPTS = [
  "Hypertension (High Blood Pressure)",
  "Generalized Anxiety Disorder",
  "Migraine",
  "High Fever",
];

export default function HealthAssistant() {
  const [prompt, setPrompt] = useState("");
  // ✅ Use the correct hook and variable names
  const { healthInfo, loading, error, generateHealthInfo } = useHealthInfoGenerator();

  const handleGenerate = (currentPrompt) => {
    if (currentPrompt.trim()) {
      generateHealthInfo(currentPrompt);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
    handleGenerate(suggestion);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-red-600 shadow-md">
        <div className="mx-auto max-w-4xl px-4 py-3">
          {/* ✅ Title updated */}
          <Title level={2} className="!text-white !m-0 !font-bold">
            AI Health Assistant
          </Title>
        </div>
      </header>

      <main className="p-4 sm:p-8">
        <Card className="mx-auto max-w-4xl shadow-lg">
          <div className="flex flex-col gap-6">
            {/* ✅ Description updated */}
            <p className="text-base text-gray-600">
              Get general information about common health conditions, symptoms, and treatments.
            </p>

            <div className="flex w-full gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onPressEnter={() => handleGenerate(prompt)}
                 // ✅ Placeholder updated
                placeholder="Enter a health condition, e.g., 'Asthma'"
                disabled={loading}
                size="large"
              />
              <Button
                type="primary"
                danger // Ant Design button style for "health" theme
                onClick={() => handleGenerate(prompt)}
                loading={loading}
                size="large"
              >
                Generate
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-sm font-medium text-gray-700">Suggestions:</span>
              {SUGGESTION_PROMPTS.map((text) => (
                <button
                  key={text}
                  onClick={() => handleSuggestionClick(text)}
                  disabled={loading}
                  // ✅ Button colors changed for health theme
                  className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Output Card */}
            <div className="min-h-[300px] rounded-lg bg-slate-100/70 p-4 sm:p-6">
              {loading && !healthInfo && (
                <div className="flex h-full items-center justify-center pt-10">
                  <Spin size="large" />
                </div>
              )}
              {error && <Alert message={error} type="error" showIcon />}
               {/* ✅ Display 'healthInfo' and wrap markdown correctly */}
              {healthInfo && (
                <div className="prose prose-red max-w-none">
                  <ReactMarkdown>{healthInfo}</ReactMarkdown>
                </div>
              )}
              {!loading && !healthInfo && !error && (
                // ✅ Output placeholder updated
                <p className="pt-16 text-center text-gray-500">
                  Your health information will appear here.
                </p>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}