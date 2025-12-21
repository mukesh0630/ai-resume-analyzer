// ===============================
// API BASE URL (Render Backend)
// ===============================
const BASE_URL = "https://ai-resume-analyzer-0bi6.onrender.com";

// ===============================
// ATS SCORE
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

  return response.json(); // { ats_score: number }
}

// ===============================
// SKILL GAP
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
  // { matched_skills: [], missing_skills: [] }
}

// ===============================
// LEARNING ROADMAP (AI / RULE)
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
  // { learning_roadmap: [] }
}

// ===============================
// AI ASSISTANT (SHORT INSIGHTS)
// ===============================
export async function askResumeAI(resumeText, jobDescription, missingSkills) {
  const response = await fetch(`${BASE_URL}/ai/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
      missing_skills: missingSkills,
    }),
  });

  if (!response.ok) {
    throw new Error("AI assistant failed");
  }

  return response.json(); 
  // { ai_response: string (5–7 bullet points) }
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

// ===============================
// SAVE ANALYSIS HISTORY
// ===============================
export async function saveHistory(userId, payload) {
  const response = await fetch(`${BASE_URL}/history/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save history");
  }
}

// ===============================
// FETCH HISTORY
// ===============================
export async function fetchHistory(userId) {
  const response = await fetch(`${BASE_URL}/history/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return response.json(); 
  // { history: [] }
}




