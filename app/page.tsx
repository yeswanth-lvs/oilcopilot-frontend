"use client";
import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://oilcopilot-backend-prod.up.railway.app";

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setChunks(data.chunks || []);

    const summaryRes = await fetch(`${BACKEND_URL}/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chunks: data.chunks }),
    });

    const summaryData = await summaryRes.json();
    setSummary(summaryData.summary);
    setLoading(false);
  };

  const handleAsk = async () => {
    const formData = new FormData();
    formData.append("query", query);
    formData.append("chunks", chunks.join("||"));

    const res = await fetch(`${BACKEND_URL}/ask`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🛢️ OilCopilot</h1>
      <p className="text-center text-gray-500">Upload oilfield reports & ask questions instantly with AI.</p>

      <div className="flex flex-col gap-4">
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button
          className="bg-black text-white py-2 px-4 rounded hover:opacity-80"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? "Processing..." : "Upload & Summarize"}
        </button>
      </div>

      {summary && (
        <div className="p-4 border rounded space-y-4 bg-gray-50">
          <h2 className="text-xl font-semibold">📄 Summary</h2>
          <p className="whitespace-pre-wrap">{summary}</p>

          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleAsk}
            disabled={!query}
          >
            Ask
          </button>

          {answer && (
            <div className="p-3 bg-white rounded border">
              <strong>💬 Answer:</strong>
              <p>{answer}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
