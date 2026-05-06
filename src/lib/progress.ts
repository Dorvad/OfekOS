import type { Session, Task, TaskStatus } from "./types";

export type SessionLockStatus = "completed" | "active" | "unlocked" | "locked";

export function getSessionLockStatus(
  session: Session,
  allSessions: Session[]
): SessionLockStatus {
  if (session.status === "completed") return "completed";
  if (session.status === "active") return "active";

  // For upcoming sessions: the first upcoming session after the active one is unlocked,
  // the rest are locked.
  const ordered = [...allSessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const activeIndex = ordered.findIndex((s) => s.status === "active");
  const sessionIndex = ordered.findIndex((s) => s.id === session.id);

  if (activeIndex === -1) {
    // No active session — unlock the first upcoming
    const firstUpcomingIndex = ordered.findIndex((s) => s.status === "upcoming");
    return sessionIndex === firstUpcomingIndex ? "unlocked" : "locked";
  }

  // One step ahead of active = unlocked, everything else = locked
  return sessionIndex === activeIndex + 1 ? "unlocked" : "locked";
}

export function computeOverallProgress(sessions: Session[]): number {
  const completed = sessions.filter((s) => s.status === "completed").length;
  return Math.round((completed / sessions.length) * 100);
}

export function getOpenTaskCount(
  tasks: Task[],
  taskStatuses: Record<string, boolean>
): number {
  return tasks.filter(
    (t) =>
      t.defaultStatus !== "locked" &&
      !taskStatuses[t.id]
  ).length;
}

export function computeSessionTaskProgress(
  sessionId: string,
  tasks: Task[],
  taskStatuses: Record<string, boolean>
): number {
  const sessionTasks = tasks.filter((t) => t.sessionId === sessionId && t.defaultStatus !== "locked");
  if (sessionTasks.length === 0) return 0;
  const done = sessionTasks.filter((t) => taskStatuses[t.id]).length;
  return Math.round((done / sessionTasks.length) * 100);
}

export function deriveTaskStatus(
  taskDefaultStatus: TaskStatus,
  isCompleted: boolean
): TaskStatus {
  if (taskDefaultStatus === "locked") return "locked";
  if (isCompleted) return "completed";
  return taskDefaultStatus;
}
