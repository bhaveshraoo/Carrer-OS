"use client";

import { useEffect, useRef } from "react";

function scoreColor(score: number): string {
  if (score >= 80) return "var(--teal)";
  if (score >= 60) return "var(--orange)";
  return "var(--red)";
}

export function ScoreRing({
  score,
  size = 128,
  stroke = 10,
  label = "Resume Score",
  animate = true,
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  animate?: boolean;
}) {
  const radius       = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillOffset   = circumference - (score / 100) * circumference;
  const arcRef       = useRef<SVGCircleElement>(null);
  const color        = scoreColor(score);

  useEffect(() => {
    if (!animate || !arcRef.current) return;
    // Start fully offset (0% fill), then transition to correct offset
    arcRef.current.style.strokeDashoffset = String(circumference);
    const raf = requestAnimationFrame(() => {
      if (arcRef.current) {
        arcRef.current.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)";
        arcRef.current.style.strokeDashoffset = String(fillOffset);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [score, circumference, fillOffset, animate]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${label}: ${score} out of 100`}
    >
      {/* Glow filter */}
      <defs>
        <filter id={`glow-${score}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={stroke}
      />

      {/* Fill arc */}
      <circle
        ref={arcRef}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={animate ? circumference : fillOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        filter={`url(#glow-${score})`}
      />

      {/* Score number */}
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.27}
        fontWeight={700}
        fontFamily="Fraunces, serif"
        fill={color}
      >
        {score}
      </text>

      {/* Label */}
      <text
        x="50%"
        y="68%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.085}
        fontFamily="Inter, sans-serif"
        fill="var(--text-muted)"
      >
        {label}
      </text>
    </svg>
  );
}
