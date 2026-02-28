/**
 * Candidate Level Card - Shows user's current skill level stage
 * Educates users about where they stand in the hiring pipeline
 */

export default function CandidateLevelCard({ score = 0 }) {
  // Determine level based on score
  let level, levelColor, levelBkgColor, description, emoji;

  if (score >= 80) {
    level = "Strong Candidate";
    levelColor = "text-green-400";
    levelBkgColor = "bg-green-900/20";
    emoji = "🌟";
    description =
      "You're incredibly well-aligned with this role. You have nearly all the required skills and experience. Apply now and prepare for interviews with confidence!";
  } else if (score >= 70) {
    level = "Job Ready";
    levelColor = "text-emerald-400";
    levelBkgColor = "bg-emerald-900/20";
    emoji = "✨";
    description =
      "You're ready for this position! You have the core skills needed. A few weeks of targeted learning on missing skills will make you highly competitive.";
  } else if (score >= 50) {
    level = "Intermediate";
    levelColor = "text-blue-400";
    levelBkgColor = "bg-blue-900/20";
    emoji = "💪";
    description =
      "You have a solid foundation and relevant skills. Focus on learning the key missing skills over the next 4-8 weeks to become a strong candidate.";
  } else if (score >= 30) {
    level = "Beginner";
    levelColor = "text-amber-400";
    levelBkgColor = "bg-amber-900/20";
    emoji = "🚀";
    description =
      "You're at the beginning of your journey for this role. Don't worry! Follow the learning roadmap and you can reach Job Ready status in 8-12 weeks.";
  } else {
    level = "Starting Out";
    levelColor = "text-orange-400";
    levelBkgColor = "bg-orange-900/20";
    emoji = "📚";
    description =
      "This role is a stretch goal, which is great for growth! Consider starting with entry-level roles or completing foundational courses first.";
  }

  // Progress stages for visual representation
  const stages = [
    { label: "Beginner", threshold: 30, color: "bg-orange-500" },
    { label: "Intermediate", threshold: 50, color: "bg-blue-500" },
    { label: "Job Ready", threshold: 70, color: "bg-emerald-500" },
    { label: "Strong", threshold: 80, color: "bg-green-500" },
  ];

  return (
    <div className={`${levelBkgColor} border-2 border-l-8 rounded-xl p-8 my-6`}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Level display */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className={`text-3xl font-bold ${levelColor} mb-2`}>{level}</h2>
          <div className="text-5xl font-black text-white mb-4">{score}</div>
          <div className="text-sm text-gray-400 mb-6">out of 100</div>

          {/* Score progress bar */}
          <div className="w-full mb-4">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  score >= 80
                    ? "bg-green-500"
                    : score >= 70
                    ? "bg-emerald-500"
                    : score >= 50
                    ? "bg-blue-500"
                    : score >= 30
                    ? "bg-amber-500"
                    : "bg-orange-500"
                }`}
                style={{ width: `${Math.min(score, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Right: Description and guidance */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg mb-3">Where You Stand</h3>
            <p className="text-gray-300 leading-relaxed">{description}</p>
          </div>

          {/* Progression path */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3">PROGRESSION PATH</h3>
            <div className="flex gap-2">
              {stages.map((stage, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                      score >= stage.threshold
                        ? stage.color
                        : "bg-gray-700"
                    } transition-all duration-500`}
                  >
                    {score >= stage.threshold ? "✓" : Math.ceil(stage.threshold / 25)}
                  </div>
                  <span className="text-xs text-gray-400 text-center font-semibold">
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Motivational tips based on level */}
      <div className="mt-6 pt-6 border-t border-gray-600">
        <h3 className="text-white font-bold mb-3">💡 Quick Wins You Can Achieve</h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {score >= 80 && (
            <>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>✓</span>
                <span>Apply to similar positions immediately</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>✓</span>
                <span>Prepare for technical interview questions</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>✓</span>
                <span>Polish your LinkedIn profile</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>✓</span>
                <span>Deepen knowledge in any weak areas</span>
              </li>
            </>
          )}
          {score >= 70 && score < 80 && (
            <>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>→</span>
                <span>Spend 2-4 weeks learning top missing skills</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>→</span>
                <span>Build a small project using those skills</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>→</span>
                <span>Apply after skill improvement</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>→</span>
                <span>Start networking in the industry</span>
              </li>
            </>
          )}
          {score >= 50 && score < 70 && (
            <>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>📚</span>
                <span>Enroll in courses for top 3 missing skills</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>📚</span>
                <span>Build portfolio projects with new skills</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>📚</span>
                <span>Join communities related to this field</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>📚</span>
                <span>Apply to entry-level positions in parallel</span>
              </li>
            </>
          )}
          {score < 50 && (
            <>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>🎓</span>
                <span>Follow a structured learning path</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>🎓</span>
                <span>Complete foundational courses first</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>🎓</span>
                <span>Build projects as you learn</span>
              </li>
              <li className="text-sm text-gray-300 flex gap-2">
                <span>🎓</span>
                <span>Reapply after 2-3 months of focused learning</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
