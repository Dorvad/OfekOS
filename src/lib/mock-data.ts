import type {
  User,
  Session,
  SessionContent,
  Task,
  WorkbookSection,
  PracticeScenario,
  Resource,
  Participant,
  Program,
  WorkbookEntry,
  RoleConfig,
} from "./types";

// ---------------------------------------------------------------------------
// Role configs (used on homepage and header)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// User + Program
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Sessions (base — used by all roles)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Tasks (2 per session)
// ---------------------------------------------------------------------------

export const MOCK_TASKS: Task[] = [
  {
    id: "t1-prep",
    title: "Read the pre-session article on management identity",
    type: "preparation",
    sessionId: "s1",
    description:
      "Read the provided article on the transition from individual contributor to manager. Note 2 ideas that resonate with you.",
    defaultStatus: "completed",
  },
  {
    id: "t1-reflect",
    title: "Complete the Role Perception workbook section",
    type: "reflection",
    sessionId: "s1",
    description:
      "Open your workbook and write your reflection in the My Role Perception section.",
    defaultStatus: "completed",
  },
  {
    id: "t2-prep",
    title: "Identify a feedback conversation you need to have",
    type: "preparation",
    sessionId: "s2",
    description:
      "Think of a real feedback situation from the past 2 weeks. You will use this as a case study in the session.",
    defaultStatus: "completed",
  },
  {
    id: "t2-reflect",
    title: "Complete the Communication Style workbook section",
    type: "reflection",
    sessionId: "s2",
    description:
      "Reflect on your feedback style and fill in the Communication Style section of your workbook.",
    defaultStatus: "completed",
  },
  {
    id: "t3-prep",
    title: "Map a difficult conversation you have been avoiding",
    type: "preparation",
    sessionId: "s3",
    description:
      "Think of a conversation you have been putting off. Write 3 sentences about what is holding you back.",
    defaultStatus: "not_started",
  },
  {
    id: "t3-reflect",
    title: "Practice the conversation in the AI Practice Space",
    type: "practice",
    sessionId: "s3",
    description:
      "Use the Practice Area to run a Difficult Conversation simulation before the live session.",
    defaultStatus: "not_started",
  },
  {
    id: "t4-prep",
    title: "List 3 tasks you currently own that could be delegated",
    type: "preparation",
    sessionId: "s4",
    description:
      "Review your current task list. Identify 3 items that could be delegated. Note who you would delegate each to and why.",
    defaultStatus: "locked",
  },
  {
    id: "t4-reflect",
    title: "Complete the Influence Plan workbook section",
    type: "reflection",
    sessionId: "s4",
    description:
      "After the session, fill in the My Influence Plan section of your workbook.",
    defaultStatus: "locked",
  },
  {
    id: "t5-prep",
    title: "Read the strategic thinking frameworks document",
    type: "preparation",
    sessionId: "s5",
    description:
      "Review the resources section and read the strategic frameworks document before the session.",
    defaultStatus: "locked",
  },
  {
    id: "t5-reflect",
    title: "Complete the Leadership Development Summary",
    type: "reflection",
    sessionId: "s5",
    description:
      "After the final session, complete your Leadership Development Summary workbook section.",
    defaultStatus: "locked",
  },
];

// ---------------------------------------------------------------------------
// Session content (rich detail — participant-only)
// ---------------------------------------------------------------------------

export const MOCK_SESSION_CONTENTS: Record<string, SessionContent> = {
  s1: {
    sessionId: "s1",
    whyItMatters:
      "The shift from individual contributor to manager is one of the most significant professional transitions you will ever make. Without a clear sense of your role, you risk spending your time doing the wrong things — managing tasks instead of people, being the expert instead of the enabler.",
    coreConcepts: [
      "The identity shift: from 'doing' to 'enabling'",
      "Defining your responsibilities versus your team's responsibilities",
      "Building psychological safety from day one",
      "Your management style: awareness before change",
      "The manager's role in culture and team norms",
    ],
    preparationTask: MOCK_TASKS.find((t) => t.id === "t1-prep")!,
    reflectionTask: MOCK_TASKS.find((t) => t.id === "t1-reflect")!,
    workbookSectionId: "ws1",
    practiceScenarioId: null,
    resourceIds: ["r1", "r7"],
  },
  s2: {
    sessionId: "s2",
    whyItMatters:
      "Feedback is the primary tool of a manager. Without it, people don't grow, problems fester, and trust erodes. With it — done well — you create a culture of openness and continuous improvement that compounds over time.",
    coreConcepts: [
      "The SBI model: Situation, Behaviour, Impact",
      "The difference between feedback and evaluation",
      "Positive feedback as a leadership tool, not just praise",
      "Creating a regular feedback cadence with your team",
      "Receiving feedback well as a manager",
    ],
    preparationTask: MOCK_TASKS.find((t) => t.id === "t2-prep")!,
    reflectionTask: MOCK_TASKS.find((t) => t.id === "t2-reflect")!,
    workbookSectionId: "ws2",
    practiceScenarioId: "ps1",
    resourceIds: ["r2", "r3"],
  },
  s3: {
    sessionId: "s3",
    whyItMatters:
      "Every manager has conversations they are avoiding. Avoiding them doesn't make them go away — it makes them worse. This session gives you a framework and the practice reps you need to walk into hard conversations with clarity and confidence.",
    coreConcepts: [
      "Why we avoid difficult conversations — and what it costs",
      "The PREP framework: Prepare, Relate, Explore, Plan",
      "Managing your own emotional state before and during",
      "Staying curious instead of defensive",
      "Following up after a hard conversation to reinforce trust",
    ],
    preparationTask: MOCK_TASKS.find((t) => t.id === "t3-prep")!,
    reflectionTask: MOCK_TASKS.find((t) => t.id === "t3-reflect")!,
    workbookSectionId: "ws3",
    practiceScenarioId: "ps2",
    resourceIds: ["r4", "r5"],
  },
  s4: {
    sessionId: "s4",
    whyItMatters:
      "Delegation is not about offloading work — it is about growing your team and freeing yourself to work at the right level. Poor delegation creates bottlenecks, disengagement, and burnout on all sides.",
    coreConcepts: [
      "The delegation spectrum: from directing to fully empowering",
      "Matching delegation level to employee readiness and trust",
      "Setting clear expectations and meaningful check-in points",
      "Giving ownership without micromanaging",
      "What to delegate — and what to keep",
    ],
    preparationTask: MOCK_TASKS.find((t) => t.id === "t4-prep")!,
    reflectionTask: MOCK_TASKS.find((t) => t.id === "t4-reflect")!,
    workbookSectionId: "ws4",
    practiceScenarioId: "ps3",
    resourceIds: ["r6", "r7"],
  },
  s5: {
    sessionId: "s5",
    whyItMatters:
      "The best managers are not just good at managing people — they are strategic thinkers who understand the broader context of their team's work and can translate that into direction. This session helps you develop the habit of zooming out.",
    coreConcepts: [
      "The difference between operational and strategic thinking",
      "Horizon planning: now, next, and future",
      "Communicating strategy clearly to your team",
      "Building alignment between your team's work and org goals",
      "Developing your strategic intuition over time",
    ],
    preparationTask: MOCK_TASKS.find((t) => t.id === "t5-prep")!,
    reflectionTask: MOCK_TASKS.find((t) => t.id === "t5-reflect")!,
    workbookSectionId: "ws6",
    practiceScenarioId: "ps4",
    resourceIds: ["r7", "r8"],
  },
};

// ---------------------------------------------------------------------------
// Workbook sections
// ---------------------------------------------------------------------------

export const MOCK_WORKBOOK_SECTIONS: WorkbookSection[] = [
  {
    id: "ws1",
    title: "My Role Perception",
    subtitle: "How I see my role as a manager",
    prompt:
      "Describe what being a manager means to you. What responsibilities do you feel most ownership over? What aspects of your role do you find most energising — and most challenging?",
    sessionId: "s1",
    order: 1,
    defaultPrivacy: "private",
  },
  {
    id: "ws2",
    title: "My Communication Style",
    subtitle: "How I give and receive feedback",
    prompt:
      "Reflect on how you communicate with your team. How do you currently give feedback — what's your default style? What do you do well, and what would you like to change or improve?",
    sessionId: "s2",
    order: 2,
    defaultPrivacy: "private",
  },
  {
    id: "ws3",
    title: "My Team Map",
    subtitle: "Understanding the people I manage",
    prompt:
      "Describe each person on your team. What are their strengths? What motivates them? What do they need from you as their manager right now? Where are there gaps or tensions you want to address?",
    sessionId: "s3",
    order: 3,
    defaultPrivacy: "private",
  },
  {
    id: "ws4",
    title: "My Influence Plan",
    subtitle: "How I build buy-in and lead change",
    prompt:
      "Think about a change or initiative you are currently leading or will soon lead. Who are the key stakeholders? What is your plan to build alignment, manage resistance, and sustain momentum?",
    sessionId: "s4",
    order: 4,
    defaultPrivacy: "shared",
  },
  {
    id: "ws5",
    title: "My Results Dashboard",
    subtitle: "The outcomes I am driving",
    prompt:
      "What are the 2–3 results you are most focused on achieving this quarter? How will you know you have succeeded? What obstacles are in the way, and what is your plan to address them?",
    sessionId: null,
    order: 5,
    defaultPrivacy: "shared",
  },
  {
    id: "ws6",
    title: "My Leadership Development Summary",
    subtitle: "How I have grown through this program",
    prompt:
      "Looking back on the program so far, what have you learned about yourself as a manager? What will you do differently? What specific commitment are you making for the next 90 days?",
    sessionId: "s5",
    order: 6,
    defaultPrivacy: "shared",
  },
];

// ---------------------------------------------------------------------------
// Practice scenarios
// ---------------------------------------------------------------------------

export const MOCK_PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: "ps1",
    title: "Giving Constructive Feedback",
    skillPracticed: "Feedback delivery",
    sessionId: "s2",
    difficulty: "beginner",
    estimatedMinutes: 10,
    description:
      "Practice giving structured, specific feedback to a team member who has been missing deadlines. The AI agent plays the employee — respond as you would in a real conversation.",
    tips: [
      "Use the SBI model: describe the Situation, the Behaviour, and its Impact",
      "Stay curious — ask the employee for their perspective before concluding",
      "End with a clear, agreed next step rather than leaving it open-ended",
    ],
    agentId: null,
  },
  {
    id: "ps2",
    title: "Navigating a Difficult Conversation",
    skillPracticed: "Conflict navigation",
    sessionId: "s3",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    description:
      "Navigate a conversation with an employee whose performance has been declining and who becomes defensive when addressed. Your goal is to keep the conversation productive and forward-looking.",
    tips: [
      "Prepare your opening — know the specific situation you want to address",
      "When they get defensive, slow down and reflect back what you heard",
      "Separate the person from the behaviour — focus on impact, not character",
    ],
    agentId: null,
  },
  {
    id: "ps3",
    title: "Delegating to a Reluctant Team Member",
    skillPracticed: "Delegation",
    sessionId: "s4",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    description:
      "Delegate a significant project to a team member who tends to express self-doubt or push back. The AI agent resists — your job is to delegate clearly while building their confidence.",
    tips: [
      "Be specific about scope, success criteria, and timeline from the start",
      "Acknowledge their hesitation without accepting it as the final answer",
      "Agree on check-in points so they know you haven't abandoned them",
    ],
    agentId: null,
  },
  {
    id: "ps4",
    title: "Managing Upward: A Priority Conflict",
    skillPracticed: "Managing upward",
    sessionId: "s5",
    difficulty: "advanced",
    estimatedMinutes: 15,
    description:
      "Communicate a disagreement about priorities to your own manager. The AI agent plays a senior leader with a different view. Your job is to advocate clearly while keeping the relationship intact.",
    tips: [
      "Come with data and a clear recommendation, not just a problem",
      "Acknowledge their constraints before presenting your perspective",
      "Know your bottom line — what can you flex on, and what can't you?",
    ],
    agentId: null,
  },
  {
    id: "ps5",
    title: "Managing Resistance to Change",
    skillPracticed: "Change leadership",
    sessionId: "s4",
    difficulty: "advanced",
    estimatedMinutes: 15,
    description:
      "Lead a team member through resistance to a new process being rolled out across the organisation. The AI agent pushes back hard — stay calm, listen, and build buy-in.",
    tips: [
      "Validate the concern before addressing it — don't dismiss pushback",
      "Connect the change to something the employee cares about",
      "Invite them to shape the implementation rather than just accept it",
    ],
    agentId: null,
  },
  {
    id: "ps6",
    title: "Re-engaging a Disengaged Employee",
    skillPracticed: "Motivation and engagement",
    sessionId: "s3",
    difficulty: "beginner",
    estimatedMinutes: 12,
    description:
      "Have a check-in conversation with a team member who has seemed checked out and low-energy lately. Your goal is to understand what's going on and reconnect them to the work.",
    tips: [
      "Open with genuine curiosity — this is a listening conversation first",
      "Avoid jumping to solutions before you understand the root cause",
      "Look for what they used to find motivating and see if it's still accessible",
    ],
    agentId: null,
  },
];

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export const MOCK_RESOURCES: Resource[] = [
  {
    id: "r1",
    title: "From Expert to Manager: The Identity Shift",
    type: "link",
    sessionId: "s1",
    description:
      "A Harvard Business Review article on the psychological and practical challenges of transitioning from individual contributor to first-time manager.",
    url: "#",
  },
  {
    id: "r2",
    title: "Feedback Conversation Template (SBI Model)",
    type: "template",
    sessionId: "s2",
    description:
      "A one-page template for planning a feedback conversation using the Situation–Behaviour–Impact framework. Print or fill in digitally before a real conversation.",
    url: "#",
  },
  {
    id: "r3",
    title: "Positive Feedback: Why It Matters More Than You Think",
    type: "link",
    sessionId: "s2",
    description:
      "Research-backed article on the outsized impact of specific, timely positive feedback on team performance and psychological safety.",
    url: "#",
  },
  {
    id: "r4",
    title: "PREP Framework: Difficult Conversations Guide",
    type: "file",
    sessionId: "s3",
    description:
      "A two-page reference guide explaining the PREP framework (Prepare, Relate, Explore, Plan) for navigating difficult management conversations.",
    url: "#",
  },
  {
    id: "r5",
    title: "Difficult Conversations Prep Sheet",
    type: "template",
    sessionId: "s3",
    description:
      "A structured template to complete before entering a difficult conversation. Covers your goal, key points, anticipated reactions, and your plan for follow-up.",
    url: "#",
  },
  {
    id: "r6",
    title: "Delegation Decision Matrix",
    type: "template",
    sessionId: "s4",
    description:
      "A practical matrix to help you decide what to delegate, to whom, and at what level of autonomy — based on task complexity and team member readiness.",
    url: "#",
  },
  {
    id: "r7",
    title: "Strategic Thinking Frameworks for Managers",
    type: "file",
    sessionId: "s5",
    description:
      "An overview of three practical frameworks for developing strategic thinking: Horizon Planning, Stakeholder Mapping, and the Strategy-to-Team Translation model.",
    url: "#",
  },
  {
    id: "r8",
    title: "The Management Fundamentals Reading List",
    type: "link",
    sessionId: null,
    description:
      "A curated list of 10 essential books for new and developing managers, with a one-paragraph summary of each and what it is best read for.",
    url: "#",
  },
  {
    id: "r9",
    title: "Program Overview and Session Guide",
    type: "file",
    sessionId: null,
    description:
      "The full program overview including session dates, learning objectives, workbook structure, and what to expect from the AI practice space.",
    url: "#",
  },
];

// ---------------------------------------------------------------------------
// Participants (used by manager / facilitator / admin dashboards)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Workbook entries (legacy — used by admin / manager views)
// ---------------------------------------------------------------------------

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
