"use client";

import { useState } from "react";
import type { Resource, Session, ResourceType } from "@/lib/types";
import ResourceCard from "./ResourceCard";
import ResourceFilter from "./ResourceFilter";
import EmptyState from "@/components/ui/EmptyState";

interface ResourcesListProps {
  resources: Resource[];
  sessions: Session[];
}

export default function ResourcesList({ resources, sessions }: ResourcesListProps) {
  const [activeType, setActiveType] = useState<ResourceType | "all">("all");
  const [activeSessionId, setActiveSessionId] = useState<string | "all">("all");

  const filtered = resources.filter((r) => {
    const typeMatch = activeType === "all" || r.type === activeType;
    const sessionMatch =
      activeSessionId === "all" ||
      r.sessionId === null ||
      r.sessionId === activeSessionId;
    return typeMatch && sessionMatch;
  });

  const getSessionTitle = (sessionId: string | null) =>
    sessions.find((s) => s.id === sessionId)?.title;

  return (
    <>
      <ResourceFilter
        activeType={activeType}
        activeSessionId={activeSessionId}
        sessions={sessions}
        onTypeChange={setActiveType}
        onSessionChange={setActiveSessionId}
      />

      <p className="text-xs text-gray-400 mb-4">
        Showing {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          message="No resources match your filters"
          description="Try clearing one of the filters above"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              sessionTitle={resource.sessionId ? getSessionTitle(resource.sessionId) : undefined}
            />
          ))}
        </div>
      )}
    </>
  );
}
