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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-400">ResumeAI</h2>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 hover:bg-gray-800 rounded-lg transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Sidebar - Fixed on Desktop, Toggleable on Mobile */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-black/40 backdrop-blur-sm p-6 z-40
        transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <h2 className="text-2xl font-bold text-purple-400 mb-8 mt-2">ResumeAI</h2>

        <nav className="space-y-4">
          <SidebarItem 
            label="Dashboard" 
            onClick={() => {
              setPage("dashboard");
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarItem 
            label="Analyze Resume" 
            onClick={() => {
              setPage("analyze");
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarItem 
            label="History" 
            onClick={() => {
              setPage("history");
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarItem 
            label="Profile" 
            onClick={() => {
              setPage("profile");
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarItem 
            label="Logout" 
            danger 
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }} 
          />
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0 p-4 md:p-8 min-h-screen">
        {page === "dashboard" && <DashboardHome />}
        {page === "analyze" && (
  <ResumeUploader selectedHistory={selectedHistory} />
)}

        {page === "history" && (
  <History
    onSelect={(item) => {
      setSelectedHistory(item);
      setPage("analyze");
    }}
  />
)}
        {page === "profile" && <Profile user={user} />}
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
      className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
        danger 
          ? "text-red-400 hover:text-red-500 hover:bg-red-900/20" 
          : "text-gray-300 hover:text-white hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
