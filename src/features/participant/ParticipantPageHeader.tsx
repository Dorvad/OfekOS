import type { ReactNode } from "react";

interface ParticipantPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function ParticipantPageHeader({
  title,
  subtitle,
  action,
}: ParticipantPageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
