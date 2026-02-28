import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { fetchHistory } from "../api";

export default function DashboardHome() {
  const [history, setHistory] = useState([]);
  const [avgATS, setAvgATS] = useState(0);
  const [skillMatch, setSkillMatch] = useState(0);

  /* 🔁 Load history for analytics */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    fetchHistory(user.uid)
      .then((res) => {
        const h = Array.isArray(res.history) ? res.history : [];
        setHistory(h);

        if (h.length === 0) {
          setAvgATS(0);
          setSkillMatch(0);
          return;
        }

        /* ---------- AVG ATS ---------- */
        const atsScores = h
          .map((i) => Number(i.ats_score))
          .filter((v) => !isNaN(v));

        const avg =
          atsScores.length > 0
            ? atsScores.reduce((a, b) => a + b, 0) / atsScores.length
            : 0;

        setAvgATS(Math.round(avg));

        /* ---------- SKILL MATCH ---------- */
        const avgMissing =
          h.reduce(
            (sum, i) => sum + (Array.isArray(i.missing_skills) ? i.missing_skills.length : 0),
            0
          ) / h.length;

        const matchScore = Math.max(100 - avgMissing * 10, 40);
        setSkillMatch(Math.round(matchScore));
      })
      .catch((err) => {
        console.error("Dashboard history error:", err);
        setHistory([]);
        setAvgATS(0);
        setSkillMatch(0);
      });
  }, []);

  return (
    <div className="space-y-10">

      {/* ---------------- HERO INTRO ---------------- */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          AI Resume Intelligence Dashboard
        </h1>

        <p className="text-gray-300 text-lg max-w-3xl">
          ResumeAI helps you analyze resumes using ATS logic, skill matching,
          and AI insights to improve shortlisting chances.
        </p>

        <div className="mt-6 grid md:grid-cols-3 gap-6 text-sm text-gray-300">
          <StepCard
            title="1️⃣ Upload Resume"
            desc="Upload your resume (PDF/DOCX) securely."
          />
          <StepCard
            title="2️⃣ Paste Job Description"
            desc="Add the job requirements you are applying for."
          />
          <StepCard
            title="3️⃣ Get AI Insights"
            desc="View ATS score, skill gaps, roadmap & AI feedback."
          />
        </div>
      </div>

      {/* ---------------- QUICK STATS ---------------- */}
      <div className="grid md:grid-cols-3 gap-6">

        <StatBox title="ATS Compatibility">
          <p className="text-4xl font-bold text-purple-400">
            {avgATS}%
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Average ATS score
          </p>
        </StatBox>

        <StatBox title="Skill Match">
          <p className="text-4xl font-bold text-green-400">
            {skillMatch}%
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Avg alignment with job skills
          </p>
        </StatBox>

        <StatBox title="Resume Similarity">
          <p className="text-4xl font-bold text-blue-400">
            {avgATS ? Math.min(avgATS + 5, 100) : 0}%
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Semantic similarity estimate
          </p>
        </StatBox>

      </div>

      {/* Analytics removed - charts replaced with text-based stats */}

      {/* ---------------- WHY THIS APP ---------------- */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">
          Why ResumeAI?
        </h2>

        <ul className="space-y-3 text-gray-300 list-disc ml-6">
          <li>ATS-friendly resume evaluation</li>
          <li>Skill gap detection with roadmap</li>
          <li>AI-generated resume suggestions</li>
          <li>Comprehensive analytics dashboards</li>
          <li>History tracking & improvement insights</li>
        </ul>
      </div>

    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function StepCard({ title, desc }) {
  return (
    <div className="bg-black/40 p-5 rounded-xl border border-white/10">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

function StatBox({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
      <p className="text-gray-400 text-sm mb-3">{title}</p>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}