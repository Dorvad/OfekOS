export type Role = "participant" | "manager" | "facilitator" | "admin";

export type SessionStatus = "upcoming" | "active" | "completed";

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
