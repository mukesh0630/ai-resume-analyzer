import { useEffect, useState } from "react";
import { fetchHistory } from "../api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory("demo-user").then((res) => {
      if (res.history) {
        // Sort latest first
        const sorted = res.history.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setHistory(sorted);
      }
    });
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
        {history.map((item, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                ATS Score: {item.ats_score}%
              </h3>
              <span className="text-sm text-gray-400">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>

            <p className="mt-3 text-gray-300">
              Missing Skills:
              {item.missing_skills.length > 0
                ? ` ${item.missing_skills.join(", ")}`
                : " None 🎉"}
            </p>

            <ul className="mt-3 list-disc ml-5 text-gray-400 text-sm">
              {item.feedback?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
