import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SkillGapChart() {
  const data = [
    { skill: "Python", score: 90 },
    { skill: "React", score: 75 },
    { skill: "SQL", score: 60 },
    { skill: "Docker", score: 30 },
    { skill: "AWS", score: 25 },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Skill Match Overview
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="skill" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
