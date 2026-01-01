import { useEffect, useState } from "react";
import { fetchHistory } from "../api";
import { auth } from "../firebase";

export default function History({ onSelect, goAnalyze }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (!user) return;

    fetchHistory(user.uid).then((res) => {
      if (res.history) {
        const sorted = res.history.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setHistory(sorted);
      }
    });
  });

  return () => unsubscribe();
}, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">
        Analysis History
      </h2>

      {history.length === 0 && (
        <p className="text-gray-400">No analysis history yet.</p>
      )}

      <div className="space-y-4">
        {history.map((item, index) => {
          const createdAt = item.created_at?.seconds
            ? new Date(item.created_at.seconds * 1000)
            : new Date(item.created_at);

          return (
            <div
              key={index}
              onClick={() => {
                if (onSelect) onSelect(item);
                if (goAnalyze) goAnalyze();
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-purple-400 transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  ATS Score: {item.ats_score}%
                </h3>
                <span className="text-sm text-gray-400">
                  {createdAt.toLocaleString()}
                </span>
              </div>

              <p className="mt-3 text-gray-300">
                Missing Skills:
                {item.missing_skills?.length > 0
                  ? ` ${item.missing_skills.join(", ")}`
                  : " None 🎉"}
              </p>

              <ul className="mt-3 list-disc ml-5 text-gray-400 text-sm">
                {item.feedback?.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
