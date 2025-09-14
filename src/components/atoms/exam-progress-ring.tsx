"use client";

export interface ExamProgressRingProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
  color?: "blue" | "green" | "orange" | "red" | "gray";
}

const sizeMap = {
  sm: { ring: "w-8 h-8", text: "text-xs" },
  md: { ring: "w-12 h-12", text: "text-sm" },
  lg: { ring: "w-16 h-16", text: "text-base" },
};

const colorMap = {
  blue: "stroke-chart-1",
  green: "stroke-chart-3", 
  orange: "stroke-chart-4",
  red: "stroke-destructive",
  gray: "stroke-muted-foreground",
};

export function ExamProgressRing({
  percentage,
  size = "md",
  className = "",
  showLabel = true,
  color = "blue",
}: ExamProgressRingProps) {
  const normalizedPercentage = Math.max(0, Math.min(100, percentage));
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;

  const sizeClasses = sizeMap[size];
  const strokeColor = colorMap[color];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className={`${sizeClasses.ring} transform -rotate-90`}
        viewBox="0 0 36 36"
      >
        {/* Cercle de fond */}
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="stroke-muted/20"
        />
        {/* Cercle de progression */}
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-300 ease-in-out ${strokeColor}`}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-medium ${sizeClasses.text}`}>
            {Math.round(normalizedPercentage)}%
          </span>
        </div>
      )}
    </div>
  );
}