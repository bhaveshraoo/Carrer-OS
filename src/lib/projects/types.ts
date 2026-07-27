export interface Project {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  productIdea: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  requiredSkills: string[];
  domainsRequired: ("Frontend" | "Backend" | "AI/ML" | "UI UX" | "DevOps" | "Testing" | "Product")[];
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
  teamLeader?: {
    name: string;
    role: string;
    avatar: string;
  };
  estimatedProductValue: string;
  stipend: string;
  rewards: string[];
  matchPercentage?: number;
  category: "AI" | "Web Development" | "Mobile" | "DevOps" | "Cyber Security" | "Blockchain" | "UI UX" | "ML" | "Data Science" | "Open Source";
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  userId: string;
  applicantName: string;
  email: string;
  resumeUrl: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  whyJoin: string;
  experience: string;
  availability: string;
  domain: string;
  status: "applied" | "under_review" | "interview_scheduled" | "selected" | "rejected";
  appliedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  points: number;
  dueDate: string;
}

export interface AttendanceRecord {
  id: string;
  projectId: string;
  userId: string;
  date: string;
  status: "present" | "leave" | "half_day" | "absent";
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
