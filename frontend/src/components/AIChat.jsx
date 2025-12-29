import { useState } from "react";
import { askResumeAI } from "../api";

export default function AIChat({
  resumeText = "",
  jobDesc = "",
  missingSkills = [],
  atsScore = 0,
}) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!resumeText || !jobDesc) {
      setResponse("Please analyze a resume first.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const result = await askResumeAI(
        resumeText,
        jobDesc,
        atsScore,
        missingSkills
      );

      setResponse(result.ai_response);
    } catch (err) {
      console.error(err);
      setResponse("AI assistant is currently unavailable.");
    }

    setLoading(false);
  }

  return (
    <div className="mt-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-purple-400">
        Smart AI Insights
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        Personalized resume feedback and learning suggestions
      </p>

      <button
        onClick={askAI}
        disabled={loading}
        className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Generate AI Insights"}
      </button>

      {response && (
        <div className="mt-6 text-gray-300 text-sm space-y-2">
          {response.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
