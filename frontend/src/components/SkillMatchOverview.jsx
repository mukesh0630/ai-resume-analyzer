/**
 * Skill Match Overview - Clear visualization of matched vs missing skills
 * Shows percentage match and actionable skill lists
 */

import { useEffect, useState } from "react";

export default function SkillMatchOverview({ 
  matchedSkills = [], 
  missingSkills = [], 
  partialMatchSkills = [] 
}) {
  const totalSkills = matchedSkills.length + missingSkills.length;
  const matchPercentage = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 0;
  
  // Animated counter
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5 seconds
    const increment = matchPercentage / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= matchPercentage) {
        setAnimatedPercentage(matchPercentage);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(Math.round(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [matchPercentage]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-white">Skill Match Analysis</h3>

      {/* Match percentage - Large visual indicator with animation */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-700/70 to-gray-800/70 rounded-lg p-8 shadow-lg">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#1f2937"
                strokeWidth="10"
              />
              {/* Progress circle with animation */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={animatedPercentage >= 80 ? "#10b981" : animatedPercentage >= 60 ? "#3b82f6" : animatedPercentage >= 40 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={`${(animatedPercentage / 100) * 314} 314`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${animatedPercentage >= 80 ? "#10b98180" : animatedPercentage >= 60 ? "#3b82f680" : animatedPercentage >= 40 ? "#f59e0b80" : "#ef444480"})`
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-black text-white">{animatedPercentage}%</div>
                <div className="text-sm text-gray-400 font-semibold mt-1">ATS Match</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-lg font-bold text-white">{matchedSkills.length} of {totalSkills} skills matched</p>
            <p className="text-sm text-gray-400 mt-1">
              {animatedPercentage >= 80 && "🎉 Excellent alignment!"}
              {animatedPercentage >= 60 && animatedPercentage < 80 && "✨ Strong candidate"}
              {animatedPercentage >= 40 && animatedPercentage < 60 && "💪 Good foundation"}
              {animatedPercentage < 40 && "📚 Room to grow"}
            </p>
          </div>
        </div>

        {/* Skill status boxes */}
        <div className="space-y-3">
          {/* Matched */}
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">✓ Matched Skills ({matchedSkills.length})</h4>
            <p className="text-sm text-gray-300">
              You have these core skills. Great job!
            </p>
          </div>

          {/* Partial matches */}
          {partialMatchSkills.length > 0 && (
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">◐ Partial Match ({partialMatchSkills.length})</h4>
              <p className="text-sm text-gray-300">
                You have similar skills. These are close!
              </p>
            </div>
          )}

          {/* Missing */}
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">✕ Missing Skills ({missingSkills.length})</h4>
            <p className="text-sm text-gray-300">
              Focus on learning these to improve fit.
            </p>
          </div>
        </div>
      </div>

      {/* Skill lists */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Matched Skills */}
        <div className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-green-500">
          <h4 className="text-green-400 font-semibold mb-3 text-sm">Matched ({matchedSkills.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-block bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-xs mr-2 mb-2"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-xs italic">None matched yet</p>
            )}
          </div>
        </div>

        {/* Partial Match Skills */}
        {partialMatchSkills.length > 0 && (
          <div className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-blue-500">
            <h4 className="text-blue-400 font-semibold mb-3 text-sm">Partial Match ({partialMatchSkills.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {partialMatchSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-block bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-xs mr-2 mb-2"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        <div className={`bg-gray-700/50 rounded-lg p-4 border-l-4 border-red-500 ${!partialMatchSkills.length ? 'md:col-span-2' : ''}`}>
          <h4 className="text-red-400 font-semibold mb-3 text-sm">Missing ({missingSkills.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {missingSkills.length > 0 ? (
              missingSkills.slice(0, 10).map((skill, i) => (
                <span
                  key={i}
                  className="inline-block bg-red-900/50 text-red-300 px-3 py-1 rounded-full text-xs mr-2 mb-2"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-xs italic">No missing skills - Perfect match!</p>
            )}
            {missingSkills.length > 10 && (
              <p className="text-gray-400 text-xs mt-2">+ {missingSkills.length - 10} more</p>
            )}
          </div>
        </div>
      </div>

      {/* Educational note */}
      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border-l-4 border-yellow-500">
        <p className="text-sm text-gray-300">
          <strong>💡 Quick Tips:</strong> 
          {matchPercentage >= 80 && " You're well-aligned! Consider applying and refining 1-2 missing skills in parallel."}
          {matchPercentage >= 60 && matchPercentage < 80 && " You're a strong candidate. Focus on the 1-2 most critical missing skills."}
          {matchPercentage >= 40 && matchPercentage < 60 && " You have good fundamentals. A 4-6 week learning sprint on missing skills could make you competitive."}
          {matchPercentage < 40 && " Consider starting with entry-level roles or a structured learning plan in these skills."}
        </p>
      </div>
    </div>
  );
}
