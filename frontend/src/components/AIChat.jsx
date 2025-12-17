import { useState } from "react";
import { askResumeAI } from "../api";

export default function AIChat({ resumeText, jobDesc, missingSkills }) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAskAI() {
    setLoading(true);
    try {
      const result = await askResumeAI(
        resumeText,
        jobDesc,
        missingSkills
      );
      setResponse(result.ai_response);
    } catch {
      setResponse("AI assistant is currently unavailable.");
    }
    setLoading(false);
  }

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-purple-400">
        Ask ResumeAI
      </h3>

      <button
        onClick={handleAskAI}
        className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold transition"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && (
        <pre className="mt-6 whitespace-pre-wrap text-gray-300 text-sm">
          {response}
        </pre>
      )}
    </div>
  );
}
