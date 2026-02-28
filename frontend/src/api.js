// ===============================
// API BASE URL
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
// COMPREHENSIVE ATS ANALYSIS (MAIN ENDPOINT)
// ===============================
export async function analyzeResumeAI(resumeText, jobDescription) {
  const url = `${BASE_URL}/analyze/comprehensive`;
  
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
    
    // Extract matched skills and missing skills from analysis
    const matchedSkills = data.skill_analysis?.matched_skills || [];
    const missingSkills = data.skill_analysis?.missing_skills || [];
    const partialMatches = data.skill_analysis?.partial_matches || [];
    
    // Normalize response to match frontend expectations
    return {
      ats_score: data.overall_score || 0,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      partial_match_skills: partialMatches,
      learning_roadmap: data.insights?.next_steps || [],
      feedback: data.insights?.actionable_recommendations || [],
      score_breakdown: data.score_breakdown || {},
      improvements_priority: data.improvements_priority || [],
      skill_analysis: data.skill_analysis || {},
      experience_analysis: data.experience_analysis || {},
      formatting_issues: data.formatting_issues || [],
      resume_level: data.resume_level || "Beginner",
      insights: data.insights || {},
      visualization_data: data.visualization_data || {},
    };
  } catch (err) {
    throw new Error(`AI resume analysis failed: ${err?.message || String(err)}`);
  }
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

// ===============================
// FIRESTORE HISTORY HELPERS
// ===============================

// Save analysis into Firestore under users/{userId}/history
export async function saveHistory(userId, payload) {
  if (!userId) return;
  try {
    const col = collection(db, "users", userId, "history");
    
    // Flatten the payload - Firestore doesn't support nested arrays
    const flatPayload = {
      ats_score: payload.ats_score || 0,
      missing_skills_count: Array.isArray(payload.missing_skills) ? payload.missing_skills.length : 0,
      matched_skills_count: Array.isArray(payload.matched_skills) ? payload.matched_skills.length : 0,
      roadmap_count: Array.isArray(payload.roadmap) ? payload.roadmap.length : 0,
      feedback_count: Array.isArray(payload.feedback) ? payload.feedback.length : 0,
      // Store as comma-separated strings
      missing_skills_str: Array.isArray(payload.missing_skills) ? payload.missing_skills.slice(0, 10).join(", ") : "",
      matched_skills_str: Array.isArray(payload.matched_skills) ? payload.matched_skills.slice(0, 10).join(", ") : "",
      created_at: serverTimestamp(),
    };
    
    await addDoc(col, flatPayload);
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
