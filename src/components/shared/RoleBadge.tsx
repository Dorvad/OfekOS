import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

interface RoleStyle {
  label: string;
  color: string;
  bg: string;
  activeBg: string;
}

const roleStyles: Record<Role, RoleStyle> = {
  participant: {
    label: "Participant",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    activeBg: "bg-indigo-100 ring-1 ring-indigo-300",
  },
  manager: {
    label: "Manager",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    activeBg: "bg-emerald-100 ring-1 ring-emerald-300",
  },
  facilitator: {
    label: "Facilitator",
    color: "text-amber-700",
    bg: "bg-amber-50",
    activeBg: "bg-amber-100 ring-1 ring-amber-300",
  },
  admin: {
    label: "Admin",
    color: "text-slate-700",
    bg: "bg-slate-100",
    activeBg: "bg-slate-200 ring-1 ring-slate-300",
  },
};

interface RoleBadgeProps {
  role: Role;
  active?: boolean;
}

export default function RoleBadge({ role, active = false }: RoleBadgeProps) {
  const s = roleStyles[role];
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        s.color,
        active ? s.activeBg : s.bg
      )}
    >
      {s.label}
    </span>
  );
}
