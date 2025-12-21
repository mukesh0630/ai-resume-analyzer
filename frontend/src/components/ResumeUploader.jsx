import { useState } from "react";
import ATSScoreRing from "./ATSScoreRing";
import SkillGapChart from "./SkillGapChart";
import AIChat from "./AIChat";
import {
  getATSScore,
  getSkillGap,
  getSimilarity,
  saveHistory,
  downloadPDFReport,
} from "../api";

export default function ResumeUploader() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [ats, setATS] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [missing, setMissing] = useState([]);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!resumeText || !jobDesc) return alert("Upload resume & job description");

    setLoading(true);

    const atsRes = await getATSScore(resumeText, jobDesc);
    const gapRes = await getSkillGap(resumeText, jobDesc);
    const simRes = await getSimilarity(resumeText, jobDesc);

    setATS(atsRes.ats_score);
    setMissing(gapRes.missing_skills);
    setSimilarity(simRes.similarity);

    await saveHistory({
      user_id: "demo-user",
      ats_score: atsRes.ats_score,
      missing_skills: gapRes.missing_skills,
    });

    setLoading(false);
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Analyze Resume</h1>

      <textarea
        className="w-full h-32 p-4 bg-black/40 rounded-xl"
        placeholder="Paste resume text..."
        onChange={(e) => setResumeText(e.target.value)}
      />

      <textarea
        className="w-full h-32 p-4 bg-black/40 rounded-xl mt-4"
        placeholder="Paste job description..."
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button
        onClick={analyze}
        className="mt-4 bg-purple-500 px-6 py-3 rounded-xl"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {ats !== null && (
        <>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <ATSScoreRing score={ats} />
            <Stat title="Similarity" value={`${similarity}%`} />
            <Stat title="Missing Skills" value={missing.length} />
          </div>

          <SkillGapChart skills={missing} />

          <AIChat
            resumeText={resumeText}
            jobDesc={jobDesc}
            missingSkills={missing}
          />
        </>
      )}
    </>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white/10 p-6 rounded-xl text-center">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}



