import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "info" | "muted";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-indigo-50 text-indigo-700",
  muted: "bg-gray-50 text-gray-500",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant]
      )}
    >
      {label}
    </span>
  );
}
