/**
 * Admin service layer — all admin data access goes through this file.
 * Currently backed by mock data + localStorage.
 * Migration path: replace each function body with Supabase client calls.
 * The UI components never need to change.
 */

import {
  MOCK_PARTICIPANTS,
  MOCK_COHORTS,
  MOCK_ADMIN_RESOURCES,
  MOCK_SUBMISSIONS,
  MOCK_ASSIGNMENTS,
} from "./mock-data";
import type {
  Participant,
  NewParticipant,
  Cohort,
  AdminResource,
  NewAdminResource,
  AssignmentCompletionStat,
  Submission,
} from "./types";

// ── localStorage keys ──────────────────────────────────────────────────────

const RESOURCES_KEY = "ofekos:admin:resources";
const COHORTS_KEY = "ofekos:admin:cohorts";
const PARTICIPANTS_KEY = "ofekos:admin:participants";

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Participants ────────────────────────────────────────────────────────────

export function getParticipants(): Participant[] {
  return safeRead<Participant[]>(PARTICIPANTS_KEY, MOCK_PARTICIPANTS);
}

export function saveParticipants(list: Participant[]): void {
  safeWrite(PARTICIPANTS_KEY, list);
}

export function createParticipant(data: NewParticipant): Participant {
  const list = getParticipants();
  const newId = "p" + Date.now();
  const p: Participant = {
    id: newId,
    name: data.name,
    email: data.email,
    progress: 0,
    lastActive: new Date().toISOString().split("T")[0],
    sessionsCompleted: 0,
    totalSessions: 6,
    managerId: "",
    cohortId: data.cohortId,
  };
  const next = [...list, p];
  saveParticipants(next);
  if (data.cohortId) {
    const cohorts = getCohorts();
    const updated = cohorts.map((c) =>
      c.id === data.cohortId
        ? { ...c, participantIds: [...c.participantIds, newId] }
        : c
    );
    saveCohorts(updated);
  }
  return p;
}

export function deleteParticipant(id: string): void {
  const list = getParticipants().filter((p) => p.id !== id);
  saveParticipants(list);
  const cohorts = getCohorts().map((c) => ({
    ...c,
    participantIds: c.participantIds.filter((pid) => pid !== id),
  }));
  saveCohorts(cohorts);
}

export function updateParticipantCohort(
  userId: string,
  cohortId: string | null
): void {
  const list = getParticipants().map((p) =>
    p.id === userId ? { ...p, cohortId } : p
  );
  saveParticipants(list);
  const cohorts = getCohorts().map((c) => {
    const without = c.participantIds.filter((id) => id !== userId);
    if (cohortId === c.id) return { ...c, participantIds: [...without, userId] };
    return { ...c, participantIds: without };
  });
  saveCohorts(cohorts);
}

// ── Cohorts ─────────────────────────────────────────────────────────────────

export function getCohorts(): Cohort[] {
  return safeRead<Cohort[]>(COHORTS_KEY, MOCK_COHORTS);
}

export function saveCohorts(list: Cohort[]): void {
  safeWrite(COHORTS_KEY, list);
}

export function createCohort(name: string): Cohort {
  const cohorts = getCohorts();
  const newCohort: Cohort = { id: "c" + Date.now(), name, participantIds: [] };
  saveCohorts([...cohorts, newCohort]);
  return newCohort;
}

export function renameCohort(id: string, name: string): void {
  const cohorts = getCohorts().map((c) => (c.id === id ? { ...c, name } : c));
  saveCohorts(cohorts);
}

export function deleteCohort(id: string): void {
  saveCohorts(getCohorts().filter((c) => c.id !== id));
  const list = getParticipants().map((p) =>
    p.cohortId === id ? { ...p, cohortId: null } : p
  );
  saveParticipants(list);
}

// ── Assignment lock control ─────────────────────────────────────────────────

export function getAssignmentLockStates(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return Object.fromEntries(MOCK_ASSIGNMENTS.map((a) => [a.id, a.isUnlocked]));
  }
  return Object.fromEntries(
    MOCK_ASSIGNMENTS.map((a) => {
      const stored = localStorage.getItem(
        `ofekos:admin:assignment:${a.id}:unlocked`
      );
      return [a.id, stored !== null ? stored === "true" : a.isUnlocked];
    })
  );
}

export function setAssignmentLocked(
  assignmentId: string,
  unlocked: boolean
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `ofekos:admin:assignment:${assignmentId}:unlocked`,
    String(unlocked)
  );
}

// ── Resources ───────────────────────────────────────────────────────────────

export function getResources(): AdminResource[] {
  return safeRead<AdminResource[]>(RESOURCES_KEY, MOCK_ADMIN_RESOURCES);
}

export function addResource(meta: NewAdminResource): AdminResource {
  const list = getResources();
  const resource: AdminResource = {
    ...meta,
    id: "r" + Date.now(),
    uploadedAt: new Date().toISOString().split("T")[0],
  };
  safeWrite(RESOURCES_KEY, [...list, resource]);
  return resource;
}

export function deleteResource(id: string): void {
  safeWrite(
    RESOURCES_KEY,
    getResources().filter((r) => r.id !== id)
  );
}

// ── Analytics ───────────────────────────────────────────────────────────────

export function getCompletionStats(): AssignmentCompletionStat[] {
  const participants = getParticipants();
  const total = participants.length;

  return MOCK_ASSIGNMENTS.map((a) => {
    const lockStates = getAssignmentLockStates();
    if (!lockStates[a.id]) {
      return {
        assignmentId: a.id,
        title: a.title,
        accentColor: a.accentColor,
        notStarted: 0,
        inProgress: 0,
        submitted: 0,
        total,
      };
    }
    // Derive from participant progress (rough approximation using mock data)
    const submittedCount = MOCK_SUBMISSIONS.filter(
      (s) => s.assignmentId === a.id
    ).length;
    const inProgressCount = Math.max(
      0,
      Math.round(total * 0.2) - (a.sessionNumber > 2 ? 1 : 0)
    );
    const notStarted = Math.max(0, total - submittedCount - inProgressCount);
    return {
      assignmentId: a.id,
      title: a.title,
      accentColor: a.accentColor,
      notStarted,
      inProgress: inProgressCount,
      submitted: submittedCount,
      total,
    };
  });
}

export function getSubmissions(): Submission[] {
  return MOCK_SUBMISSIONS;
}

export function getPrepareStats(): { completed: number; total: number } {
  return { completed: 3, total: getParticipants().length };
}
