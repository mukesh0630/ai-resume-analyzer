/**
 * Clear horizontal score breakdown chart
 * Shows each component's contribution to overall score
 */

export default function ScoreBreakdownChart({ breakdown = {} }) {
  const components = [
    { label: "Skills Match", value: breakdown.skills || 0, color: "bg-blue-500", weight: 40 },
    { label: "Experience", value: breakdown.experience || 0, color: "bg-purple-500", weight: 20 },
    { label: "Projects", value: breakdown.projects || 0, color: "bg-pink-500", weight: 15 },
    { label: "Education", value: breakdown.education || 0, color: "bg-green-500", weight: 10 },
    { label: "Keywords & Format", value: breakdown.keywords_formatting || 0, color: "bg-yellow-500", weight: 10 },
    { label: "Certifications", value: breakdown.certifications || 0, color: "bg-orange-500", weight: 5 },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-white">Score Breakdown</h3>
      
      <div className="space-y-4">
        {components.map((comp) => (
          <div key={comp.label}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-300">
                {comp.label}
                <span className="text-xs text-gray-500 ml-2">({comp.weight}% weight)</span>
              </label>
              <span className="text-lg font-bold text-white">
                {Math.round(comp.value)}/100
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`${comp.color} h-full transition-all duration-500`}
                style={{ width: `${comp.value}%` }}
              />
            </div>
            
            {/* Status indicator */}
            <div className="mt-1 text-xs text-gray-400">
              {comp.value >= 80 && <span className="text-green-400">✓ Excellent</span>}
              {comp.value >= 60 && comp.value < 80 && <span className="text-blue-400">◐ Good</span>}
              {comp.value >= 40 && comp.value < 60 && <span className="text-yellow-400">⊘ Fair</span>}
              {comp.value < 40 && <span className="text-red-400">✕ Needs Work</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border-l-4 border-purple-500">
        <p className="text-sm text-gray-300">
          <strong>How it works:</strong> Your overall score is the weighted average of all components above.
          Focus on improving the areas marked "Needs Work" to boost your candidacy.
        </p>
      </div>
    </div>
  );
}
