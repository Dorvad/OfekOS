import { createClient } from "@/lib/supabase/client";
import { MOCK_ASSIGNMENTS } from "./mock-data";
import type {
  Participant, NewParticipant, Cohort, AdminResource, NewAdminResource,
  AssignmentCompletionStat, Submission,
} from "./types";

// ── Participants ────────────────────────────────────────────

export async function getParticipants(): Promise<Participant[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, cohort_id, avatar_initials")
    .eq("role", "participant")
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((u) => ({
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
  const supabase = createClient();
  const [{ data: cohorts, error: ce }, { data: users, error: ue }] = await Promise.all([
    supabase.from("cohorts").select("id, name").order("created_at"),
    supabase.from("users").select("id, cohort_id").eq("role", "participant"),
  ]);
  if (ce) throw ce;
  if (ue) throw ue;
  return (cohorts ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    participantIds: (users ?? []).filter((u) => u.cohort_id === c.id).map((u) => u.id),
  }));
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
  const supabase = createClient();
  const { data, error } = await supabase.from("assignments").select("id, is_unlocked");
  if (error) {
    return Object.fromEntries(MOCK_ASSIGNMENTS.map((a) => [a.id, a.isUnlocked]));
  }
  return Object.fromEntries((data ?? []).map((a) => [a.id, a.is_unlocked]));
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
  const supabase = createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id, name, type, url, file_size_kb, description, session_number, created_at")
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    url: r.url,
    fileSizeKb: r.file_size_kb,
    description: r.description,
    sessionNumber: r.session_number,
    uploadedAt: (r.created_at as string).split("T")[0],
  }));
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
  const supabase = createClient();
  const [{ data: pas }, { data: users }, { data: assignments }] = await Promise.all([
    supabase.from("participant_assignments").select("assignment_id, status"),
    supabase.from("users").select("id").eq("role", "participant"),
    supabase.from("assignments").select("id, title, accent_color, is_unlocked"),
  ]);
  const total = (users ?? []).length;
  // Use live DB assignments; fall back to MOCK shape if table is empty
  const assignmentList = (assignments && assignments.length > 0)
    ? assignments.map((a) => ({ id: a.id, title: a.title as string, accentColor: a.accent_color as string, isUnlocked: a.is_unlocked as boolean }))
    : MOCK_ASSIGNMENTS.map((a) => ({ id: a.id, title: a.title, accentColor: a.accentColor, isUnlocked: a.isUnlocked }));

  return assignmentList.map((a) => {
    if (!a.isUnlocked) {
      return { assignmentId: a.id, title: a.title, accentColor: a.accentColor, notStarted: 0, inProgress: 0, submitted: 0, total };
    }
    const rows = (pas ?? []).filter((p) => p.assignment_id === a.id);
    const submitted = rows.filter((p) => p.status === "submitted" || p.status === "achieved").length;
    const inProgress = rows.filter((p) => !["locked", "available", "submitted", "achieved"].includes(p.status)).length;
    return { assignmentId: a.id, title: a.title, accentColor: a.accentColor, notStarted: Math.max(0, total - submitted - inProgress), inProgress, submitted, total };
  });
}

export async function getSubmissions(): Promise<Submission[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("participant_assignments")
    .select("id, user_id, assignment_id, insight, closing_action, closing_question, achieved_at, users(name), assignments(title)")
    .not("insight", "is", null)
    .order("achieved_at", { ascending: false });
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.users?.name ?? "",
    assignmentId: row.assignment_id,
    assignmentTitle: row.assignments?.title ?? "",
    insight: row.insight ?? "",
    action: row.closing_action ?? "",
    question: row.closing_question ?? "",
    submittedAt: row.achieved_at?.split("T")[0] ?? "",
  }));
}

export async function getPrepareStats(): Promise<{ completed: number; total: number }> {
  const supabase = createClient();
  const [{ data: prepares }, { data: users }] = await Promise.all([
    supabase.from("prepare_data").select("user_id, insight, dilemma, action, question"),
    supabase.from("users").select("id").eq("role", "participant"),
  ]);
  const total = (users ?? []).length;
  const completed = (prepares ?? []).filter(
    (p) => p.insight && p.dilemma && p.action && p.question
  ).length;
  return { completed, total };
}
