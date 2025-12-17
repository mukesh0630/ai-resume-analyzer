import { useEffect, useState } from "react";
import { fetchHistory } from "../api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory("demo-user").then((res) =>
      setHistory(res.history || [])
    );
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-semibold mb-4">
        Resume History
      </h2>

      {history.map((item, index) => (
        <div key={index} className="mb-4 p-4 bg-black/40 rounded-xl">
          <p>ATS Score: {item.ats_score.toFixed(2)}%</p>
          <p className="text-sm text-gray-400">
            {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
