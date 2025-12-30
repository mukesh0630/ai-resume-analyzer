import { useState } from "react";

/* Pages / Components */
import Login from "./components/Login";
import ResumeUploader from "./components/ResumeUploader";
import History from "./components/History";
import DashboardHome from "./components/DashboardHome";

/* ===============================
   MAIN APP
================================ */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // demo
  const [activePage, setActivePage] = useState("dashboard");

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
          <SidebarItem label="Dashboard" onClick={() => setActivePage("dashboard")} />
          <SidebarItem label="Analyze Resume" onClick={() => setActivePage("analyze")} />
          <SidebarItem label="History" onClick={() => setActivePage("history")} />
          <SidebarItem label="Profile" onClick={() => setActivePage("profile")} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activePage === "dashboard" && <DashboardHome />}
        {activePage === "analyze" && <ResumeUploader />}
        {activePage === "history" && <History />}
        {activePage === "profile" && <Profile />}
      </main>
    </div>
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
   SIDEBAR ITEM
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
