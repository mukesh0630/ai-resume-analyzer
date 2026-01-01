import { useEffect, useState } from "react";

export default function ATSScoreRing({ score }) {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      if (start >= score) {
        clearInterval(interval);
      } else {
        start += 1;
        setProgress(start);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [score]);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  const color =
    progress < 40 ? "#ef4444" :
    progress < 70 ? "#facc15" :
    "#22c55e";

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#1f2937"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.4s ease",
            filter: "drop-shadow(0 0 6px rgba(34,197,94,0.6))"
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="fill-white text-xl font-bold"
        >
          {progress}%
        </text>
      </svg>

      <p className="mt-3 text-gray-300 text-sm tracking-wide">
        ATS Score
      </p>
    </div>
  );
}
