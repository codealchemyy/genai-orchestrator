"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendPrompt() {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:4000/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Request failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type something like: summarise: neural networks..."
      />

      <button
        onClick={sendPrompt}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {loading ? "Thinking..." : "Send to Agent"}
      </button>

      {response && (
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm">
          {response}
        </pre>
      )}
    </div>
  );
}
