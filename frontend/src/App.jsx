import { useState } from "react";
import Login from "./components/Login";
import ResumeUploader from "./components/ResumeUploader";
import History from "./components/History";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [page, setPage] = useState("dashboard");

  if (!isLoggedIn) return <Login />;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar setPage={setPage} page={page} />
      <main className="flex-1 p-8 overflow-y-auto">
        {page === "dashboard" && <Dashboard />}
        {page === "analyze" && <ResumeUploader />}
        {page === "history" && <History />}
        {page === "profile" && <Profile />}
      </main>
    </div>
  );
}

function Sidebar({ setPage, page }) {
  const item = (id, label) => (
    <div
      onClick={() => setPage(id)}
      className={`cursor-pointer p-2 rounded-lg ${
        page === id ? "bg-blue-500/20 text-blue-400" : "text-gray-300"
      }`}
    >
      {label}
    </div>
  );

  return (
    <aside className="w-64 p-6 bg-black/40 border-r border-white/10">
      <h1 className="text-2xl font-bold text-blue-400 mb-6">ResumeAI</h1>
      {item("dashboard", "Dashboard")}
      {item("analyze", "Analyze Resume")}
      {item("history", "History")}
      {item("profile", "Profile")}
    </aside>
  );
}

function Dashboard() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">AI Resume Analyzer</h1>
      <p className="text-gray-300 max-w-2xl">
        Upload your resume, compare it with job descriptions, improve ATS score,
        discover missing skills, and follow AI-guided learning roadmaps.
      </p>
    </>
  );
}

function Profile() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="text-gray-300">User analytics & settings coming soon.</p>
    </>
  );
}
