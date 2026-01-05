import { useEffect, useState } from "react";
import { fetchHistory } from "../api";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";


export default function History({ onSelect,}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const loadHistory = async () => {
    const q = query(
      collection(db, "users", user.uid, "history"),
      orderBy("created_at", "desc")
    );

    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setHistory(data);
  };

  loadHistory();
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
              onClick={() => onSelect(item)}
              className="bg-white/10 backdrop-blur-xl border border-white/10
             rounded-2xl p-6 cursor-pointer hover:border-purple-400 transition"
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
  {Array.isArray(item.missing_skills) && item.missing_skills.length > 0
    ? ` ${item.missing_skills.join(", ")}`
    : " None 🎉"}
</p>

{Array.isArray(item.roadmap) && item.roadmap.length > 0 && (
  <ul className="mt-2 text-sm text-gray-400 list-disc ml-5">
    {item.roadmap.slice(0, 3).map((r, i) => (
      <li key={i}>{r.recommendation || r}</li>
    ))}
  </ul>
)}

{Array.isArray(item.feedback) && item.feedback.length > 0 && (
  <ul className="mt-2 text-sm text-gray-400 list-disc ml-5">
    {item.feedback.map((f, i) => (
      <li key={i}>{f}</li>
    ))}
  </ul>
)}

            </div>
          );
        })}
      </div>
    </div>
  );
}
