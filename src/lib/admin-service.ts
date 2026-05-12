import { MOCK_ASSIGNMENTS } from "./mock-data";
import type {
  Participant, NewParticipant, Cohort, AdminResource, NewAdminResource,
  AssignmentCompletionStat, Submission,
} from "./types";

// ── Participants ────────────────────────────────────────────

export async function getParticipants(): Promise<Participant[]> {
  const res = await fetch("/api/admin/participants", { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  const data: { id: string; name: string; email: string; cohort_id: string | null }[] = await res.json();
  return data.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    cohortId: u.cohort_id ?? null,
    progress: 0,
    lastActive: "",
    sessionsCompleted: 0,
    totalSessions: 6,
    managerId: "",
  }));
}

export async function createParticipant(data: NewParticipant): Promise<Participant> {
  const res = await fetch("/api/admin/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  const u = await res.json();
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    cohortId: u.cohortId,
    progress: 0,
    lastActive: "",
    sessionsCompleted: 0,
    totalSessions: 6,
    managerId: "",
  };
}

export async function deleteParticipant(id: string): Promise<void> {
  const res = await fetch("/api/admin/delete-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function updateParticipantCohort(userId: string, cohortId: string | null): Promise<void> {
  const res = await fetch("/api/admin/update-participant-cohort", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, cohortId }),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ── Cohorts ─────────────────────────────────────────────────

export async function getCohorts(): Promise<Cohort[]> {
  const res = await fetch("/api/admin/cohorts", { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createCohort(name: string): Promise<Cohort> {
  const res = await fetch("/api/admin/cohorts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function renameCohort(id: string, name: string): Promise<void> {
  const res = await fetch("/api/admin/cohorts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "rename", id, name }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteCohort(id: string): Promise<void> {
  const res = await fetch("/api/admin/cohorts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", id }),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ── Assignment lock control ──────────────────────────────────

export async function getAssignmentLockStates(): Promise<Record<string, boolean>> {
  try {
    const res = await fetch("/api/admin/assignments", { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    const data: { id: string; is_unlocked: boolean }[] = await res.json();
    if (data.length === 0) throw new Error("empty");
    return Object.fromEntries(data.map((a) => [a.id, a.is_unlocked]));
  } catch {
    return Object.fromEntries(MOCK_ASSIGNMENTS.map((a) => [a.id, a.isUnlocked]));
  }
}

export async function setAssignmentLocked(assignmentId: string, unlocked: boolean): Promise<void> {
  const res = await fetch("/api/admin/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignmentId, unlocked }),
  });
  if (!res.ok) throw new Error(await res.text());
  if (typeof window !== "undefined") {
    localStorage.setItem(`ofekos:admin:assignment:${assignmentId}:unlocked`, String(unlocked));
  }
}

// ── Resources ────────────────────────────────────────────────

export async function getResources(): Promise<AdminResource[]> {
  const res = await fetch("/api/admin/resources-manage", { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addResource(meta: NewAdminResource): Promise<AdminResource> {
  const res = await fetch("/api/admin/resources-manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", ...meta }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadResourceFile(file: File, sessionNumber: number): Promise<AdminResource> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sessionNumber", String(sessionNumber));

  const res = await fetch("/api/admin/upload-resource", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Upload failed");
  }

  return res.json();
}

export async function deleteResource(id: string): Promise<void> {
  const res = await fetch("/api/admin/resources-manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", id }),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ── Analytics ────────────────────────────────────────────────

export async function getCompletionStats(): Promise<AssignmentCompletionStat[]> {
  const res = await fetch("/api/admin/analytics", { cache: "no-store" });
  if (!res.ok) return MOCK_ASSIGNMENTS.map((a) => ({
    assignmentId: a.id, title: a.title, accentColor: a.accentColor,
    notStarted: 0, inProgress: 0, submitted: 0, total: 0,
  }));
  const { completionStats } = await res.json();
  return completionStats;
}

export async function getSubmissions(): Promise<Submission[]> {
  const res = await fetch("/api/admin/analytics", { cache: "no-store" });
  if (!res.ok) return [];
  const { submissions } = await res.json();
  return submissions;
}

export async function getPrepareStats(): Promise<{ completed: number; total: number }> {
  const res = await fetch("/api/admin/analytics", { cache: "no-store" });
  if (!res.ok) return { completed: 0, total: 0 };
  const { prepareStats } = await res.json();
  return prepareStats;
}
