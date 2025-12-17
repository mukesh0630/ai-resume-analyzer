import { useState } from "react";

/* Components */
import Login from "./components/Login.jsx";
import ResumeUploader from "./components/ResumeUploader.jsx";
import ATSScoreRing from "./components/ATSScoreRing.jsx";
import SkillGapChart from "./components/SkillGapChart.jsx";
import History from "./components/History.jsx";

/* ===============================
   MAIN APP
================================ */
export default function App() {
  // fake auth state (will connect Firebase later)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginWrapper onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Dashboard />;
}

/* ===============================
   LOGIN WRAPPER
================================ */
function LoginWrapper({ onLogin }) {
  return (
    <div onClick={onLogin}>
      <Login />
    </div>
  );
}

/* ===============================
   DASHBOARD
================================ */
function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-blue-400 mb-8">
          ResumeAI
        </h2>

        <nav className="space-y-4 text-gray-300">
          <div className="hover:text-white cursor-pointer">Dashboard</div>
          <div className="hover:text-white cursor-pointer">Analyze Resume</div>
          <div className="hover:text-white cursor-pointer">History</div>
          <div className="hover:text-white cursor-pointer">Profile</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">

        <h1 className="text-4xl font-bold mb-8">
          AI Resume Intelligence Dashboard
        </h1>

        {/* Resume Upload */}
        <div className="mb-10">
          <ResumeUploader />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex justify-center">
            <ATSScoreRing score={82} />
          </div>

          <StatCard title="Skill Match" value="74%" />
          <StatCard title="Similarity" value="68%" />

        </div>

        {/* Skill Gap Chart */}
        <div className="mb-10">
          <SkillGapChart />
        </div>
        <div className="mt-10">
          <History />
        </div>

        {/* Smart Insights */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">
            Smart Insights
          </h2>
          <p className="text-gray-300">
            Your resume performs well, but adding Docker and AWS
            can significantly improve shortlisting chances.
          </p>
        </div>

      </main>
    </div>
  );
}

/* ===============================
   STAT CARD
================================ */
function StatCard({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-white/10">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
  );
}
