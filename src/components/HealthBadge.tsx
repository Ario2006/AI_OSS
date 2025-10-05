import { cn } from "@/lib/utils";

interface HealthBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const HealthBadge = ({ score, size = "md", showLabel = true }: HealthBadgeProps) => {
  const getHealthColor = (score: number) => {
    if (score >= 70) return "text-[hsl(var(--health-excellent))] bg-[hsl(var(--health-excellent))]/10 border-[hsl(var(--health-excellent))]/20";
    if (score >= 40) return "text-[hsl(var(--health-moderate))] bg-[hsl(var(--health-moderate))]/10 border-[hsl(var(--health-moderate))]/20";
    return "text-[hsl(var(--health-poor))] bg-[hsl(var(--health-poor))]/10 border-[hsl(var(--health-poor))]/20";
  };

  const getHealthLabel = (score: number) => {
    if (score >= 70) return "High Relevancy";
    if (score >= 40) return "Moderate";
    return "Low Relevancy";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold transition-all",
        getHealthColor(score),
        sizeClasses[size]
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold">{score}</span>
        {showLabel && <span className="opacity-80">{getHealthLabel(score)}</span>}
      </div>
    </div>
  );
};
