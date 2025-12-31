import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

/* Pages */
import Login from "./components/Login";
import Signup from "./components/Signup";
import DashboardHome from "./components/DashboardHome";
import ResumeUploader from "./components/ResumeUploader";
import History from "./components/History";
import Profile from "./components/Profile";

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (!user) {
    return <AuthWrapper onLogin={() => setUser(auth.currentUser)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex">
      <aside className="w-64 bg-black/40 p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-purple-400 mb-8">ResumeAI</h2>

        <nav className="space-y-4">
          <SidebarItem label="Dashboard" onClick={() => setPage("dashboard")} />
          <SidebarItem label="Analyze Resume" onClick={() => setPage("analyze")} />
          <SidebarItem label="History" onClick={() => setPage("history")} />
          <SidebarItem label="Profile" onClick={() => setPage("profile")} />
          <SidebarItem label="Logout" danger onClick={handleLogout} />
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {page === "dashboard" && <DashboardHome />}
        {page === "analyze" && (
          <ResumeUploader selectedHistory={selectedHistory} />
        )}
        {page === "history" && (
          <History
            onSelect={setSelectedHistory}
            goAnalyze={() => setPage("analyze")}
          />
        )}
        {page === "profile" && <Profile />}
      </main>
    </div>
  );

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
  }
}

/* ===============================
   AUTH WRAPPER
================================ */
function AuthWrapper({ onLogin }) {
  const [mode, setMode] = useState("login");

  return mode === "login" ? (
    <Login onSwitch={() => setMode("signup")} onSuccess={onLogin} />
  ) : (
    <Signup onSwitch={() => setMode("login")} onSuccess={onLogin} />
  );
}

/* ===============================
   SIDEBAR ITEM
================================ */
function SidebarItem({ label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left transition ${
        danger ? "text-red-400 hover:text-red-500" : "hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
