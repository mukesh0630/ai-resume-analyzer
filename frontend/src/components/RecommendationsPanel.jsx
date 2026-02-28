/**
 * Recommendations Panel - Actionable next steps based on analysis
 * Shows prioritized recommendations for improvement
 */

export default function RecommendationsPanel({ 
  recommendations = [],
  nextSteps = [],
  overallScore = 0,
  strengths = [],
  weaknesses = []
}) {
  // Prioritize recommendations by urgency
  const priorityLevels = {
    critical: { color: 'red', icon: '🔴', label: 'Critical' },
    high: { color: 'orange', icon: '🟠', label: 'High Priority' },
    medium: { color: 'yellow', icon: '🟡', label: 'Medium Priority' },
    low: { color: 'green', icon: '🟢', label: 'Nice to Have' }
  };

  // Sort recommendations by priority
  const prioritizedRecs = [...recommendations].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-white">Your Development Roadmap</h3>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-5">
            <h4 className="text-green-400 font-bold mb-4 text-lg">💪 Your Strengths</h4>
            <ul className="space-y-2">
              {strengths.slice(0, 5).map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span className="text-gray-300 text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Growth Areas */}
        {weaknesses.length > 0 && (
          <div className="bg-amber-900/20 border border-amber-600/50 rounded-lg p-5">
            <h4 className="text-amber-400 font-bold mb-4 text-lg">📈 Areas to Develop</h4>
            <ul className="space-y-2">
              {weaknesses.slice(0, 5).map((weakness, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span className="text-gray-300 text-sm">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Prioritized Action Items */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-white mb-4">🎯 Prioritized Action Items</h4>
        <div className="space-y-3">
          {prioritizedRecs.length > 0 ? (
            prioritizedRecs.map((rec, i) => {
              const priority = priorityLevels[rec.priority] || priorityLevels.low;
              return (
                <div 
                  key={i} 
                  className={`border-l-4 border-${priority.color}-500 bg-gray-700/50 rounded-lg p-4`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{priority.icon}</span>
                    <div className="flex-1">
                      <h5 className={`font-bold text-${priority.color}-300 mb-1`}>
                        {rec.title || rec}
                      </h5>
                      {rec.description && (
                        <p className="text-sm text-gray-300 mb-2">{rec.description}</p>
                      )}
                      {rec.timeframe && (
                        <p className="text-xs text-gray-400">
                          ⏱️ Expected timeline: <strong>{rec.timeframe}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-700/50 rounded-lg p-4 text-gray-400 text-center">
              <p>No specific recommendations at this time. Keep improving! 🚀</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps Timeline */}
      {nextSteps.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-white mb-4">📋 Your Action Plan</h4>
          <div className="space-y-0">
            {nextSteps.map((step, i) => (
              <div 
                key={i}
                className={`flex gap-4 p-4 ${i !== nextSteps.length - 1 ? 'border-b border-gray-600' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  {i !== nextSteps.length - 1 && (
                    <div className="w-1 h-12 bg-blue-600 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h5 className="font-semibold text-white mb-1">{step.title || step}</h5>
                  {step.description && (
                    <p className="text-sm text-gray-400 mb-2">{step.description}</p>
                  )}
                  {step.resources && (
                    <div className="text-xs text-blue-400">
                      📚 Resources: <span className="text-gray-300">{step.resources}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall guidance */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-600/50 rounded-lg p-5">
        <h4 className="text-blue-300 font-bold mb-3">💡 Personalized Guidance</h4>
        
        {overallScore >= 80 && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>🎉 <strong>Excellent job!</strong> Your resume is well-aligned with this role.</p>
            <p>Next steps: Apply now! While waiting for responses, deepen your knowledge in your weak areas to strengthen future applications.</p>
          </div>
        )}
        
        {overallScore >= 60 && overallScore < 80 && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>✨ <strong>You're a strong candidate!</strong> You have the foundation for this role.</p>
            <p>Next steps: Spend 2-4 weeks learning the top missing skills, then apply. This will significantly improve your chances.</p>
          </div>
        )}
        
        {overallScore >= 40 && overallScore < 60 && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>💪 <strong>You have good potential!</strong> You need targeted learning to bridge the gap.</p>
            <p>Next steps: Follow the prioritized action items above. A 4-8 week focused learning sprint will position you well for this role.</p>
          </div>
        )}
        
        {overallScore < 40 && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>🚀 <strong>Great opportunity to grow!</strong> Consider starting with entry-level roles or intensive skill-building.</p>
            <p>Next steps: Create a learning roadmap using the action items. Consider bootcamps or structured courses for the critical skills.</p>
          </div>
        )}
      </div>
    </div>
  );
}
