const colorMap = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  slate: "bg-slate-400",
};

interface ProgressBarProps {
  value: number;
  color?: keyof typeof colorMap;
  className?: string;
}

export default function ProgressBar({
  value,
  color = "indigo",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${colorMap[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
