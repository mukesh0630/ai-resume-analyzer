// ===============================
// API BASE URL (Render Backend)
// ===============================
const BASE_URL = "https://ai-resume-analyzer-0bi6.onrender.com";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ===============================
// ATS SCORE (RULE-BASED - KEEP)
// ===============================
export async function getATSScore(resumeText, jobDescription) {
  const response = await fetch(`${BASE_URL}/ats/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ATS score");
  }

  return response.json();
}

// ===============================
// SKILL GAP (RULE-BASED - KEEP)
// ===============================
export async function getSkillGap(resumeText, jobDescription) {
  const response = await fetch(`${BASE_URL}/ats/skills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch skill gap");
  }

  return response.json();
}

// ===============================
// LEARNING ROADMAP (RULE-BASED)
// ===============================
export async function getLearningRoadmap(missingSkills) {
  const response = await fetch(`${BASE_URL}/ats/roadmap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      missing_skills: missingSkills,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch learning roadmap");
  }

  return response.json();
}

// ===============================
// FEEDBACK (KEEP)
// ===============================
export async function getFeedback(atsScore, missingSkills) {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ats_score: atsScore,
      missing_skills: missingSkills,
    }),
  });

  if (!res.ok) {
    throw new Error("Feedback failed");
  }

  return res.json();
}

// ===============================
// AI ASSISTANT (OLD - KEEP)
// ===============================
export async function askResumeAI(
  resumeText,
  jobDescription,
  atsScore,
  missingSkills
) {
  const response = await fetch(`${BASE_URL}/ai/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText || "",
      job_description: jobDescription || "",
      ats_score: Number(atsScore) || 0,
      missing_skills: Array.isArray(missingSkills) ? missingSkills : [],
    }),
  });

  if (!response.ok) {
    throw new Error("AI assistant failed");
  }

  return response.json();
}

// ===============================
// ✅ AI-BASED FULL RESUME ANALYSIS (NEW)
// ===============================
export async function analyzeResumeAI(resumeText, jobDescription) {
  const response = await fetch(`${BASE_URL}/ai/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("AI resume analysis failed");
  }

  return response.json();
  /*
    Expected response:
    {
      ats_score: number,
      matched_skills: [],
      missing_skills: [],
      learning_roadmap: [],
      feedback: [],
      ai_response: string
    }
  */
}

// ===============================
// PDF REPORT DOWNLOAD
// ===============================
export async function downloadPDFReport(payload) {
  const response = await fetch(`${BASE_URL}/report/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  return await response.blob();
}

// ---------------- Firestore history helpers ----------------

// Save analysis into Firestore under users/{userId}/history
export async function saveHistory(userId, payload) {
  if (!userId) return;
  try {
    const col = collection(db, "users", userId, "history");
    await addDoc(col, {
      ...payload,
      created_at: serverTimestamp(),
    });
  } catch (err) {
    console.error("saveHistory error:", err);
    // Don't throw — history save should not break the main flow
  }
}

// Fetch history from Firestore and return { history: [...] }
export async function fetchHistory(userId) {
  if (!userId) return { history: [] };
  try {
    const col = collection(db, "users", userId, "history");
    const q = query(col, orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { history: data };
  } catch (err) {
    console.error("fetchHistory error:", err);
    return { history: [] };
  }
}
