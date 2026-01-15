import { useEffect, useState } from "react";
import ATSScoreRing from "./ATSScoreRing";
import SkillGapChart from "./SkillGapChart";
import AIChat from "./AIChat";
import SkillRadarChart from "./SkillRadarChart";
import { auth } from "../firebase";

import {
  analyzeResumeAI,
  getATSScore,
  getSkillGap,
  getLearningRoadmap,
  saveHistory,
  downloadPDFReport,
} from "../api";

export default function ResumeUploader({ selectedHistory }) {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* 🔁 LOAD FROM HISTORY */
  useEffect(() => {
    if (selectedHistory) {
      setAtsScore(selectedHistory.ats_score || 0);
      setMissingSkills(selectedHistory.missing_skills || []);
      setRoadmap(selectedHistory.roadmap || []);
      setFeedback(selectedHistory.feedback || []);
    }
  }, [selectedHistory]);

  /* ---------------- RESUME UPLOAD ---------------- */
  function handleResumeUpload(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
  }

  /* ---------------- ANALYZE (OPTIMIZED) -------------- */
  async function analyzeResume() {
    if (!file || !jobDesc.trim()) {
      setErrorMsg("Please upload a resume and paste job description.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setErrorMsg("Please login again");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    // 1️⃣ Upload Resume
    let parsedText = "";
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(
        "https://ai-resume-analyzer-0bi6.onrender.com/resume/upload",
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        const txt = await uploadRes.text().catch(() => "");
        const msg = `Upload failed: ${uploadRes.status} ${uploadRes.statusText} ${txt}`;
        console.error(msg);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }

      const uploadData = await uploadRes.json();
      parsedText = uploadData.extracted_text || "";
      if (!parsedText.trim()) {
        const msg = "Resume parsing returned empty text.";
        console.error(msg, uploadData);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }

      setResumeText(parsedText);
    } catch (uploadErr) {
      console.error("Upload error:", uploadErr);
      setErrorMsg(uploadErr?.message || String(uploadErr));
      setLoading(false);
      return;
    }

    // 2️⃣ PARALLEL: ATS Score + Skill Gap (fast rule-based endpoints)
    try {
      const [atsRes, skillRes] = await Promise.all([
        getATSScore(parsedText, jobDesc),
        getSkillGap(parsedText, jobDesc),
      ]);

      const score = atsRes?.ats_score || 0;
      setAtsScore(score);
      setMatchedSkills(atsRes?.matched_skills || []);
      setMissingSkills(skillRes?.missing_skills || []);

      const missingSkillsData = skillRes?.missing_skills || [];
      let roadmapData = [];
      let feedbackData = [];

      // 3️⃣ PARALLEL: Roadmap + Full Analyzer (non-critical, set defaults on failure)
      try {
        const [roadmapRes, analyzerRes] = await Promise.all([
          getLearningRoadmap(missingSkillsData),
          analyzeResumeAI(parsedText, jobDesc),
        ]);

        roadmapData = roadmapRes?.learning_roadmap || [];
        feedbackData = analyzerRes?.feedback || [];
      } catch (roadmapErr) {
        console.warn("Roadmap/Analyzer fetch failed:", roadmapErr);
        // Set reasonable defaults so UI still displays
        roadmapData = [];
        feedbackData = ["Improve keyword alignment", "Add measurable achievements"];
      }

      setRoadmap(roadmapData);
      setFeedback(feedbackData);

      // Save history in background
      try {
        saveHistory(user.uid, {
          ats_score: score,
          missing_skills: missingSkillsData,
          roadmap: roadmapData,
          feedback: feedbackData,
        }).catch((e) => console.error("saveHistory failed:", e));
      } catch (e) {
        console.error("saveHistory error:", e);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      const msg = err?.message || String(err) || "Analysis failed";
      setErrorMsg(msg);
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  /* -------- PDF -------- */
  async function handleDownload() {
    try {
      const blob = await downloadPDFReport({
        ats_score: atsScore,
        missing_skills: missingSkills,
        roadmap,
        ai_summary: feedback.join(" ") || "",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AI_Resume_Report.pdf";
      a.click();
    } catch (e) {
      console.error("download error:", e);
      setErrorMsg(e?.message || String(e));
    }
  }

  /* -------- UI -------- */
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Analyze Your Resume</h1>

      <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
        <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} className="mb-4" />

        <textarea
          placeholder="Paste Job Description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full h-32 p-4 rounded-xl bg-black/40 border border-white/10"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={analyzeResume}
            disabled={loading}
            className="mt-4 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {errorMsg && (
            <p className="text-red-400 ml-2">{errorMsg}</p>
          )}
        </div>
      </div>

      {atsScore !== null && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-xl flex justify-center">
              <ATSScoreRing score={Math.round(atsScore)} />
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Missing Skills</h3>
              <ul className="text-sm text-gray-300">
                {missingSkills.length > 0 ? (
                  missingSkills.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No missing skills</li>
                )}
              </ul>
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Learning Roadmap</h3>
              <ul className="text-sm text-gray-300">
                {roadmap && roadmap.length > 0 ? (
                  roadmap.slice(0, 5).map((r, i) => (
                    <li key={i} className="mb-1">• {r.skill || r.recommendation}</li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No learning path needed</li>
                )}
              </ul>
            </div>
          </div>

          {missingSkills.length > 0 && <SkillGapChart skills={missingSkills} />}

          {roadmap.length > 0 && (
            <SkillRadarChart
              matchedSkills={roadmap.map((r) => r.skill).filter(Boolean)}
              missingSkills={missingSkills}
            />
          )}

          <AIChat resumeText={resumeText} jobDesc={jobDesc} missingSkills={missingSkills} atsScore={atsScore} />

          <button onClick={handleDownload} className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold">
            Download PDF Report
          </button>
        </>
      )}
    </div>
  );
}