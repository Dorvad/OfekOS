import type { AssignmentStatus } from "./types";

const KEY = {
  status: (id: string) => `ofekos:assignment:${id}:status`,
  phase: (id: string) => `ofekos:assignment:${id}:phase`,
  data: (id: string) => `ofekos:assignment:${id}:data`,
  insight: (id: string) => `ofekos:assignment:${id}:insight`,
  achieved: (id: string) => `ofekos:assignment:${id}:achieved`,
};

function safe(): boolean {
  return typeof window !== "undefined";
}

export function getAssignmentStatus(id: string): AssignmentStatus {
  if (!safe()) return "locked";
  return (
    (localStorage.getItem(KEY.status(id)) as AssignmentStatus) ?? "available"
  );
}

export function setAssignmentStatus(id: string, status: AssignmentStatus): void {
  if (!safe()) return;
  localStorage.setItem(KEY.status(id), status);
}

export function getAssignmentPhase(id: string): string | null {
  if (!safe()) return null;
  return localStorage.getItem(KEY.phase(id));
}

export function setAssignmentPhase(id: string, phase: string): void {
  if (!safe()) return;
  localStorage.setItem(KEY.phase(id), phase);
}

export function getAssignmentData<T>(id: string): T | null {
  if (!safe()) return null;
  const raw = localStorage.getItem(KEY.data(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setAssignmentData<T>(id: string, data: T): void {
  if (!safe()) return;
  localStorage.setItem(KEY.data(id), JSON.stringify(data));
}

export function mergeAssignmentData<T extends Record<string, unknown>>(
  id: string,
  patch: Partial<T>
): void {
  const current = getAssignmentData<T>(id) ?? ({} as T);
  setAssignmentData(id, { ...current, ...patch });
}

export function getAssignmentInsight(id: string): string {
  if (!safe()) return "";
  return localStorage.getItem(KEY.insight(id)) ?? "";
}

export function setAssignmentInsight(id: string, text: string): void {
  if (!safe()) return;
  localStorage.setItem(KEY.insight(id), text);
}

export function isAssignmentAchieved(id: string): boolean {
  if (!safe()) return false;
  return localStorage.getItem(KEY.achieved(id)) === "true";
}

export function markAssignmentAchieved(id: string): void {
  if (!safe()) return;
  localStorage.setItem(KEY.achieved(id), "true");
}

export function getCompletedCount(ids: string[]): number {
  if (!safe()) return 0;
  const terminal: AssignmentStatus[] = ["submitted", "achieved"];
  return ids.filter((id) => terminal.includes(getAssignmentStatus(id))).length;
}

export function countInsightsCollected(ids: string[]): number {
  if (!safe()) return 0;
  return ids.filter((id) => getAssignmentInsight(id).trim().length > 0).length;
}
