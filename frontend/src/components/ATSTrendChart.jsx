/**
 * ATS Score Trend - Simple HTML/CSS visualization
 * Shows score progression over analysis history
 */

export default function ATSTrendChart({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-white">ATS Score Trend</h3>
        <p className="text-gray-400 text-center py-8">No analysis history yet. Upload and analyze a resume to see trends!</p>
      </div>
    );
  }

  const maxScore = 100;
  const minScore = Math.min(...history.map(h => h.ats_score || 0));
  const maxHistoryScore = Math.max(...history.map(h => h.ats_score || 0));

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">ATS Score Trend</h3>
        <span className="text-sm text-gray-400">{history.length} analysis(es)</span>
      </div>

      {/* Score timeline bars */}
      <div className="space-y-4">
        {history.slice(-5).map((h, idx) => (
          <div key={idx} className="flex items-center gap-4">
            {/* Label */}
            <div className="w-20 text-sm text-gray-400">
              Run {idx + 1}
            </div>

            {/* Bar container */}
            <div className="flex-1 flex items-center gap-2">
              {/* Progress bar */}
              <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 flex items-center justify-end pr-2 ${
                    h.ats_score >= 80
                      ? "bg-gradient-to-r from-green-600 to-green-500"
                      : h.ats_score >= 60
                      ? "bg-gradient-to-r from-blue-600 to-blue-500"
                      : h.ats_score >= 40
                      ? "bg-gradient-to-r from-yellow-600 to-yellow-500"
                      : "bg-gradient-to-r from-red-600 to-red-500"
                  }`}
                  style={{ width: `${(h.ats_score / maxScore) * 100}%` }}
                >
                  {h.ats_score > 30 && (
                    <span className="text-white font-bold text-sm">{h.ats_score}</span>
                  )}
                </div>
              </div>

              {/* Score label */}
              <span className="w-12 text-right font-bold text-white">{h.ats_score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Current</p>
          <p className="text-2xl font-bold text-white">{history[history.length - 1]?.ats_score || 0}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Highest</p>
          <p className="text-2xl font-bold text-green-400">{maxHistoryScore}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Improvement</p>
          <p className="text-2xl font-bold text-blue-400">
            {maxHistoryScore - (history[0]?.ats_score || 0)}
          </p>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 text-sm text-gray-400">
        📈 Showing last {Math.min(5, history.length)} analyses
      </div>
    </div>
  );
}
