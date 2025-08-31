"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  subText?: string;
}

export function LoadingSpinner({
  size = "md",
  text = "Chargement...",
  subText,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div
          className={`animate-spin rounded-full border-b-2 border-primary mx-auto ${sizeClasses[size]}`}
        ></div>
        <div>
          <h2 className="text-xl font-semibold">{text}</h2>
          {subText && <p className="text-muted-foreground">{subText}</p>}
        </div>
      </div>
    </div>
  );
}
