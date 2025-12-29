import { useState } from "react";
import ATSScoreRing from "./ATSScoreRing";
import SkillGapChart from "./SkillGapChart";
import AIChat from "./AIChat";
import {
  getATSScore,
  getSkillGap,
  getLearningRoadmap,
  askResumeAI,
  saveHistory,
  downloadPDFReport,
} from "../api";

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- RESUME UPLOAD ---------------- */
  function handleResumeUpload(e) {
    setFile(e.target.files[0]);
  }

  /* ---------------- ANALYZE ---------------- */
  async function analyzeResume() {
    if (!file || !jobDesc.trim()) {
      alert("Upload resume and paste job description");
      return;
    }

    try {
      setLoading(true);

      /* 1️⃣ Upload resume to backend parser */
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(
        "https://ai-resume-analyzer-0bi6.onrender.com/resume/upload",
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        throw new Error("Resume upload failed");
      }

      const uploadData = await uploadRes.json();
      const parsedText = uploadData.extracted_text || "";

      if (parsedText.length < 200) {
        throw new Error("Resume parsing failed or text too short");
      }

      // ✅ Store for UI + AIChat
      setResumeText(parsedText);

      /* 2️⃣ ATS SCORE */
      const ats = await getATSScore(parsedText, jobDesc);
      setAtsScore(ats.ats_score);

      /* 3️⃣ SKILL GAP */
      const gap = await getSkillGap(parsedText, jobDesc);
      setMissingSkills(gap.missing_skills || []);

      /* 4️⃣ ROADMAP */
      const roadmapRes = await getLearningRoadmap(gap.missing_skills || []);
      setRoadmap(roadmapRes.learning_roadmap || []);

      /* 5️⃣ AI INSIGHTS */
      const ai = await askResumeAI(
        parsedText,
        jobDesc,
        gap.missing_skills || []
      );
      setAiResponse(ai.ai_response || "");

      /* 6️⃣ QUICK FEEDBACK (simple + fast) */
      setFeedback([
        ats.ats_score < 60
          ? "Improve keyword alignment with job description"
          : "Good ATS compatibility",
        gap.missing_skills.length > 0
          ? "Consider learning missing skills"
          : "Skills are well aligned",
      ]);

      /* 7️⃣ SAVE HISTORY */
      await saveHistory("demo-user", {
        ats_score: ats.ats_score,
        missing_skills: gap.missing_skills,
        roadmap: roadmapRes.learning_roadmap,
      });

    } catch (err) {
      console.error(err);
      alert(
        "Analysis failed. Backend is reachable but input was invalid or parsing failed."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- PDF ---------------- */
  async function handleDownload() {
    const blob = await downloadPDFReport({
      ats_score: atsScore,
      missing_skills: missingSkills,
      roadmap,
      ai_summary: aiResponse,
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Resume_Report.pdf";
    a.click();
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <h1 className="text-4xl font-bold text-purple-400">
        Analyze Your Resume
      </h1>

      {/* INPUT */}
      <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
        <input
          type="file"
          accept=".pdf,.docx"
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
          className="mt-4 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* RESULTS */}
      {atsScore !== null && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-xl flex justify-center">
              <ATSScoreRing score={Math.round(atsScore)} />
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Missing Skills</h3>
              <ul className="text-sm text-gray-300">
                {missingSkills.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Learning Roadmap</h3>
              <ul className="text-sm text-gray-300">
                {roadmap.slice(0, 6).map((r, i) => (
                  <li key={i}>• {r.recommendation}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Quick Feedback</h3>
            <ul className="list-disc ml-5 text-gray-300 space-y-2">
              {feedback.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <SkillGapChart skills={missingSkills} />

          <AIChat
            resumeText={resumeText}
            jobDesc={jobDesc}
            missingSkills={missingSkills}
            atsScore={atsScore}
          />

          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
          >
            Download PDF Report
          </button>
        </>
      )}
    </div>
  );
}

