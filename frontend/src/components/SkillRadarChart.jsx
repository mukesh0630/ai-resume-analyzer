import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function SkillRadarChart({ matchedSkills, missingSkills }) {
  const allSkills = [...new Set([...matchedSkills, ...missingSkills])];

  const data = allSkills.map((skill) => ({
    skill,
    Resume: matchedSkills.includes(skill) ? 100 : 30,
    Job: 100,
  }));

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">
        Skill Match Radar
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="skill" stroke="#e5e7eb" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />

            <Radar
              name="Job Requirement"
              dataKey="Job"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.3}
            />
            <Radar
              name="Your Resume"
              dataKey="Resume"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
