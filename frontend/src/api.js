// ===============================
// API BASE URL (can be overridden by Vite env VITE_API_URL)
// ===============================
const BASE_URL = import.meta.env?.VITE_API_URL || "https://ai-resume-analyzer-0bi6.onrender.com";

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
  const response = await fetch (`${BASE_URL}/ats/score`, {
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
// ✅ AI-BASED FULL RESUME ANALYSIS
// ===============================
export async function analyzeResumeAI(resumeText, jobDescription) {
  const url = `${BASE_URL}/ats/analyze`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        resume_text: resumeText, 
        job_description: jobDescription 
      }),
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${txt}`);
    }

    const data = await response.json();
    
    // Normalize response to match frontend expectations
    return {
      ats_score: data.ats_score || 0,
      matched_skills: data.matched_skills || [],
      missing_skills: data.missing_skills || [],
      learning_roadmap: data.roadmap || [],
      feedback: data.feedback || [],
      ai_response: (Array.isArray(data.feedback) ? data.feedback.join(" ") : ""),
    };
  } catch (err) {
    throw new Error(`AI resume analysis failed: ${err?.message || String(err)}`);
  }
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
  try {
    // Validate payload
    if (!payload || typeof payload !== 'object') {
      throw new Error("Invalid payload");
    }

    const { ats_score, missing_skills, roadmap, ai_summary } = payload;
    
    // Ensure data is in correct format
    const validPayload = {
      ats_score: ats_score || 0,
      missing_skills: Array.isArray(missing_skills) ? missing_skills : [],
      roadmap: roadmap || [],
      ai_summary: ai_summary || []
    };

    const response = await fetch(`${BASE_URL}/report/pdf`, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/pdf",
      },
      body: JSON.stringify(validPayload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error details");
      throw new Error(`PDF generation failed (${response.status}): ${errorText || response.statusText}`);
    }

    const blob = await response.blob();
    
    if (blob.size === 0) {
      throw new Error("Received empty PDF file");
    }
    
    return blob;
  } catch (error) {
    throw error;
  }
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