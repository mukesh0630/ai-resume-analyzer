# Frontend Migration Guide: Old ATS → New Comprehensive Analysis

## Migration Path

### Current State (Old)
```
Frontend: POST /ats/score
Response: {
  "ats_score": 75,
  "matched_skills": [...],
  "missing_skills": [...]
}
```

### New State (Production-Ready)
```
Frontend: POST /analyze/comprehensive
Response: {
  "overall_score": 75,
  "score_breakdown": {...},  // 6 components
  "skill_analysis": {...},   // detailed breakdown
  "insights": {...},         // dynamic recommendations
  "visualization_data": {...} // chart-ready data
}
```

---

## Migration Steps (by component)

### Step 1: Update API Call in Frontend

**Old Code (before):**
```javascript
// src/api.js
export async function calculateATS(resumeText, jobDescription) {
  return fetch("/ats/score", {
    method: "POST",
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription
    })
  }).then(r => r.json());
}
```

**New Code (after):**
```javascript
// src/api.js
export async function analyzeResume(resumeText, jobDescription) {
  return fetch("/analyze/comprehensive", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription
    })
  }).then(r => r.json());
}
```

---

### Step 2: Update Component Props

**Old (ATSScoreRing.jsx):**
```jsx
<ATSScoreRing score={75} />
```

**New:**
```jsx
<ATSScoreRing score={data.overall_score} level={data.resume_level} />
```

---

### Step 3: Replace Radar Chart with Horizontal Bars

**Old:**
```jsx
<SkillRadarChart data={radarData} />
```

**New:**
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function ScoreBreakdownChart({ data }) {
  return (
    <BarChart data={data.visualization_data.score_breakdown_chart}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis />
      <Bar dataKey="score" fill="#8b5cf6" />
      <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
    </BarChart>
  );
}
```

---

### Step 4: Display Dynamic Insights

**Old:**
```jsx
<div>Missing skills: Python, React</div>
```

**New:**
```jsx
<InsightCard>
  <h3>Career Insights</h3>
  <p>{data.insights.ai_insights}</p>
  
  <h4>Strengths</h4>
  <ul>
    {data.insights.strength_areas.map(s => <li>{s}</li>)}
  </ul>
  
  <h4>Areas to Improve</h4>
  <ul>
    {data.insights.weakness_areas.map(w => <li>{w}</li>)}
  </ul>
</InsightCard>
```

---

### Step 5: Add Recommendations Section

**Completely New Feature:**
```jsx
<RecommendationsCard>
  <h3>Actionable Recommendations</h3>
  
  {data.insights.actionable_recommendations.map(rec => (
    <div className="recommendation-item">
      <span className={`badge-${rec.priority}`}>{rec.priority}</span>
      <h4>{rec.area}</h4>
      <p><strong>Action:</strong> {rec.action}</p>
      <p><strong>Impact:</strong> {rec.impact}</p>
      <p><strong>Timeline:</strong> {rec.timeline}</p>
      {rec.learning_resources && (
        <ul>
          {rec.learning_resources.map(r => <li>{r}</li>)}
        </ul>
      )}
    </div>
  ))}
</RecommendationsCard>
```

---

### Step 6: Add Next Steps Section

**Completely New Feature:**
```jsx
<NextStepsCard>
  <h3>Your Action Plan</h3>
  
  {data.insights.next_steps.map(step => (
    <div className="step">
      <div className="step-number">{step.step}</div>
      <div className="step-content">
        <h4>{step.action}</h4>
        <p>{step.reason}</p>
      </div>
    </div>
  ))}
</NextStepsCard>
```

---

## Data Mapping Reference

| Old Value | New Location |
|-----------|--------------|
| `ats_score` | `overall_score` |
| (none) | `resume_level` |
| `matched_skills` | `skill_analysis.matched_skills` |
| `missing_skills` | `skill_analysis.missing_skills` |
| (none) | `score_breakdown` (6 components) |
| (none) | `insights.ai_insights` |
| (none) | `insights.actionable_recommendations` |
| (none) | `visualization_data` |

---

## Component Update Checklist

- [ ] Update API endpoint (`/ats/score` → `/analyze/comprehensive`)
- [ ] Update ResumeUploader component
- [ ] Update ATSScoreRing component
- [ ] Replace SkillRadarChart with horizontal bar chart
- [ ] Remove SkillGapChart (use `visualization_data.skill_gap_chart` instead)
- [ ] Add InsightCard component
- [ ] Add RecommendationsCard component
- [ ] Add NextStepsCard component
- [ ] Update ATSTrendChart if needed (or remove)
- [ ] Test with sample resume and job description
- [ ] Deploy and verify with backend

---

## Full Example: Updated ResumeUploader Component

```jsx
import { useState } from 'react';
import { analyzeResume } from '../api';
import ScoreBreakdownChart from './ScoreBreakdownChart';
import SkillGapChart from './SkillGapChart';
import InsightCard from './InsightCard';
import RecommendationsCard from './RecommendationsCard';
import NextStepsCard from './NextStepsCard';

export default function ResumeUploader() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please enter both resume and job description');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-analyzer">
      {/* Input Section */}
      <div className="input-section">
        <textarea
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={10}
        />
        <textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={10}
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {/* Results Section */}
      {analysisResult && (
        <div className="results-section">
          {/* Overall Score */}
          <div className="score-card">
            <h2>Overall Score: {analysisResult.overall_score}</h2>
            <p className="resume-level">{analysisResult.resume_level}</p>
          </div>

          {/* Score Breakdown Chart */}
          <ScoreBreakdownChart data={analysisResult} />

          {/* Skill Gap Chart */}
          <SkillGapChart data={analysisResult.visualization_data.skill_gap_chart} />

          {/* Insights */}
          <InsightCard insights={analysisResult.insights} />

          {/* Recommendations */}
          <RecommendationsCard recommendations={analysisResult.insights.actionable_recommendations} />

          {/* Next Steps */}
          <NextStepsCard steps={analysisResult.insights.next_steps} />

          {/* Formatting Issues (if any) */}
          {analysisResult.formatting_issues.length > 0 && (
            <div className="card warning">
              <h4>ATS Formatting Issues</h4>
              <ul>
                {analysisResult.formatting_issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## CSS Styling Tips

```css
/* Score Card */
.score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.score-card h2 {
  font-size: 48px;
  margin: 0;
}

.resume-level {
  font-size: 18px;
  margin-top: 10px;
  opacity: 0.9;
}

/* Recommendation Badge */
.badge-HIGH { background: #f87171; color: white; padding: 4px 8px; }
.badge-MEDIUM { background: #fbbf24; color: white; padding: 4px 8px; }
.badge-LOW { background: #94a3b8; color: white; padding: 4px 8px; }

/* Step Card */
.step {
  display: flex;
  gap: 20px;
  padding: 20px;
  border-left: 4px solid #667eea;
  background: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 15px;
}

.step-number {
  font-weight: bold;
  font-size: 24px;
  color: #667eea;
  min-width: 40px;
}
```

---

## Testing the Integration

After updating all components:

```bash
# 1. Make sure backend is running
curl http://localhost:8000/docs

# 2. Test the new endpoint
curl -X POST http://localhost:8000/analyze/comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "John Doe Python React AWS 5 years",
    "job_description": "Senior Engineer Python React AWS required"
  }'

# 3. Check frontend integration
# Open browser to http://localhost:5173
# Upload resume and job description
# Verify all components render correctly
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /analyze/comprehensive" | Make sure backend is running with new code |
| Empty insights | Check if ai_insights field is being rendered |
| Recommendations not showing | Verify actionable_recommendations array exists |
| Chart not rendering | Check visualization_data structure |

---

## Rollback Plan

If needed, you can temporarily keep both endpoints:

```javascript
// Support both old and new
async function analyzeResume(resumeText, jobDescription) {
  try {
    // Try new endpoint first
    return await fetch("/analyze/comprehensive", {...});
  } catch {
    // Fallback to old endpoint
    return await fetch("/ats/score", {...});
  }
}
```

---

## Timeline

- **Phase 1 (Today):** Update API call + score display
- **Phase 2 (Today):** Replace chart + add skill gap
- **Phase 3 (Today):** Add insights, recommendations, next steps
- **Phase 4 (Today):** Test thoroughly
- **Phase 5 (Tomorrow):** Deploy to production

Estimated time: **2-3 hours** for full integration

---

## Questions?

Refer to:
- `REFACTORING_COMPLETE.md` - Overall summary
- `ATS_REFACTORING_GUIDE.md` - Technical details
- `INTEGRATION_EXAMPLE.py` - Code examples
- Backend API docs: `http://localhost:8000/docs`

**Your new backend is production-ready! 🚀**
