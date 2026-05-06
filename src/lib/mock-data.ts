import type {
  User,
  Session,
  Participant,
  Program,
  WorkbookEntry,
  RoleConfig,
} from "./types";

export const ROLES: RoleConfig[] = [
  {
    id: "participant",
    label: "Participant",
    description:
      "Your personal learning journey — sessions, reflections, workbook, and AI practice space.",
    href: "/participant",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    accentColor: "bg-indigo-600",
  },
  {
    id: "manager",
    label: "Direct Manager",
    description:
      "Support your team members, review shared progress, and complete validation tasks.",
    href: "/manager",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    accentColor: "bg-emerald-600",
  },
  {
    id: "facilitator",
    label: "Facilitator",
    description:
      "Manage cohorts, guide sessions, and monitor participant engagement and progress.",
    href: "/facilitator",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    accentColor: "bg-amber-500",
  },
  {
    id: "admin",
    label: "Admin",
    description:
      "Configure programs, manage users, and access full operational analytics.",
    href: "/admin",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    accentColor: "bg-slate-600",
  },
];

export const MOCK_USER: User = {
  id: "u1",
  name: "Ofek Ben-David",
  email: "ofek@example.com",
  role: "participant",
  avatarInitials: "OB",
};

export const MOCK_PROGRAM: Program = {
  id: "prog-1",
  name: "Leadership Development Cohort — Spring 2025",
  startDate: "2025-03-01",
  endDate: "2025-08-31",
  cohortSize: 24,
  activeSessions: 3,
  completionRate: 62,
};

export const MOCK_SESSIONS: Session[] = [
  {
    id: "s1",
    title: "Foundations of Management",
    date: "2025-03-15",
    status: "completed",
    description:
      "Establishing your management identity and defining your leadership style.",
    durationMinutes: 120,
  },
  {
    id: "s2",
    title: "Giving Effective Feedback",
    date: "2025-04-10",
    status: "completed",
    description:
      "Frameworks for constructive, timely, and actionable feedback conversations.",
    durationMinutes: 90,
  },
  {
    id: "s3",
    title: "Difficult Conversations",
    date: "2025-05-08",
    status: "active",
    description:
      "Navigating complex interpersonal situations with clarity and care.",
    durationMinutes: 120,
  },
  {
    id: "s4",
    title: "Delegation & Empowerment",
    date: "2025-06-12",
    status: "upcoming",
    description:
      "Building trust and accountability through intentional delegation.",
    durationMinutes: 90,
  },
  {
    id: "s5",
    title: "Strategic Thinking for Managers",
    date: "2025-07-10",
    status: "upcoming",
    description: "Shifting from operational to strategic mindset.",
    durationMinutes: 120,
  },
];

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: "p1",
    name: "Noa Katz",
    email: "noa@example.com",
    progress: 80,
    lastActive: "2025-05-01",
    sessionsCompleted: 4,
    totalSessions: 5,
    managerId: "m1",
  },
  {
    id: "p2",
    name: "Yoav Levi",
    email: "yoav@example.com",
    progress: 60,
    lastActive: "2025-04-28",
    sessionsCompleted: 3,
    totalSessions: 5,
    managerId: "m1",
  },
  {
    id: "p3",
    name: "Roni Shapira",
    email: "roni@example.com",
    progress: 100,
    lastActive: "2025-05-02",
    sessionsCompleted: 5,
    totalSessions: 5,
    managerId: "m2",
  },
  {
    id: "p4",
    name: "Dana Cohen",
    email: "dana@example.com",
    progress: 40,
    lastActive: "2025-04-20",
    sessionsCompleted: 2,
    totalSessions: 5,
    managerId: "m2",
  },
  {
    id: "p5",
    name: "Ilan Mizrahi",
    email: "ilan@example.com",
    progress: 20,
    lastActive: "2025-04-10",
    sessionsCompleted: 1,
    totalSessions: 5,
    managerId: "m3",
  },
];

export const MOCK_WORKBOOK_ENTRIES: WorkbookEntry[] = [
  {
    id: "w1",
    sessionId: "s1",
    sessionTitle: "Foundations of Management",
    createdAt: "2025-03-15",
    updatedAt: "2025-03-18",
    isShared: false,
  },
  {
    id: "w2",
    sessionId: "s2",
    sessionTitle: "Giving Effective Feedback",
    createdAt: "2025-04-10",
    updatedAt: "2025-04-14",
    isShared: true,
  },
];
