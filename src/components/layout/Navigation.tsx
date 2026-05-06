import Link from "next/link";
import { ROLES } from "@/lib/mock-data";
import RoleBadge from "@/components/shared/RoleBadge";
import type { Role } from "@/lib/types";

interface NavigationProps {
  activeRole?: Role;
}

export default function Navigation({ activeRole }: NavigationProps) {
  return (
    <nav className="flex items-center gap-2 flex-wrap">
      {ROLES.map((role) => (
        <Link key={role.id} href={role.href}>
          <RoleBadge role={role.id} active={activeRole === role.id} />
        </Link>
      ))}
    </nav>
  );
}
