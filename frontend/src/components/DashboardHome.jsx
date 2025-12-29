import { useEffect, useState } from "react";
import { fetchHistory } from "../api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory("demo-user").then(res => setHistory(res.history || []));
  }, []);

  return (
    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-semibold mb-4">Analysis History</h2>

      {history.length === 0 && (
        <p className="text-gray-400">No history found.</p>
      )}

      {history.map((h, i) => (
        <div key={i} className="bg-black/40 p-4 rounded-xl mb-3">
          <p>ATS Score: {h.ats_score?.toFixed(2)}%</p>
          <p className="text-sm text-gray-400">
            {new Date(h.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
