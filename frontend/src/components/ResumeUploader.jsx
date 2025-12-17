import { useState } from "react";
import SkillGapChart from "./SkillGapChart";
import AIChat from "./AIChat";
import { downloadPDFReport } from "../api";

export default function ResumeUploader() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiContext, setAiContext] = useState(null);

  // 🔹 Resume upload (text only for now)
  function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setResumeText(reader.result);
    reader.readAsText(file);
  }

  // 🔹 MAIN ANALYZE FUNCTION (FIXED)
  async function analyzeResume() {
    if (!resumeText || !jobDesc) {
      alert("Please upload resume and paste job description");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ ATS SCORE
      const atsRes = await fetch("http://127.0.0.1:8000/ats/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDesc,
        }),
      });
      const atsResult = await atsRes.json();
      setScore(atsResult.ats_score);

      // 2️⃣ SKILL GAP
      const skillRes = await fetch("http://127.0.0.1:8000/skills/gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDesc,
        }),
      });
      const skillResult = await skillRes.json();
      setMissingSkills(skillResult.missing_skills);

      // 3️⃣ LEARNING ROADMAP
      const roadmapRes = await fetch("http://127.0.0.1:8000/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missing_skills: skillResult.missing_skills,
        }),
      });
      const roadmapResult = await roadmapRes.json();
      setRoadmap(roadmapResult.learning_roadmap);

      // 4️⃣ SAVE HISTORY (Firebase)
      await fetch("http://127.0.0.1:8000/history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo-user",
          ats_score: atsResult.ats_score,
          missing_skills: skillResult.missing_skills,
          roadmap: roadmapResult.learning_roadmap,
        }),
      });

      // 5️⃣ AI CHAT CONTEXT
      setAiContext({
        resumeText,
        jobDesc,
        missingSkills: skillResult.missing_skills,
      });

    } catch (err) {
      console.error(err);
      alert("Error analyzing resume. Check backend.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 PDF DOWNLOAD
  async function handleDownload() {
    const blob = await downloadPDFReport({
      ats_score: score,
      missing_skills: missingSkills,
      roadmap,
      ai_summary: "AI insights generated successfully.",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Resume_Report.pdf";
    a.click();
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-5xl mx-auto space-y-8">

        <h1 className="text-4xl font-bold text-purple-400">
          AI Resume Intelligence Dashboard
        </h1>

        {/* Resume Upload */}
        <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
          <input
            type="file"
            onChange={handleResumeUpload}
            className="mb-4"
          />

          <textarea
            placeholder="Paste Job Description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full h-32 p-4 rounded-xl bg-black/40 border border-white/10"
          />

          <button
            onClick={analyzeResume}
            disabled={loading}
            className="mt-4 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* Results */}
        {score !== null && (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/40 p-6 rounded-xl">
                <h3>ATS Score</h3>
                <p className="text-3xl font-bold text-green-400">
                  {score.toFixed(2)}%
                </p>
              </div>

              <div className="bg-black/40 p-6 rounded-xl">
                <h3>Missing Skills</h3>
                <ul className="text-sm mt-2">
                  {missingSkills.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-xl">
                <h3>Learning Roadmap</h3>
                <ul className="text-sm mt-2">
                  {roadmap.map((r, i) => (
                    <li key={i}>
                      <b>{r.skill}</b>: {r.recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <SkillGapChart skills={missingSkills} />

            {aiContext && (
              <AIChat
                resumeText={aiContext.resumeText}
                jobDesc={aiContext.jobDesc}
                missingSkills={aiContext.missingSkills}
              />
            )}

            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
            >
              Download PDF Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}




