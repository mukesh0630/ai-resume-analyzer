import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SkillGapChart({ skills = [] }) {
  const data = skills.map(skill => ({
    name: skill.toUpperCase(),
    value: Math.floor(Math.random() * 40) + 40
  }));

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <h3 className="text-xl font-semibold mb-4">Skill Match Overview</h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
