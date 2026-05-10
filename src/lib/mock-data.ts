import type {
  User,
  Session,
  SessionContent,
  Task,
  WorkbookSection,
  PracticeScenario,
  Participant,
  Program,
  WorkbookEntry,
  RoleConfig,
  Assignment,
  Cohort,
  AdminResource,
  Submission,
} from "./types";

// ---------------------------------------------------------------------------
// Role configs (used on homepage and header)
// ---------------------------------------------------------------------------

export const ROLES: RoleConfig[] = [
  {
    id: "participant",
    label: "משתתף/ת",
    description:
      "המסע האישי שלך — מטלות, תיק המנהל, הכנה למפגשים, וחומרי למידה.",
    href: "/participant",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    accentColor: "bg-indigo-600",
  },
  {
    id: "admin",
    label: "מנהל/ת תוכנית",
    description:
      "ניהול תוכן, משתתפים, נעילת מטלות וצפייה בנתוני השלמה.",
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
  name: "תוכנית אופק — פיתוח מנהלים בכירים",
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
    title: "יסודות המנהל החדש",
    date: "2025-03-15",
    status: "completed",
    description:
      "גיבוש זהות ניהולית וכיוון אישי — המעבר מביצוע להובלה.",
    durationMinutes: 120,
  },
  {
    id: "s2",
    title: "מתן משוב",
    date: "2025-04-10",
    status: "completed",
    description:
      "כלים לשיחות משוב אפקטיביות — ספציפיות, ממוקדות ומקדמות.",
    durationMinutes: 90,
  },
  {
    id: "s3",
    title: "שיחות עם הצוות",
    date: "2025-05-08",
    status: "active",
    description:
      "ניהול שיחות קשות ומיפוי מערכת הצוות כמנוע אנרגיה.",
    durationMinutes: 120,
  },
  {
    id: "s4",
    title: "ניהול כלפי מעלה",
    date: "2025-06-12",
    status: "upcoming",
    description:
      "השפעה, הנעה וקידום נושאים מול הממונה מתוך ראייה אסטרטגית.",
    durationMinutes: 90,
  },
  {
    id: "s5",
    title: "ניהול זמן ועדיפויות",
    date: "2025-07-10",
    status: "upcoming",
    description: "עבודה תחת עומס — תיעדוף, האצלה ושמירה על הקצב הניהולי.",
    durationMinutes: 120,
  },
  {
    id: "s6",
    title: "הובלת שינוי",
    date: "2025-08-07",
    status: "upcoming",
    description: "אבחון התנגדות לשינוי ובניית שיחה שמכילה ומקדמת.",
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
    cohortId: "c1",
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
    cohortId: "c2",
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
    cohortId: "c1",
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
    cohortId: "c2",
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
    cohortId: null,
  },
];

export const MOCK_COHORTS: Cohort[] = [
  { id: "c1", name: "קבוצה א", participantIds: ["p1", "p3"] },
  { id: "c2", name: "קבוצה ב", participantIds: ["p2", "p4"] },
];

export const MOCK_ADMIN_RESOURCES: AdminResource[] = [];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub1",
    userId: "p3",
    userName: "Roni Shapira",
    assignmentId: "a1",
    assignmentTitle: "כוכב הצפון שלי",
    insight: "הבנתי שאני עדיין נמצא בחשיבה של עובד ולא של מנהל — אני פותר בעיות במקום לפתח את הצוות לפתור אותן.",
    action: "אקיים שיחה שבועית קצרה של 15 דקות עם כל עובד כדי לעקוב אחרי ההתפתחות שלו.",
    question: "כיצד מאזנים בין מתן עצמאות לצוות לבין שמירה על סטנדרטים?",
    submittedAt: "2025-05-02",
  },
  {
    id: "sub2",
    userId: "p1",
    userName: "Noa Katz",
    assignmentId: "a1",
    assignmentTitle: "כוכב הצפון שלי",
    insight: "גיליתי שהכישורים שהביאו אותי לכאן — מומחיות טכנית ופתרון בעיות — הם לא מה שיוביל אותי הלאה.",
    action: "אשתמש בשאלות פתוחות בשיחות הצוות השבועיות במקום לתת תשובות מיידיות.",
    question: "מתי נכון להכריע לבד ומתי לערב את הצוות בהחלטה?",
    submittedAt: "2025-05-01",
  },
  {
    id: "sub3",
    userId: "p2",
    userName: "Yoav Levi",
    assignmentId: "a2",
    assignmentTitle: "שיחת משוב",
    insight: "קשה לי לתת משוב שלילי — אני מרגיש שאני פוגע באדם. הבנתי שמשוב ספציפי וממוקד פחות מאיים מאשר הערות כלליות.",
    action: "אתן משוב SBI אחד ספציפי עד סוף השבוע הקרוב לעמית שצריך אותו.",
    question: "מה עושים כשהעובד מתגונן ומכחיש את ההתנהגות שתיארת?",
    submittedAt: "2025-05-03",
  },
  {
    id: "sub4",
    userId: "p3",
    userName: "Roni Shapira",
    assignmentId: "a2",
    assignmentTitle: "שיחת משוב",
    insight: "המשוב שנתתי היה טוב מבחינה טכנית אבל פספסתי את הצד הרגשי — הייתי צריך לאפשר לו לדבר יותר.",
    action: "אתחיל כל שיחת משוב בשאלה פתוחה לפני שאמסור את המשוב שלי.",
    question: "איך מתמודדים עם עובד שמסכים בשיחה אבל לא משנה התנהגות בפועל?",
    submittedAt: "2025-05-04",
  },
];

// ---------------------------------------------------------------------------
// Workbook entries (legacy — used by admin / manager views)
// ---------------------------------------------------------------------------

export const MOCK_WORKBOOK_ENTRIES: WorkbookEntry[] = [
  {
    id: "w1",
    sessionId: "s1",
    sessionTitle: "יסודות המנהל החדש",
    createdAt: "2025-03-15",
    updatedAt: "2025-03-18",
    isShared: false,
  },
  {
    id: "w2",
    sessionId: "s2",
    sessionTitle: "מתן משוב",
    createdAt: "2025-04-10",
    updatedAt: "2025-04-14",
    isShared: true,
  },
];

// ---------------------------------------------------------------------------
// Assignments (gamified homework — participant-only)
// ---------------------------------------------------------------------------

const PHASES = [
  { id: "briefing", label: "המשימה",  description: "קרא את פרטי המשימה והבן מה עליך לעשות" },
  { id: "main",     label: "ביצוע",   description: "בצע את המשימה צעד אחר צעד" },
  { id: "insight",  label: "תובנה",   description: "סכם תובנה אחת, פעולה אחת ושאלה למפגש הבא" },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    sessionNumber: 1,
    title: "כוכב הצפון שלי",
    subtitle: "שיחה עם הממונה וגיבוש כיוון מנהיגותי",
    missionBrief:
      "אחת המיומנויות החשובות ביותר של מנהל/ת היא להיות ברור/ה לגבי הכיוון האישי שלו/ה — מה הוא/היא רוצה להשיג בתפקיד, איפה הוא/היא נמצא/ת היום, ומה הפער שצריך לגשר. המטלה שלך: להתכונן לשיחה עם הממונה שלך, להציג את המיקודים שגיבשת, ולצאת עם פעולות קונקרטיות.",
    accentColor: "amber",
    achievementLabel: "מגדיר כיוון",
    isUnlocked: true,
    phases: PHASES,
  },
  {
    id: "a2",
    sessionNumber: 2,
    title: "שיחת משוב או שיחה קשה",
    subtitle: "הכנה, ביצוע ורפלקציה על שיחה מנהיגותית",
    missionBrief:
      "משוב ושיחות קשות הם הכלים המרכזיים של המנהל/ת. המטלה שלך: לבחור שיחה שמחכה לך — משוב לעובד/ת או שיחה מורכבת — להתכונן אליה בצורה מובנית, לקיים אותה, ולהפיק ממנה לקחים.",
    accentColor: "violet",
    achievementLabel: "מנהל שיחה",
    isUnlocked: true,
    phases: PHASES,
  },
  {
    id: "a3",
    sessionNumber: 3,
    title: "הובלת צוות אפקטיבי",
    subtitle: "מיפוי חוזקות, תפקידים לא פורמליים ו-Quick Win",
    missionBrief:
      "מנהל/ת אפקטיבי/ת מכיר/ה את הצוות כמערכת — לא רק כיחידים. המטלה שלך: למפות את חברי הצוות, לזהות חוזקות ותפקידים לא פורמליים, ולבחור פעולה אחת שתחזק את הצוות בטווח הקרוב.",
    accentColor: "teal",
    achievementLabel: "מנהיג צוות",
    isUnlocked: false,
    phases: PHASES,
  },
  {
    id: "a4",
    sessionNumber: 4,
    title: "הנעה והשפעה — ניהול כלפי מעלה",
    subtitle: "הכנה ושיחה ממוקדת פתרון עם הממונה",
    missionBrief:
      "ניהול כלפי מעלה הוא מיומנות קריטית — להניע, להשפיע ולקדם נושאים חשובים מול הממונה שלך. המטלה שלך: לבחור נושא שחשוב לך, להתכונן לשיחה מנקודת המבט של הממונה, ולהציג פתרון ובקשה ברורה.",
    accentColor: "emerald",
    achievementLabel: "משפיע כלפי מעלה",
    isUnlocked: false,
    phases: PHASES,
  },
  {
    id: "a5",
    sessionNumber: 5,
    title: "ניהול עצמי ועדיפויות",
    subtitle: "מטריצת דחוף-חשוב ותכנון האצלה",
    missionBrief:
      "מנהל/ת אפקטיבי/ת יודע/ת לנהל את עצמו/ה — לא רק את הצוות. המטלה שלך: למפות את המשימות שלך, לסווג אותן לפי דחיפות וחשיבות, ולזהות מה ניתן להאציל — ולמי — כדי לפנות זמן לעבודה האמיתית שלך כמנהל/ת.",
    accentColor: "orange",
    achievementLabel: "מנהל עצמי",
    isUnlocked: false,
    phases: PHASES,
  },
  {
    id: "a6",
    sessionNumber: 6,
    title: "תפקיד המנהל בשינוי",
    subtitle: "זיהוי שלב השינוי, אבחון התנגדות ותכנון שיחה",
    missionBrief:
      "תפקיד המנהל/ת בשינוי הוא לא רק לנהל תהליכים — אלא לנהל אנשים בשינוי. המטלה שלך: לבחור עובד/ת או צוות שמושפעים משינוי, לאבחן את שלב ההתמודדות שלהם, ולתכנן שיחה שמתחילה בהכלה ומגיעה לפתרון.",
    accentColor: "indigo",
    achievementLabel: "מוביל שינוי",
    isUnlocked: false,
    phases: PHASES,
  },
];

export const ASSIGNMENT_IDS = MOCK_ASSIGNMENTS.map((a) => a.id);
