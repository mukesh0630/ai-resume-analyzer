import { useEffect, useState } from "react";
import ATSScoreRing from "./ATSScoreRing";
import SkillGapChart from "./SkillGapChart";
import AIChat from "./AIChat";
import SkillRadarChart from "./SkillRadarChart";
import { auth } from "../firebase";

import {
  analyzeResumeAI,
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

    try {
      // 1️⃣ Upload Resume
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(
        "https://ai-resume-analyzer-0bi6.onrender.com/resume/upload",
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        const txt = await uploadRes.text().catch(() => "");
        throw new Error(`Upload failed: ${uploadRes.status} ${txt}`);
      }

      const uploadData = await uploadRes.json();
      const parsedText = uploadData.extracted_text || "";
      
      if (!parsedText.trim()) {
        throw new Error("Resume parsing returned empty text");
      }

      setResumeText(parsedText);

      // 2️⃣ Run Full Analysis (single call returns everything: ats_score, matched_skills, missing_skills, learning_roadmap, feedback)
      const analysisResult = await analyzeResumeAI(parsedText, jobDesc);
      
      // Set all results
      setAtsScore(analysisResult.ats_score || 0);
      setMatchedSkills(analysisResult.matched_skills || []);
      setMissingSkills(analysisResult.missing_skills || []);
      setRoadmap(analysisResult.learning_roadmap || []);
      setFeedback(analysisResult.feedback || []);

      // 3️⃣ Save to Firestore (background, non-critical)
      try {
        saveHistory(user.uid, {
          ats_score: analysisResult.ats_score || 0,
          missing_skills: analysisResult.missing_skills || [],
          roadmap: analysisResult.learning_roadmap || [],
          feedback: analysisResult.feedback || [],
        }).catch((e) => console.warn("History save failed:", e));
      } catch (histErr) {
        console.warn("History save error:", histErr);
      }

    } catch (err) {
      console.error("Analysis error:", err);
      setErrorMsg(err?.message || String(err) || "Analysis failed");
      setAtsScore(null);
    } finally {
      setLoading(false);
    }
  }

  /* -------- PDF -------- */
  async function handleDownload() {
    try {
      setErrorMsg("");
      
      // Validate data before downloading
      if (!atsScore && atsScore !== 0) {
        throw new Error("No ATS score available. Please analyze a resume first.");
      }

      console.log("🔄 Preparing download with data:", {
        atsScore,
        missingSkills,
        roadmap,
        feedback
      });

      const downloadPayload = {
        ats_score: atsScore,
        missing_skills: Array.isArray(missingSkills) ? missingSkills : [],
        roadmap: Array.isArray(roadmap) ? roadmap.join("\n") : String(roadmap || ""),
        ai_summary: Array.isArray(feedback) ? feedback.join(" ") : String(feedback || ""),
      };

      console.log("📤 Download payload:", downloadPayload);

      const blob = await downloadPDFReport(downloadPayload);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `AI_Resume_Report_${new Date().getTime()}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log("✅ Download completed successfully");
      }, 100);
      
    } catch (e) {
      console.error("Download error:", e);
      let errorMessage = e?.message || String(e) || "Download failed";
      
      // Handle specific network errors
      if (errorMessage.includes("Failed to fetch")) {
        errorMessage = `Network error: The server at ${new URL(import.meta.env.VITE_API_URL || "https://ai-resume-analyzer-0bi6.onrender.com").hostname} is not responding. Please check your internet connection and try again.`;
      } else if (errorMessage.includes("TypeError")) {
        errorMessage = `Connection error: Could not reach the server. The Render backend may be loading (can take 1-2 min on free tier).`;
      }
      
      setErrorMsg(errorMessage);
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
                  roadmap.slice(0, 5).map((r, i) => {
                    // Handle both string and object formats
                    const skillName = typeof r === 'string' ? r : (r.skill || r.recommendation || '');
                    return (
                      <li key={i} className="mb-1">• {skillName}</li>
                    );
                  })
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

          <button 
            onClick={handleDownload} 
            disabled={!atsScore}
            className={`${!atsScore ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} px-6 py-3 rounded-xl font-semibold`}
          >
            Download PDF Report
          </button>
          {errorMsg && <div className="text-red-400 mt-2">{errorMsg}</div>}
        </>
      )}
    </div>
  );
}