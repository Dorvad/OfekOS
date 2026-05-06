"use client";

import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { deriveTaskStatus } from "@/lib/progress";
import type { Task, SessionStatus } from "@/lib/types";

interface SessionTasksContainerProps {
  tasks: Task[];
  sessionStatus: SessionStatus;
}

export default function SessionTasksContainer({
  tasks,
  sessionStatus,
}: SessionTasksContainerProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    tasks.forEach((t) => {
      initial[t.id] =
        localStorage.getItem(STORAGE_KEYS.task(t.id)) === "completed";
    });
    setCompleted(initial);
    setHydrated(true);
  }, [tasks]);

  function handleToggle(taskId: string) {
    const next = !completed[taskId];
    if (next) {
      localStorage.setItem(STORAGE_KEYS.task(taskId), "completed");
    } else {
      localStorage.removeItem(STORAGE_KEYS.task(taskId));
    }
    setCompleted((prev) => ({ ...prev, [taskId]: next }));
  }

  if (!hydrated) {
    return (
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isTaskCompleted =
          sessionStatus === "completed" ? true : completed[task.id] ?? false;
        const status = deriveTaskStatus(task.defaultStatus, isTaskCompleted);
        const isInteractive = sessionStatus === "active" && task.defaultStatus !== "locked";

        return (
          <TaskItem
            key={task.id}
            task={task}
            status={status}
            onToggle={isInteractive ? handleToggle : undefined}
          />
        );
      })}
    </div>
  );
}
