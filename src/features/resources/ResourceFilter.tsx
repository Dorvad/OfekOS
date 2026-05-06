"use client";

import type { ResourceType } from "@/lib/types";
import type { Session } from "@/lib/types";

const TYPE_OPTIONS: { value: ResourceType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "file", label: "Files" },
  { value: "template", label: "Templates" },
  { value: "link", label: "Links" },
  { value: "video", label: "Videos" },
];

interface ResourceFilterProps {
  activeType: ResourceType | "all";
  activeSessionId: string | "all";
  sessions: Session[];
  onTypeChange: (type: ResourceType | "all") => void;
  onSessionChange: (sessionId: string | "all") => void;
}

export default function ResourceFilter({
  activeType,
  activeSessionId,
  sessions,
  onTypeChange,
  onSessionChange,
}: ResourceFilterProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TYPE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTypeChange(value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeType === value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => onSessionChange("all")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            activeSessionId === "all"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          All sessions
        </button>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSessionChange(session.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeSessionId === session.id
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {session.title}
          </button>
        ))}
      </div>
    </div>
  );
}
