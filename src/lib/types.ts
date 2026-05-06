export type Role = "participant" | "manager" | "facilitator" | "admin";

export type SessionStatus = "upcoming" | "active" | "completed";

export type TaskStatus = "not_started" | "in_progress" | "completed" | "locked";

export type ResourceType = "file" | "template" | "link" | "video";

export type WorkbookPrivacy = "private" | "shared";

export type PracticeDifficulty = "beginner" | "intermediate" | "advanced";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  status: SessionStatus;
  description: string;
  durationMinutes: number;
}

export interface Task {
  id: string;
  title: string;
  type: "preparation" | "reflection" | "workbook" | "practice";
  sessionId: string;
  description: string;
  defaultStatus: TaskStatus;
}

export interface SessionContent {
  sessionId: string;
  whyItMatters: string;
  coreConcepts: string[];
  preparationTask: Task;
  reflectionTask: Task;
  workbookSectionId: string;
  practiceScenarioId: string | null;
  resourceIds: string[];
}

export interface WorkbookSection {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  sessionId: string | null;
  order: number;
  defaultPrivacy: WorkbookPrivacy;
}

export interface WorkbookSectionEntry {
  sectionId: string;
  content: string;
  savedAt: string;
  privacy: WorkbookPrivacy;
}

export interface PracticeScenario {
  id: string;
  title: string;
  skillPracticed: string;
  sessionId: string;
  difficulty: PracticeDifficulty;
  estimatedMinutes: number;
  description: string;
  tips: string[];
  agentId: string | null;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  sessionId: string | null;
  description: string;
  url: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
  sessionsCompleted: number;
  totalSessions: number;
  managerId: string;
}

export interface Program {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  cohortSize: number;
  activeSessions: number;
  completionRate: number;
}

export interface WorkbookEntry {
  id: string;
  sessionId: string;
  sessionTitle: string;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
}

export interface RoleConfig {
  id: Role;
  label: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
}
