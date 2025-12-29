import { useEffect, useState } from "react";

export default function ATSScoreRing({ score = 0, size = 140 }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(Math.max(score, 0), 100);

    const interval = setInterval(() => {
      start += 1;
      setProgress(start);
      if (start >= end) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [score]);

  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>

      {/* Score Text */}
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-white">
          {progress}%
        </p>
        <p className="text-sm text-gray-400 mt-1">
          ATS Score
        </p>
      </div>
    </div>
  );
}
