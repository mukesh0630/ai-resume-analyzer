import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "./firebase";
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
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  /* 🔐 Auth Persistence */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <AuthWrapper
        onLogin={() => setUser(auth.currentUser)}
      />
    );
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
          <SidebarItem label="Logout" onClick={handleLogout} danger />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        {page === "dashboard" && <DashboardHome />}
        {page === "analyze" && <ResumeUploader />}
        {page === "history" && <History />}
        {page === "profile" && <Profile />}
      </main>
    </div>
  );

  /* 🔓 Logout */
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

  if (mode === "login") {
    return (
      <Login
        onSwitch={() => setMode("signup")}
        onSuccess={onLogin}
      />
    );
  }

  return (
    <Signup
      onSwitch={() => setMode("login")}
      onSuccess={onLogin}
    />
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
