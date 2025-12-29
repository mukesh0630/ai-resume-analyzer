export default function DashboardIntro() {
  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 
                    border border-white/10 rounded-3xl p-8 mb-10">
      
      <h1 className="text-4xl font-bold mb-4 text-white">
        AI Resume Intelligence Dashboard
      </h1>

      <p className="text-gray-300 max-w-3xl leading-relaxed">
        Upload your resume, compare it with job descriptions, and instantly
        see how well it performs against modern ATS systems.
        Get AI-powered insights, learning roadmaps, and track your progress
        over time.
      </p>

      <ul className="mt-6 space-y-2 text-gray-300">
        <li>✔ ATS Score with real-time animation</li>
        <li>✔ Skill gap & similarity analysis</li>
        <li>✔ AI-powered career insights</li>
        <li>✔ Progress tracking & resume history</li>
      </ul>
    </div>
  );
}
