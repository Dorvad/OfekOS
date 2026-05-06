import { STORAGE_KEYS } from "./storage-keys";

export function getTaskCompleted(taskId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.task(taskId)) === "completed";
}

export function setTaskCompleted(taskId: string, completed: boolean): void {
  if (typeof window === "undefined") return;
  if (completed) {
    localStorage.setItem(STORAGE_KEYS.task(taskId), "completed");
  } else {
    localStorage.removeItem(STORAGE_KEYS.task(taskId));
  }
}

export function getAllTaskCompletions(taskIds: string[]): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(taskIds.map((id) => [id, getTaskCompleted(id)]));
}
