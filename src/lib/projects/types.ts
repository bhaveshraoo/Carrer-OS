export type SeniorityTag =
  | "Freshers / Entry Level"
  | "Junior Intern"
  | "Mid-Level Engineer"
  | "Senior / Lead Track"
  | "Architect / PM Level";

export interface ProjectTeam {
  id: string;
  projectId: string;
  teamName: string; // e.g. "Team 1 - Frontend & AI", "Team 2 - Core Backend"
  teamLeaderName: string;
  teamLeaderEmail: string;
  maxSeats: number;
  filledSeats: number;
  members: {
    id: string;
    name: string;
    email: string;
    domain: string;
    role: string;
    avatar: string;
    techStack?: string[];
    joinDate?: string;
    endDate?: string;
    attendanceRate?: number;
    streakDays?: number;
    points?: number;
    score?: number;
    college?: string;
  }[];
}

export interface ProjectBroadcast {
  id: string;
  projectId: string;
  authorName: string;
  authorRole: "Boss" | "Management" | "HR" | "Manager" | "Project Manager" | "Team Leader";
  authorAvatar: string;
  title: string;
  content: string;
  gitLink?: string;
  meetingLink?: string;
  priority: "urgent" | "important" | "normal";
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  productIdea: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  seniorityTag?: SeniorityTag;
  requiredSkills: string[];
  domainsRequired: ("Frontend" | "Backend" | "AI/ML" | "UI UX" | "DevOps" | "Testing" | "Product" | "Full Stack")[];
  teamSize: number;
  filledSeats: number;
  remainingSeats: number;
  durationMonths: number;
  startDate: string;
  endDate: string;
  weeklyHours: number;
  status: "open" | "in_progress" | "completed";
  applicationDeadline: string;
  techStack: string[];
  mentor: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  managerName?: string;
  projectManagerName?: string;
  gitRepositoryUrl?: string;
  attendanceMeetingUrl?: string;
  teams?: ProjectTeam[];
  teamLeader?: {
    name: string;
    role: string;
    avatar: string;
  };
  estimatedProductValue: string;
  stipend: string;
  rewards: string[];
  matchPercentage?: number;
  category: "AI" | "AI Track" | "Web Development" | "Mobile" | "DevOps" | "Cyber Security" | "Blockchain" | "UI UX" | "ML" | "ML Systems" | "Data Science" | "Open Source";
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  userId?: string;
  applicantName: string;
  email: string;
  phone?: string;
  college?: string;
  degree?: string;
  gradYear?: string;
  resumeUrl: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  whyJoin?: string;
  experience?: string;
  availability?: string;
  deliverablesPlan?: string;
  pastDeployments?: string;
  domain: string;
  seniorityLevel?: SeniorityTag;
  status: "applied" | "under_review" | "interview_scheduled" | "selected" | "rejected";
  appliedAt: string;
  atsScore?: number;
  atsKeywordMatch?: number;
  atsFormattingScore?: number;
  dsaSolvedCount?: number;
  dsaTopicsMastered?: { topic: string; count: number }[];
  aiMockInterviewScore?: number;
  streakDays?: number;
  interviewDate?: string;
  interviewTime?: string;
  interviewLink?: string;
  meetUrl?: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedTLName?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee?: {
    name: string;
    avatar: string;
    role: string;
  };
  createdByRole: "Manager" | "Project Leader" | "Team Leader (TL)" | "Boss";
  createdByName: string;
  assignedToType: "unassigned" | "team" | "member";
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  assignedMemberAvatar?: string;
  assignedMemberRole?: string;
  status: "todo" | "in_progress" | "partially_done" | "completed" | "issue";
  priority: "low" | "medium" | "high";
  points: number;
  dueDate: string;
  internRemarks?: string;
  submittedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userRole: "TL" | "Intern";
  teamId?: string;
  teamName?: string;
  date: string;
  status: "present" | "leave" | "half_day" | "absent";
  requestReason?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  remark?: string;
  verifiedByTL: boolean;
}

export interface WeeklyEvaluation {
  id: string;
  projectId: string;
  userId: string;
  weekNumber: number;
  technicalScore: number; // /10
  codeQualityScore: number;
  communicationScore: number;
  consistencyScore: number;
  attendanceScore: number;
  overallScore: number;
  feedback: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  projectName: string;
  duration: string;
  issueDate: string;
  type: "Internship Certificate" | "Letter of Recommendation" | "Completion Certificate";
  verificationId: string;
  qrCodeUrl: string;
}

export interface RevenueShare {
  projectId: string;
  projectTitle: string;
  saleAmount: number; // e.g. $10,000 / ₹5,000,000
  tlShare: number; // 5%
  teamSharePerMember: number; // 5% split
  careerOSShare: number; // 90%
  status: "pending" | "approved" | "paid";
  payoutDate: string;
}

export interface ProjectAnnouncement {
  id: string;
  projectId: string;
  authorName: string;
  authorRole: "Project Leader" | "Project Manager" | "Team Leader (TL)" | "Technical Captain";
  authorAvatar: string;
  title: string;
  content: string;
  priority: "urgent" | "important" | "normal";
  createdAt: string;
}
