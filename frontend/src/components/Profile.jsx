import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { fetchHistory } from "../api";

export default function Profile() {
  const user = auth.currentUser;
  const [history, setHistory] = useState([]);
  const [avgATS, setAvgATS] = useState(0);
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchHistory(user.uid).then((res) => {
      const h = res.history || [];
      setHistory(h);

      if (h.length > 0) {
        const avg =
          h.reduce((sum, i) => sum + (i.ats_score || 0), 0) / h.length;
        setAvgATS(Math.round(avg));
      }

      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (avgATS < 40) setLevel("Beginner");
    else if (avgATS < 65) setLevel("Intermediate");
    else if (avgATS < 80) setLevel("Advanced");
    else setLevel("Pro");
  }, [avgATS]);

  if (!user) {
    return <p className="text-gray-400">Not logged in</p>;
  }

  if (loading) {
    return (
      <div className="text-gray-400 text-center mt-20">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20
                      border border-white/10 rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-300">
          Manage your ResumeAI account and performance
        </p>
      </div>

      {/* USER INFO */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card title="Account Information">
          <p><b>Email:</b> {user.email}</p>
          <p><b>User ID:</b> {user.uid.slice(0, 10)}...</p>
          <p>
            <b>Provider:</b>{" "}
            {user.providerData[0]?.providerId === "password"
              ? "Email & Password"
              : "Google"}
          </p>
        </Card>

        <Card title="Career Level">
          <p className="text-gray-300 mb-2">Current Level</p>
          <h3 className="text-3xl font-bold text-purple-400">{level}</h3>

          <div className="mt-4">
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                style={{ width: `${avgATS}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Avg ATS Score: {avgATS}%
            </p>
          </div>
        </Card>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <StatCard
          title="Total Analyses"
          value={history.length}
        />

        <StatCard
          title="Best ATS Score"
          value={
            history.length
              ? Math.max(...history.map(h => h.ats_score || 0)) + "%"
              : "—"
          }
        />

        <StatCard
          title="Avg ATS Score"
          value={avgATS + "%"}
        />

      </div>

      {/* ACCOUNT STATUS */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Account Status</h2>

        <ul className="space-y-2 text-gray-300">
          <li>✔ Resume analysis enabled</li>
          <li>✔ AI insights enabled</li>
          <li>✔ PDF report downloads enabled</li>
          <li>✔ History tracking enabled</li>
        </ul>
      </div>

      {/* SECURITY */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Security</h2>

        <p className="text-gray-300 text-sm">
          Authentication handled securely via Firebase.
        </p>

        <ul className="mt-3 text-gray-400 text-sm space-y-1">
          <li>• Encrypted authentication</li>
          <li>• OAuth (Google Sign-In)</li>
          <li>• Session persistence enabled</li>
        </ul>
      </div>

    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Card({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-2 text-gray-300">{children}</div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
  );
}
