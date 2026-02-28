import { useState } from "react";

export default function AIChat({
  resumeText = "",
  jobDesc = "",
  missingSkills = [],
  atsScore = 0,
  analysisInsights = null,
}) {
  const [showDetails, setShowDetails] = useState(false);

  // Use the insights from comprehensive analysis
  const insights = analysisInsights || {};
  const aiData = insights.ai_insights ? {
    summary: insights.summary,
    strength_areas: insights.strength_areas || [],
    weakness_areas: insights.weakness_areas || [],
    actionable_recommendations: insights.actionable_recommendations || [],
    next_steps: insights.next_steps || [],
    ai_insights: insights.ai_insights,
  } : null;

  return (
    <div className="mt-10 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-2 text-purple-400">
        💡 AI-Powered Insights
      </h3>

      <p className="text-sm text-gray-400 mb-6">
        Based on your comprehensive analysis (Score: <strong>{Math.round(atsScore)}/100</strong>)
      </p>

      {aiData && (
        <div className="space-y-6 text-gray-300 text-sm">
          {aiData.ai_insights && (
            <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 mb-3">📊 Analysis Summary</h4>
              <p className="text-gray-300 leading-relaxed">{aiData.ai_insights}</p>
            </div>
          )}

          {aiData.strength_areas && aiData.strength_areas.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-300 mb-3">✓ Your Strengths</h4>
              <ul className="space-y-2">
                {aiData.strength_areas.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiData.weakness_areas && aiData.weakness_areas.length > 0 && (
            <div>
              <h4 className="font-semibold text-orange-300 mb-3">⚡ Areas to Improve</h4>
              <ul className="space-y-2">
                {aiData.weakness_areas.map((w, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-orange-400 mt-0.5">→</span>
                    <span className="text-gray-300">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiData.actionable_recommendations && aiData.actionable_recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-300 mb-3">💡 Recommendations</h4>
              <ul className="space-y-2">
                {aiData.actionable_recommendations.slice(0, 5).map((rec, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span className="text-gray-300">{typeof rec === 'string' ? rec : rec.recommendation || rec.action || JSON.stringify(rec)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-purple-400 hover:text-purple-300 mt-4 font-semibold"
          >
            {showDetails ? "✕ Hide Details" : "+ View Full Insights"}
          </button>

          {showDetails && aiData.next_steps && aiData.next_steps.length > 0 && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-300 mb-3">📋 Next Steps</h5>
              <ol className="space-y-2 list-decimal list-inside">
                {aiData.next_steps.map((step, i) => (
                  <li key={i} className="text-gray-400">
                    <span className="font-semibold">{step.action || step.step || "Step " + (i + 1)}</span>
                    {step.reason && <div className="text-xs text-gray-500 ml-6 mt-1">{step.reason}</div>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {!aiData && (
        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
          <p className="text-gray-400">Run analysis first to see AI insights</p>
        </div>
      )}
    </div>
  );
}
