import { Project, Task, AttendanceRecord, WeeklyEvaluation, Badge, Certificate, RevenueShare } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "AI Voice-Powered Career Assistant",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    description: "Build an ultra-fast real-time speech-to-speech AI agent that conducts mock interviews and provides instant audio feedback for SDE candidates.",
    productIdea: "Enterprise B2B AI Voice Screener SaaS valued at $250,000.",
    difficulty: "Advanced",
    requiredSkills: ["React", "Next.js", "Python", "WebSockets", "LLMs", "Tailwind CSS"],
    domainsRequired: ["Frontend", "Backend", "AI/ML", "UI UX"],
    teamSize: 6,
    filledSeats: 4,
    remainingSeats: 2,
    durationMonths: 3,
    startDate: "2026-08-01",
    endDate: "2026-11-01",
    weeklyHours: 15,
    status: "open",
    applicationDeadline: "2026-07-31",
    techStack: ["Next.js 16", "FastAPI", "OpenAI Realtime API", "Pinecone", "TailwindCSS"],
    mentor: {
      name: "Dr. Vikram Sharma",
      role: "Ex-Google AI Lead",
      company: "Google / CareerOS Fellow",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    teamLeader: {
      name: "Aarav Gupta",
      role: "Full-Stack Tech Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    estimatedProductValue: "₹25,000,000",
    stipend: "₹15,000 / month + 5% Revenue Share",
    rewards: [
      "Official 3-Month Internship Certificate",
      "Letter of Recommendation (LOR)",
      "CareerOS Pro 1-Year Subscription",
      "Exclusive Swag Kit (Hoodie & Backpack)",
      "5% Revenue Share Payout on SaaS Sale"
    ],
    matchPercentage: 94,
    category: "AI",
  },
  {
    id: "proj-2",
    title: "Distributed High-Frequency Trading Engine",
    coverImage: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80",
    description: "Design a sub-millisecond order matching engine using C++20 and Rust for algorithmic crypto trading and orderbook visualization.",
    productIdea: "Institutional High-Frequency Liquidity Protocol.",
    difficulty: "Expert",
    requiredSkills: ["C++", "Rust", "System Design", "WebSockets", "Data Structures"],
    domainsRequired: ["Backend", "DevOps", "Testing"],
    teamSize: 5,
    filledSeats: 3,
    remainingSeats: 2,
    durationMonths: 4,
    startDate: "2026-08-05",
    endDate: "2026-12-05",
    weeklyHours: 20,
    status: "open",
    applicationDeadline: "2026-08-03",
    techStack: ["C++20", "Rust", "gRPC", "Docker", "TimescaleDB"],
    mentor: {
      name: "Rohan Varma",
      role: "Quant Systems Architect",
      company: "Tower Research / AlphaQuant",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    teamLeader: {
      name: "Sneha Patel",
      role: "Systems TL",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    estimatedProductValue: "₹40,000,000",
    stipend: "₹20,000 / month + 5% Revenue Share",
    rewards: [
      "Quant Systems Internship Certificate",
      "Direct Interview Referral to Quant Firms",
      "CareerOS Pro 1-Year Access",
      "5% Revenue Share Payout"
    ],
    matchPercentage: 88,
    category: "Web Development",
  },
  {
    id: "proj-3",
    title: "Autonomous Code Refactoring Agent",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    description: "Build an automated GitHub Action agent that parses Pull Requests, analyzes ASTs, fixes TypeScript errors, and optimizes SQL queries.",
    productIdea: "Developer Productivity SaaS Plugin for GitHub & GitLab.",
    difficulty: "Intermediate",
    requiredSkills: ["TypeScript", "Node.js", "AST Parsing", "GitHub API", "React"],
    domainsRequired: ["Frontend", "Backend", "AI/ML", "Product"],
    teamSize: 4,
    filledSeats: 2,
    remainingSeats: 2,
    durationMonths: 2,
    startDate: "2026-08-10",
    endDate: "2026-10-10",
    weeklyHours: 12,
    status: "open",
    applicationDeadline: "2026-08-08",
    techStack: ["TypeScript", "Babel AST", "Octokit", "Next.js"],
    mentor: {
      name: "Priya Nair",
      role: "Staff Engineer",
      company: "Atlassian",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    estimatedProductValue: "₹15,000,000",
    stipend: "₹12,000 / month + 5% Revenue Share",
    rewards: [
      "Open Source Core Internship Certificate",
      "Letter of Recommendation",
      "Goodie Bag & Custom Keyboard",
      "5% Equal Team Revenue Sharing"
    ],
    matchPercentage: 91,
    category: "Open Source",
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    projectId: "proj-1",
    title: "Implement Realtime Audio Streaming via WebSockets",
    description: "Connect browser MediaRecorder API to OpenAI Realtime API via bi-directional WebSocket connection.",
    assignee: {
      name: "Bhavesh Rao",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: "Frontend Engineer",
    },
    status: "in_progress",
    priority: "high",
    points: 8,
    dueDate: "2026-08-05",
  },
  {
    id: "task-2",
    projectId: "proj-1",
    title: "Design Linear-style Audio Waveform Stepper UI",
    description: "Create smooth 60fps canvas audio spectrum analyzer component with custom theme tokens.",
    assignee: {
      name: "Sneha Patel",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      role: "UI/UX Designer",
    },
    status: "done",
    priority: "medium",
    points: 5,
    dueDate: "2026-08-02",
  },
  {
    id: "task-3",
    projectId: "proj-1",
    title: "Build Pinecone Vector Search for Interview Question Bank",
    description: "Index 500+ DSA and System Design prompts into 1536-dim embedding vectors.",
    assignee: {
      name: "Aarav Gupta",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "AI Engineer",
    },
    status: "todo",
    priority: "high",
    points: 10,
    dueDate: "2026-08-08",
  },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: "att-1", projectId: "proj-1", userId: "u-1", date: "2026-07-27", status: "present", verifiedByTL: true },
  { id: "att-2", projectId: "proj-1", userId: "u-1", date: "2026-07-26", status: "present", verifiedByTL: true },
  { id: "att-3", projectId: "proj-1", userId: "u-1", date: "2026-07-25", status: "present", verifiedByTL: true },
  { id: "att-4", projectId: "proj-1", userId: "u-1", date: "2026-07-24", status: "half_day", verifiedByTL: true },
  { id: "att-5", projectId: "proj-1", userId: "u-1", date: "2026-07-23", status: "present", verifiedByTL: true },
];

export const MOCK_REVENUE_SHARES: RevenueShare[] = [
  {
    projectId: "proj-1",
    projectTitle: "AI Voice-Powered Career Assistant",
    saleAmount: 2500000, // ₹2,500,000
    tlShare: 125000, // 5% = ₹125,000
    teamSharePerMember: 25000, // 5% total split across 5 members = ₹25,000 each
    careerOSShare: 2250000, // 90% = ₹2,250,000
    status: "approved",
    payoutDate: "2026-08-15",
  },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Aarav Gupta", college: "IIT Delhi", score: 98, badge: "⚡ Full Stack Hero", projects: 4, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { rank: 2, name: "Sneha Patel", college: "BITS Pilani", score: 95, badge: "🏆 Top Performer", projects: 3, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { rank: 3, name: "Bhavesh Rao", college: "VIT Vellore", score: 94, badge: "🔥 Consistency King", projects: 3, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
  { rank: 4, name: "Ananya Roy", college: "IIIT Hyderabad", score: 91, badge: "🚀 Fast Learner", projects: 2, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
];
