import { useState } from "react";
import { askResumeAI } from "../api";

export default function AIChat({
  resumeText = "",
  jobDesc = "",
  missingSkills = [],
  atsScore = 0,
}) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!resumeText || !jobDesc) {
      setAiData({ error: "Please analyze a resume first." });
      return;
    }

    setLoading(true);
    setAiData(null);

    try {
      const result = await askResumeAI(
        resumeText,
        jobDesc,
        atsScore,
        missingSkills
      );

      setAiData(result);
    } catch (err) {
      console.error("AI assistant error:", err);
      setAiData({ error: "AI assistant is currently unavailable." });
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

      {aiData?.error && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
          {aiData.error}
        </div>
      )}

      {aiData && !aiData.error && (
        <div className="mt-6 space-y-6 text-gray-300 text-sm">
          {aiData.summary && (
            <div>
              <h4 className="font-semibold text-purple-300 mb-2">Summary</h4>
              <p className="text-gray-400">{aiData.summary}</p>
            </div>
          )}

          {aiData.strengths && aiData.strengths.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-300 mb-2">Strengths ✓</h4>
              <ul className="list-disc list-inside space-y-1">
                {aiData.strengths.map((s, i) => (
                  <li key={i} className="text-gray-400">{s}</li>
                ))}
              </ul>
            </div>
          )}

          {aiData.weaknesses && aiData.weaknesses.length > 0 && (
            <div>
              <h4 className="font-semibold text-orange-300 mb-2">Areas to Improve ⚡</h4>
              <ul className="list-disc list-inside space-y-1">
                {aiData.weaknesses.map((w, i) => (
                  <li key={i} className="text-gray-400">{w}</li>
                ))}
              </ul>
            </div>
          )}

          {aiData.improvement_tips && aiData.improvement_tips.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">Tips for Improvement 💡</h4>
              <ul className="list-disc list-inside space-y-1">
                {aiData.improvement_tips.map((tip, i) => (
                  <li key={i} className="text-gray-400">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
