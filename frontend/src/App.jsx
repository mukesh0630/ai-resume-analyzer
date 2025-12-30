import { useState } from "react";

/* Pages */
import Login from "./components/Login";
import ResumeUploader from "./components/ResumeUploader";
import History from "./components/History";

/* UI Components */
import ATSScoreRing from "./components/ATSScoreRing";
import SkillGapChart from "./components/SkillGapChart";

/* ===============================
   MAIN APP
================================ */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // demo true
  const [page, setPage] = useState("dashboard");

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-purple-400 mb-8">
          ResumeAI
        </h2>

        <nav className="space-y-4 text-gray-300">
          <SidebarItem label="Dashboard" onClick={() => setPage("dashboard")} />
          <SidebarItem label="Analyze Resume" onClick={() => setPage("analyze")} />
          <SidebarItem label="History" onClick={() => setPage("history")} />
          <SidebarItem label="Profile" onClick={() => setPage("profile")} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {page === "dashboard" && <DashboardHome />}
        {page === "analyze" && <ResumeUploader />}
        {page === "history" && <History />}
        {page === "profile" && <Profile />}
      </main>
    </div>
  );
}

/* ===============================
   DASHBOARD HOME
================================ */
function DashboardHome() {
  return (
    <>
      {/* INTRO */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 
                      border border-white/10 rounded-3xl p-8 mb-10">
        <h1 className="text-4xl font-bold mb-4">
          AI Resume Intelligence Dashboard
        </h1>

        <p className="text-gray-300 max-w-3xl">
          Upload your resume, compare it with job descriptions, and instantly
          see how well it performs against modern ATS systems.
          Get AI-powered insights and personalized learning roadmaps.
        </p>

        <ul className="mt-6 space-y-2 text-gray-300">
          <li>✔ ATS Score with animation</li>
          <li>✔ Skill gap & similarity analysis</li>
          <li>✔ AI-powered career guidance</li>
          <li>✔ Resume history tracking</li>
        </ul>
      </div>
    </>
  );
}

/* ===============================
   PROFILE
================================ */
function Profile() {
  const avgATS = 68;
  const level =
    avgATS < 40 ? "Beginner" :
    avgATS < 65 ? "Intermediate" :
    avgATS < 80 ? "Advanced" : "Pro";

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <h2 className="text-3xl font-bold mb-4">Profile</h2>

      <p className="text-gray-300 mb-2">User Level</p>
      <h3 className="text-2xl font-semibold text-purple-400">{level}</h3>

      <p className="mt-4 text-gray-400">
        Improve your ATS score to level up and unlock better insights.
      </p>
    </div>
  );
}

/* ===============================
   REUSABLE UI
================================ */
function SidebarItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left hover:text-white transition"
    >
      {label}
    </button>
  );
}

function StatCard({ title, value }) {
  return (
    <Card>
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </Card>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex justify-center items-center">
      {children}
    </div>
  );
}
