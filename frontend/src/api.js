export async function getATSScore(resumeText, jobDescription) {
  const response = await fetch("http://127.0.0.1:8000/ats/score", {
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
export async function getSkillGap(resumeText, jobDescription) {
  const response = await fetch("http://127.0.0.1:8000/ats/skills", {
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
export async function getLearningRoadmap(missingSkills) {
  const response = await fetch("http://127.0.0.1:8000/ats/roadmap", {
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

export async function askResumeAI(resumeText, jobDescription, missingSkills) {
  const response = await fetch("http://127.0.0.1:8000/ai/assistant", {
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
}
export async function downloadPDFReport(payload) {
  const response = await fetch("http://127.0.0.1:8000/report/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  const blob = await response.blob();
  return blob;
}
export async function saveHistory(userId, payload) {
  await fetch("http://127.0.0.1:8000/history/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      ...payload,
    }),
  });
}

export async function fetchHistory(userId) {
  const res = await fetch(`http://127.0.0.1:8000/history/${userId}`);
  return res.json();
}




