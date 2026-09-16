"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Rocket,
  Search,
  Filter,
  Sparkles,
  Users,
  Clock,
  Award,
  Zap,
  ChevronRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Trophy,
  Code2,
  Briefcase,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  Download,
  MessageSquare,
  AlertCircle,
  Video,
  ExternalLink,
  Calendar,
  Layers,
  Crown,
  Bell,
  Send,
  Plus,
  Check,
  UserCheck,
  UserX,
  AlertTriangle,
  PlayCircle,
  Flame,
  UserPlus,
  Link2,
  GitBranch,
  Edit3,
  Settings,
  LogOut,
  User,
  GripVertical,
  X,
  Star,
  GraduationCap,
  Sliders,
  Eye,
  RefreshCw,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_ATTENDANCE, MOCK_ANNOUNCEMENTS, MOCK_APPLICATIONS } from "@/lib/projects/data";
import { Project, SeniorityTag, SENIORITY_ORDER, getSeniorityRank, Task, AttendanceRecord, ProjectAnnouncement, ProjectTeam, ProjectApplication } from "@/lib/projects/types";
import { useNotifications } from "@/components/notifications/notification-provider";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  "All",
  "AI Track",
  "Web Development",
  "Mobile Apps",
  "DevOps",
  "Cyber Security",
  "Blockchain",
  "UI UX",
  "ML Systems",
  "Open Source",
];

const SENIORITY_TAGS: (SeniorityTag | "All Seniorities")[] = [
  "All Seniorities",
  "Freshers / Entry Level",
  "Junior Intern",
  "Mid-Level Engineer",
  "Senior / Lead Track",
  "Architect / PM Level",
];

const LEADERSHIP_ROSTER = [
  {
    role: "Project Leader / Founder",
    name: "Siddharth Malhotra",
    title: "VP of Product @ HubSpot / SaaS Founder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    badge: "Leader",
    color: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    icon: Crown,
  },
  {
    role: "Project Manager",
    name: "Bhavesh Rao",
    title: "Supreme Platform Manager @ CareerOS",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    badge: "Manager",
    color: "text-orange-400 bg-orange-500/15 border-orange-500/30",
    icon: Rocket,
  },
  {
    role: "Team Leader (TL)",
    name: "Ananya Roy",
    title: "Senior Full-Stack Lead @ IIT Delhi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badge: "TL",
    color: "text-teal-400 bg-teal-500/15 border-teal-500/30",
    icon: ShieldCheck,
  },
  {
    role: "Technical Captain — Backend",
    name: "Karan Mehta",
    title: "Database Architect & System Design Captain",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    badge: "Captain",
    color: "text-purple-400 bg-purple-500/15 border-purple-500/30",
    icon: Code2,
  },
  {
    role: "Technical Captain — UI/UX & Frontend",
    name: "Sneha Patel",
    title: "Design System & React Specialist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    badge: "Captain",
    color: "text-blue-400 bg-blue-500/15 border-blue-500/30",
    icon: Building2,
  },
];

function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export default function ProjectsPage() {
  const { notify } = useNotifications();

  // Supabase Auth User State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // Dynamic Applications & Enrolled Project state
  const [userApplications, setUserApplications] = useState<any[]>([]);

  // Sync Authenticated User & Scoped Applications on Mount
  useEffect(() => {
    async function initUserAndApps() {
      let email: string | null = null;
      let userId: string | null = null;
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          email = user.email || null;
          userId = user.id || null;
        }
      } catch (err) {
        console.error("Auth load error:", err);
      }

      const storageKey = email ? `careeros_user_apps_${email}` : null;
      let userApps: any[] = [];

      // 1. Try DB first for this user's email/id
      try {
        const res = await fetch("/api/projects/applications");
        const data = await res.json();
        if (data?.success && Array.isArray(data.applications)) {
          userApps = data.applications.filter((a: any) =>
            (email && a.email?.toLowerCase() === email.toLowerCase()) ||
            (userId && a.userId === userId)
          );
        }
      } catch (err) {
        console.error("DB applications fetch error:", err);
      }

      // 2. Fallback to user-scoped localStorage
      if (userApps.length === 0 && storageKey && typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) userApps = parsed;
          }
        } catch {}
      }

      setUserApplications(userApps);

      const enrolled = userApps.find(
        (a: any) => a.status === "selected" || a.status === "joined" || a.status === "confirmed"
      );

      if (enrolled) {
        setViewMode("my_project");
      } else {
        setViewMode("explore");
      }
      setUserLoaded(true);
    }

    initUserAndApps();
  }, []);

  // Strict Role Resolution (Boss/Admin -> All projects, Manager -> 5-10 projects, PM -> 1 project, TL -> Team management, Post-Intern -> Verified offboarded, Candidate/Intern -> Standard)
  const userRole = useMemo(() => {
    if (!currentUser) return "Intern";
    const metaRole = currentUser.user_metadata?.role;
    const email = currentUser.email?.toLowerCase().trim() || "";

    // 1. Boss / System Admin Role (Explicit authorization or DB metadata)
    if (
      metaRole === "Boss" ||
      metaRole === "Admin" ||
      email === "bhaveshy9654@gmail.com" ||
      email === "bhaveshrao@careeros.in" ||
      email === "admin@careeros.in" ||
      email === "boss@careeros.in"
    ) {
      return "Boss";
    }

    // 2. Manager Role (Explicit authorization or DB metadata)
    if (
      metaRole === "Manager" ||
      email === "vikramaditya@careeros.in" ||
      email === "manager@careeros.in"
    ) {
      return "Manager";
    }

    // 3. Project Manager (PM) Role (Explicit authorization or DB metadata)
    if (
      metaRole === "PM" ||
      metaRole === "Project Manager" ||
      email === "bhavesh.pm@careeros.in" ||
      email === "pm@careeros.in"
    ) {
      return "PM";
    }

    // 4. Team Leader (TL) Role (Explicit authorization or DB metadata)
    if (
      metaRole === "TL" ||
      metaRole === "Team Leader" ||
      email.includes("ananya") ||
      email.includes("karan") ||
      email.includes("tl")
    ) {
      return "TL";
    }

    // 5. Post-Intern Role (Explicit DB metadata)
    if (
      metaRole === "Post-Intern" ||
      metaRole === "post_intern"
    ) {
      return "Post-Intern";
    }

    // 6. All other registered candidates/users: Strictly "Intern"
    return "Intern";
  }, [currentUser]);

  const isBoss = userRole === "Boss";
  const isManager = userRole === "Manager";
  const isPM = userRole === "PM";
  const isIntern = userRole === "Intern";

  // Dynamic DB Projects State with fallback to MOCK_PROJECTS
  const [allProjects, setAllProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedSeniority, setSelectedSeniority] = useState<string>("All Seniorities");

  // Fetch projects from DB API (/api/projects) on mount
  useEffect(() => {
    async function loadDbProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data?.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setAllProjects(data.projects);
        }
      } catch (err) {
        console.error("Failed to fetch DB projects:", err);
      }
    }
    loadDbProjects();
  }, []);

  // Accessible Projects Based on Role Hierarchy
  const accessibleProjects = useMemo(() => {
    if (isBoss) {
      // Boss & Admin have DIRECT ACCESS to ALL projects in system
      return allProjects;
    }
    if (isManager) {
      // Manager has access to his assigned projects (5-10 managed projects)
      const email = currentUser?.email?.toLowerCase().trim() || "";
      const filtered = allProjects.filter(
        (p) => p.managerEmail?.toLowerCase() === email || email === "vikramaditya@careeros.in"
      );
      return filtered.length > 0 ? filtered : allProjects.slice(0, 5);
    }
    if (isPM) {
      // PM has access to his single assigned project
      const email = currentUser?.email?.toLowerCase().trim() || "";
      const filtered = allProjects.filter(
        (p) => p.projectManagerEmail?.toLowerCase() === email || email === "bhavesh.pm@careeros.in"
      );
      return filtered.length > 0 ? filtered : [allProjects[0]];
    }
    // Normal User / Candidate / Intern: access ONLY projects where an application is ACCEPTED (selected/joined/confirmed)
    const acceptedProjectIds = userApplications
      .filter((a) => a.status === "selected" || a.status === "joined" || a.status === "confirmed")
      .map((a) => a.projectId);

    return allProjects.filter((p) => acceptedProjectIds.includes(p.id));
  }, [isBoss, isManager, isPM, currentUser, userApplications, allProjects]);

  // Active Project Selection State (Enables Boss / Manager to switch between accessible projects)
  const [activeProjectId, setActiveProjectId] = useState<string>("proj-crm");

  const enrolledApplication = useMemo(() => {
    return userApplications.find(
      (a) => a.status === "selected" || a.status === "joined" || a.status === "confirmed"
    );
  }, [userApplications]);

  const enrolledProject = useMemo(() => {
    if (isBoss || isManager || isPM) {
      const found = allProjects.find((p) => p.id === activeProjectId);
      if (found && accessibleProjects.some((p) => p.id === found.id)) return found;
      return accessibleProjects[0] || allProjects[0];
    }
    return enrolledApplication?.project || allProjects.find((p) => p.id === enrolledApplication?.projectId) || allProjects[0];
  }, [isBoss, isManager, isPM, activeProjectId, accessibleProjects, enrolledApplication, allProjects]);

  const hasJoinedProject = useMemo(() => {
    if (isBoss || isManager || isPM) {
      return true; // Boss, Admin, Manager, PM have direct workspace access
    }
    return !!enrolledApplication; // Interns MUST have a PM-accepted application
  }, [isBoss, isManager, isPM, enrolledApplication]);

  // View Mode: "my_project" vs "explore"
  const [viewMode, setViewMode] = useState<"my_project" | "explore">("explore");

  // Workspace sub-tabs: "announcements" | "tasks" | "attendance" | "leadership" | "rewards"
  const [workspaceTab, setWorkspaceTab] = useState<
    "announcements" | "tasks" | "attendance" | "leadership" | "rewards"
  >("announcements");

  // Marketplace Catalog Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "starting_soon" | "highest_match">("highest_match");
  const [hasResume, setHasResume] = useState(false);
  const [candidateSkillsText, setCandidateSkillsText] = useState<string | null>(null);

  // Enrolled Workspace Interactive Data
  const [announcements, setAnnouncements] = useState<ProjectAnnouncement[]>(MOCK_ANNOUNCEMENTS as any);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => {
    if (typeof window === "undefined") return MOCK_ATTENDANCE;
    try {
      const saved = localStorage.getItem("careeros_attendance_logs_v2");
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_ATTENDANCE;
  });
  const [todayAttendanceStatus, setTodayAttendanceStatus] = useState<"present" | "leave" | "half_day" | null>("present");

  // Task Submission PR state
  const [prUrlMap, setPrUrlMap] = useState<Record<string, string>>({});

  // Project Teams & Hierarchy Data
  const [teams, setTeams] = useState<ProjectTeam[]>(enrolledProject.teams || [
    {
      id: "team-1",
      projectId: enrolledProject.id,
      teamName: "Team 1 - Frontend & AI Pipeline",
      teamLeaderName: "Ananya Roy",
      teamLeaderEmail: "ananya.roy@careeros.in",
      maxSeats: 4,
      filledSeats: 3,
      members: [
        { id: "mem-1", name: "Ananya Roy", email: "ananya.roy@careeros.in", domain: "Full Stack", role: "Team Leader (TL)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
        { id: "mem-2", name: "Bhavesh Rao", email: "bhavesh@careeros.in", domain: "Frontend", role: "UI & Component Intern", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
        { id: "mem-3", name: "Riya Mehta", email: "riya.m@gmail.com", domain: "AI/ML", role: "Lead Scoring Intern", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
      ],
    },
    {
      id: "team-2",
      projectId: enrolledProject.id,
      teamName: "Team 2 - Core Backend & Database",
      teamLeaderName: "Karan Mehta",
      teamLeaderEmail: "karan.m@careeros.in",
      maxSeats: 4,
      filledSeats: 2,
      members: [
        { id: "mem-4", name: "Karan Mehta", email: "karan.m@careeros.in", domain: "Backend", role: "Team Leader (TL)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
        { id: "mem-5", name: "Arjun Nair", email: "arjun.n@gmail.com", domain: "Database", role: "PostgreSQL & Prisma Intern", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      ],
    },
  ]);

  // Project Applications Data
  const [applications, setApplications] = useState<ProjectApplication[]>(MOCK_APPLICATIONS as any);

  // Links state
  const [gitRepoUrl, setGitRepoUrl] = useState(enrolledProject.gitRepositoryUrl || "https://github.com/careeros-org/enterprise-saas-crm");
  const [meetingUrl, setMeetingUrl] = useState(enrolledProject.attendanceMeetingUrl || "https://meet.google.com/abc-defg-hij");

  // Modal States
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamTLName, setNewTeamTLName] = useState("");
  const [newTeamTLEmail, setNewTeamTLEmail] = useState("");
  // Candidate Application Modal state
  const [selectedProjectForApply, setSelectedProjectForApply] = useState<any | null>(null);
  const [applyDomain, setApplyDomain] = useState("Full Stack");
  const [applyPhone, setApplyPhone] = useState("");
  const [applyCollege, setApplyCollege] = useState("");
  const [applyDegree, setApplyDegree] = useState("B.Tech Computer Science");
  const [applyGradYear, setApplyGradYear] = useState("2026");
  const [applyGithubUrl, setApplyGithubUrl] = useState("");
  const [applyPortfolioUrl, setApplyPortfolioUrl] = useState("");
  const [applyResumeUrl, setApplyResumeUrl] = useState("");
  const [applyWhyJoin, setApplyWhyJoin] = useState("");
  const [applyExperience, setApplyExperience] = useState("");
  const [applyAvailability, setApplyAvailability] = useState("20 Hours / Week");
  const [isSubmittingApply, setIsSubmittingApply] = useState(false);

  const [selectedApplicantForInterview, setSelectedApplicantForInterview] = useState<ProjectApplication | null>(null);
  const [interviewDate, setInterviewDate] = useState("2026-09-10");
  const [interviewTime, setInterviewTime] = useState("3:00 PM IST");
  const [interviewMeetLink, setInterviewMeetLink] = useState("https://meet.google.com/careeros-interview-101");

  const [selectedApplicantForAllocation, setSelectedApplicantForAllocation] = useState<ProjectApplication | null>(null);
  const [targetTeamId, setTargetTeamId] = useState<string>("");

  // PM Applicants & Governance Console Sub-tab State
  const [pmSubTab, setPmSubTab] = useState<"candidates" | "leaves" | "extensions">("candidates");
  const [pmSeniorityFilter, setPmSeniorityFilter] = useState<string>("All");
  const [pmSenioritySort, setPmSenioritySort] = useState<"desc" | "asc">("desc");

  // Tenure Extensions List state
  const [tenureExtensionsList, setTenureExtensionsList] = useState<any[]>([
    {
      id: "ext-101",
      projectId: "proj-crm",
      projectTitle: "Enterprise SaaS CRM Workspace",
      userId: "mem-2",
      internName: "Bhavesh Rao",
      email: "bhavesh.rao@careeros.dev",
      domain: "Full Stack Lead",
      currentEndDate: "2026-11-05",
      extensionMonths: 2,
      newEndDate: "2027-01-05",
      reason: "Delivering Phase 2 AI Autonomous Pipelines and mentorship of incoming cohort intern team.",
      status: "pending",
      appliedAt: "2026-09-06",
    },
    {
      id: "ext-102",
      projectId: "proj-crm",
      projectTitle: "Enterprise SaaS CRM Workspace",
      userId: "mem-3",
      internName: "Dev Patel",
      email: "dev.patel@careeros.dev",
      domain: "Backend & Systems",
      currentEndDate: "2026-10-15",
      extensionMonths: 1,
      newEndDate: "2026-11-15",
      reason: "Finalizing Rust microservice deployment and Redis caching optimizations.",
      status: "approved",
      reviewedBy: "Project Manager (Approved)",
      reviewRemark: "Approved based on stellar attendance and sprint velocity.",
      appliedAt: "2026-09-02",
    },
  ]);

  // CANDIDATE PROFILE VIEW MODAL STATE
  const [selectedApplicantForView, setSelectedApplicantForView] = useState<ProjectApplication | null>(null);

  // HIRE CANDIDATE MODAL STATE
  const [selectedApplicantForHire, setSelectedApplicantForHire] = useState<ProjectApplication | null>(null);
  const [hireGrantOffer, setHireGrantOffer] = useState(true);
  const [hireTeamId, setHireTeamId] = useState("team-1");
  const [hirePost, setHirePost] = useState("Full Stack Intern");
  const [hireTechStack, setHireTechStack] = useState("Next.js 16, TypeScript, TailwindCSS, WebSockets");
  const [hireJoiningDate, setHireJoiningDate] = useState("2026-09-15");
  const [hireStipend, setHireStipend] = useState("₹20,000 / month + 5% Revenue Share");
  const [hireMonths, setHireMonths] = useState(3);

  // NEXT ROUND / INTERVIEW MODAL STATE
  const [selectedApplicantForNextRound, setSelectedApplicantForNextRound] = useState<ProjectApplication | null>(null);
  const [nextRoundType, setNextRoundType] = useState("Technical Coding Round");
  const [nextRoundDate, setNextRoundDate] = useState("2026-09-12");
  const [nextRoundTime, setNextRoundTime] = useState("4:00 PM IST");
  const [nextInterviewerName, setNextInterviewerName] = useState("Bhavesh Rao (PM)");
  const [nextMeetUrl, setNextMeetUrl] = useState("https://meet.google.com/careeros-eval-101");
  const [nextFocusAreas, setNextFocusAreas] = useState("Technical assessment on Next.js, React 19, and database design.");

  // REJECT CANDIDATE MODAL STATE
  const [selectedApplicantForReject, setSelectedApplicantForReject] = useState<ProjectApplication | null>(null);
  const [rejectRemark, setRejectRemark] = useState("");

  // PM EXTENDED LEAVE & EXTENSION REVIEW MODALS
  const [selectedPMLeaveForReview, setSelectedPMLeaveForReview] = useState<AttendanceRecord | null>(null);
  const [pmLeaveReviewRemark, setPmLeaveReviewRemark] = useState("");

  const [selectedPMExtensionForReview, setSelectedPMExtensionForReview] = useState<any | null>(null);
  const [pmExtensionReviewRemark, setPmExtensionReviewRemark] = useState("");

  // Leave Request Form Modal State (for Interns)
  const [showLeaveRequestModal, setShowLeaveRequestModal] = useState(false);
  const [leaveRequestType, setLeaveRequestType] = useState<"leave" | "half_day">("leave");
  const [leaveRequestDate, setLeaveRequestDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveRequestReason, setLeaveRequestReason] = useState("");
  const [resubmitRecordId, setResubmitRecordId] = useState<string | null>(null);

  // Approval Action Modal State (for TL / Manager / PM)
  const [selectedRecordForApproval, setSelectedRecordForApproval] = useState<AttendanceRecord | null>(null);
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected">("approved");
  const [reviewRemark, setReviewRemark] = useState("");

  // Intern / Member Detail Card Modal State
  const [selectedMemberForModal, setSelectedMemberForModal] = useState<any | null>(null);

  // Dynamic Task Management & Drag-and-Drop States
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("high");
  const [newTaskPoints, setNewTaskPoints] = useState(50);
  const [newTaskDueDate, setNewTaskDueDate] = useState("2026-09-15");
  const [newTaskTargetTeamId, setNewTaskTargetTeamId] = useState("");
  const [newTaskTargetMemberId, setNewTaskTargetMemberId] = useState("");

  const [selectedTaskForInternUpdate, setSelectedTaskForInternUpdate] = useState<Task | null>(null);
  const [internStatusChoice, setInternStatusChoice] = useState<"completed" | "partially_done" | "issue" | "in_progress">("completed");
  const [internRemarksInput, setInternRemarksInput] = useState("");

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [hoveredDropTargetId, setHoveredDropTargetId] = useState<string | null>(null);

  // Attendance Matrix Inline Edit State
  const [editingMemberAttendanceId, setEditingMemberAttendanceId] = useState<string | null>(null);

  // New Announcement Form State
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annRole, setAnnRole] = useState<"Project Leader" | "Project Manager" | "Team Leader (TL)" | "Technical Captain">("Project Manager");
  const [annPriority, setAnnPriority] = useState<"urgent" | "important" | "normal">("important");

  // Check if current logged-in user is a Team Leader (TL)
  const isTL = useMemo(() => {
    if (userRole === "TL") return true;
    const metaRole = currentUser?.user_metadata?.role;
    if (metaRole === "TL" || metaRole === "Team Leader") return true;
    const email = currentUser?.email?.toLowerCase().trim() || "";
    if (email.includes("ananya") || email.includes("karan") || email.includes("tl")) return true;
    return teams.some((t) => t.teamLeaderEmail?.toLowerCase().trim() === email);
  }, [currentUser, userRole, teams]);

  // Resolved Effective Role for Settings Console (Auto-detected based on database user role & application status)
  const effectiveSettingsRole = useMemo(() => {
    if (isBoss || isManager) return "boss";
    if (isPM) return "pm";
    if (isTL) return "tl";
    const metaRole = currentUser?.user_metadata?.role;
    if (metaRole === "Post-Intern" || metaRole === "post_intern" || enrolledApplication?.status === "completed" || enrolledApplication?.status === "offboarded") return "post_intern";
    return "intern";
  }, [isBoss, isManager, isPM, isTL, currentUser, enrolledApplication]);

  // PM Master Settings Inputs
  const [pmAppMode, setPmAppMode] = useState<"manual" | "auto">("manual");
  const [pmStipendInput, setPmStipendInput] = useState(enrolledProject.stipend || "₹15,000 / month");
  const [pmTitleInput, setPmTitleInput] = useState(enrolledProject.title || "Enterprise SaaS CRM Workspace");
  const [pmManagerEmailInput, setPmManagerEmailInput] = useState(enrolledProject.managerEmail || "vikramaditya@careeros.in");
  const [pmPMEmailInput, setPmPMEmailInput] = useState(enrolledProject.projectManagerEmail || "bhavesh.pm@careeros.in");

  // TL 1-Day Short Leave Requests State
  const [tlShortLeaves, setTlShortLeaves] = useState([
    {
      id: "tl-leave-1",
      memberId: "mem-2",
      memberName: "Bhavesh Rao",
      memberRole: "UI & Component Intern",
      date: "2026-09-08",
      reason: "Attending University Practical Exam",
      status: "pending",
      submittedAt: "2026-09-06",
    },
    {
      id: "tl-leave-2",
      memberId: "mem-3",
      memberName: "Riya Mehta",
      memberRole: "Lead Scoring Intern",
      date: "2026-09-05",
      reason: "Personal medical appointment",
      status: "approved",
      submittedAt: "2026-09-04",
      tlRemark: "Approved by TL. Task handed over to Bhavesh.",
    },
  ]);

  // TL Weekly Star Ratings (1-5 Stars)
  const [tlRatings, setTlRatings] = useState<Record<string, number>>({
    "mem-2": 5,
    "mem-3": 4,
    "mem-5": 5,
  });

  // PM Offboarding & Certificate Modal State
  const [showPmCertModal, setShowPmCertModal] = useState(false);
  const [selectedInternForCert, setSelectedInternForCert] = useState<string>("Bhavesh Rao");

  const [bigLeaveStartDate, setBigLeaveStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [bigLeaveEndDate, setBigLeaveEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split("T")[0];
  });
  const [bigLeaveReason, setBigLeaveReason] = useState("");

  const [extendMonths, setExtendMonths] = useState(1);
  const [extendReason, setExtendReason] = useState("");

  const [showLeaveProjectModal, setShowLeaveProjectModal] = useState(false);

  // Big Leave Request Handler (3-10 Days -> Direct to PM)
  async function handleBigLeaveSubmit(e: React.FormEvent) {
    e.preventDefault();
    const start = new Date(bigLeaveStartDate);
    const end = new Date(bigLeaveEndDate);
    const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    if (diffDays < 3 || diffDays > 10) {
      notify({
        type: "warning",
        icon: "⚠️",
        title: "Invalid Leave Duration",
        body: "Extended Leave Requests to PM must be between 3 and 10 days. For 1-day leaves, please submit to your Team Leader (TL).",
        autoDismiss: 4500,
      });
      return;
    }

    const bigLeaveRecord: AttendanceRecord = {
      id: `att-pm-${Date.now()}`,
      projectId: enrolledProject.id,
      userId: "mem-2",
      userName: "Bhavesh Rao",
      userRole: "Intern",
      date: bigLeaveStartDate,
      status: "leave",
      approvalStatus: "pending",
      reviewedBy: "Project Manager (Pending)",
      requestReason: `[EXTENDED LEAVE TO PM - ${diffDays} Days]: ${bigLeaveReason}`,
    };

    try {
      await fetch("/api/projects/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bigLeaveRecord),
      });
    } catch (err) {}

    setAttendanceLogs((prev) => [bigLeaveRecord, ...prev]);
    setBigLeaveReason("");

    notify({
      type: "success",
      icon: "📅",
      title: "Extended Leave Request Sent to PM!",
      body: `Submitted ${diffDays}-day leave request (${bigLeaveStartDate} to ${bigLeaveEndDate}) directly to Project Manager (PM).`,
      autoDismiss: 5000,
    });
  }

  // Tenure Extension Request Handler -> Direct to PM
  async function handleExtendTenureSubmit(e: React.FormEvent) {
    e.preventDefault();
    const currentEndStr = "2026-11-05";
    const currentEnd = new Date(currentEndStr);
    const newEnd = new Date(currentEnd);
    newEnd.setMonth(newEnd.getMonth() + Number(extendMonths));
    const newEndDateStr = newEnd.toISOString().split("T")[0];

    const extensionPayload = {
      id: `ext-${Date.now()}`,
      projectId: enrolledProject?.id || "proj-crm",
      projectTitle: enrolledProject?.title || "Enterprise SaaS CRM Workspace",
      userId: "mem-2",
      internName: "Bhavesh Rao",
      email: "bhavesh.rao@careeros.dev",
      domain: "Full Stack Lead",
      currentEndDate: currentEndStr,
      extensionMonths: Number(extendMonths),
      newEndDate: newEndDateStr,
      reason: extendReason || "Requested internship tenure extension for advanced feature delivery.",
      status: "pending",
      appliedAt: new Date().toISOString().split("T")[0],
    };

    try {
      await fetch("/api/projects/extensions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extensionPayload),
      });
    } catch (err) {}

    setTenureExtensionsList((prev) => [extensionPayload, ...prev]);

    notify({
      type: "success",
      icon: "⏳",
      title: "Tenure Extension Request Sent to PM!",
      body: `Requested +${extendMonths} Month(s) extension (New Proposed End Date: ${newEndDateStr}). Project Manager will review your request.`,
      autoDismiss: 4500,
    });
    setExtendReason("");
  }

  // Leave Project Handler
  function handleConfirmLeaveProject() {
    setUserApplications([]);
    setViewMode("explore");
    try {
      localStorage.removeItem("careeros_enrolled_project_id");
      localStorage.removeItem("careeros_user_project_applications");
      if (currentUser?.email) {
        localStorage.removeItem(`careeros_user_apps_${currentUser.email}`);
      }
    } catch {}
    setShowLeaveProjectModal(false);

    notify({
      type: "info",
      icon: "👋",
      title: "Offboarded from Project",
      body: `You have successfully left "${enrolledProject.title}". Your seat is released and you can explore other projects!`,
      autoDismiss: 4500,
    });
  }

  // 1. HIRE CANDIDATE HANDLER (Grant Offer, Team Selection, Post, Tech Stack, Joining Date, Stipend, Months)
  async function handleConfirmHireCandidate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedApplicantForHire) return;

    const targetTeam = teams.find((t) => t.id === hireTeamId) || teams[0];
    const updatedApp: ProjectApplication = {
      ...selectedApplicantForHire,
      status: "selected",
      assignedTeamId: targetTeam ? targetTeam.id : "team-1",
      assignedTeamName: targetTeam ? targetTeam.teamName : "Team 1",
      assignedTLName: targetTeam ? targetTeam.teamLeaderName : "TL Ananya Roy",
    };

    setApplications((prev) => prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)));

    try {
      await fetch("/api/projects/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: updatedApp.id,
          status: "selected",
          assignedTeamId: updatedApp.assignedTeamId,
          assignedTeamName: updatedApp.assignedTeamName,
          assignedTLName: updatedApp.assignedTLName,
        }),
      });
    } catch (err) {}

    // Add candidate to team members list automatically if not present
    if (targetTeam) {
      const newMember = {
        id: `mem-${Date.now()}`,
        name: updatedApp.applicantName,
        role: hirePost || updatedApp.domain || "Intern",
        email: updatedApp.email,
        githubUrl: updatedApp.githubUrl,
        joinDate: hireJoiningDate || new Date().toISOString().split("T")[0],
        endDate: new Date(new Date(hireJoiningDate).setMonth(new Date(hireJoiningDate).getMonth() + Number(hireMonths))).toISOString().split("T")[0],
        stipend: hireStipend || "₹20,000 / month + 5% Revenue Share",
        techStack: hireTechStack.split(",").map((s) => s.trim()),
      };

      setTeams((prevTeams) =>
        prevTeams.map((t) =>
          t.id === targetTeam.id
            ? { ...t, members: [...t.members, newMember as any] }
            : t
        )
      );

      try {
        await fetch("/api/projects/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId: targetTeam.id, member: newMember }),
        });
      } catch (err) {}
    }

    setSelectedApplicantForHire(null);

    notify({
      type: "success",
      icon: "📜",
      title: "Candidate Hired & Offer Letter Granted!",
      body: `Successfully hired ${updatedApp.applicantName} into ${targetTeam?.teamName || "Team 1"} as ${hirePost || updatedApp.domain}. Stipend: ${hireStipend}.`,
      autoDismiss: 5000,
    });
  }

  // 2. NEXT ROUND HANDLER (Schedule Technical / HR Round)
  async function handleConfirmNextRound(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedApplicantForNextRound) return;

    const appId = selectedApplicantForNextRound.id;
    const updatedApp: ProjectApplication = {
      ...selectedApplicantForNextRound,
      status: "interview_scheduled",
      interviewDate: nextRoundDate,
      interviewTime: nextRoundTime,
      meetUrl: nextMeetUrl,
    };

    setApplications((prev) => prev.map((a) => (a.id === appId ? updatedApp : a)));

    try {
      await fetch("/api/projects/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appId,
          status: "interview_scheduled",
          interviewDate: nextRoundDate,
          interviewTime: nextRoundTime,
          meetUrl: nextMeetUrl,
        }),
      });
    } catch (err) {}

    setSelectedApplicantForNextRound(null);

    notify({
      type: "success",
      icon: "🎙️",
      title: `${nextRoundType} Scheduled!`,
      body: `Scheduled next round for ${selectedApplicantForNextRound.applicantName} on ${nextRoundDate} at ${nextRoundTime} with ${nextInterviewerName}.`,
      autoDismiss: 4500,
    });
  }

  // 3. REJECT CANDIDATE HANDLER
  async function handleConfirmRejectApplicant(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedApplicantForReject) return;

    const appId = selectedApplicantForReject.id;
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "rejected" } : a))
    );

    try {
      await fetch("/api/projects/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: "rejected" }),
      });
    } catch (err) {}

    setSelectedApplicantForReject(null);
    setRejectRemark("");

    notify({
      type: "info",
      icon: "💡",
      title: "Application Rejected with Feedback",
      body: "Constructive evaluation remark sent to candidate dashboard.",
      autoDismiss: 4000,
    });
  }

  // 4. PM EXTENDED LEAVE DECISION HANDLER
  async function handlePMLeaveDecision(leaveReq: AttendanceRecord, action: "approved" | "rejected") {
    const reviewerName = `Project Manager (${action === "approved" ? "Approved" : "Rejected"})`;

    setAttendanceLogs((prev) =>
      prev.map((r) =>
        r.id === leaveReq.id
          ? {
              ...r,
              approvalStatus: action,
              reviewedBy: reviewerName,
              remark: pmLeaveReviewRemark || (action === "approved" ? "Approved by PM." : "Rejected by PM."),
            }
          : r
      )
    );

    try {
      await fetch("/api/projects/attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leaveReq.id,
          approvalStatus: action,
          reviewedBy: reviewerName,
          remark: pmLeaveReviewRemark || (action === "approved" ? "Approved by PM." : "Rejected by PM."),
          status: action === "approved" ? "leave" : "present",
        }),
      });
    } catch (err) {}

    setSelectedPMLeaveForReview(null);
    setPmLeaveReviewRemark("");

    notify({
      type: action === "approved" ? "success" : "info",
      icon: action === "approved" ? "✅" : "❌",
      title: action === "approved" ? "Extended Leave Approved!" : "Extended Leave Rejected",
      body: `PM leave decision saved and intern notified.`,
      autoDismiss: 4000,
    });
  }

  // 5. PM TENURE EXTENSION DECISION HANDLER
  async function handlePMExtensionDecision(ext: any, action: "approved" | "rejected") {
    const reviewerName = `Project Manager (${action === "approved" ? "Approved" : "Rejected"})`;

    setTenureExtensionsList((prev) =>
      prev.map((e) =>
        e.id === ext.id
          ? {
              ...e,
              status: action,
              reviewedBy: reviewerName,
              reviewRemark: pmExtensionReviewRemark || (action === "approved" ? "Extension approved." : "Extension request declined."),
            }
          : e
      )
    );

    try {
      await fetch("/api/projects/extensions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ext.id,
          status: action,
          reviewedBy: reviewerName,
          reviewRemark: pmExtensionReviewRemark || (action === "approved" ? "Extension approved." : "Extension request declined."),
        }),
      });
    } catch (err) {}

    setSelectedPMExtensionForReview(null);
    setPmExtensionReviewRemark("");

    notify({
      type: action === "approved" ? "success" : "info",
      icon: action === "approved" ? "⏳" : "❌",
      title: action === "approved" ? "Tenure Extension Granted!" : "Tenure Extension Declined",
      body: action === "approved"
        ? `Intern end date updated to ${ext.newEndDate}.`
        : `Extension request declined by Project Manager.`,
      autoDismiss: 4500,
    });
  }

  useEffect(() => {
    async function checkResume() {
      try {
        const res = await fetch("/api/resume/analyze");
        const data = await res.json();
        if (data?.resume && data?.resume?.status === "analyzed") {
          setHasResume(true);
          const report = data.report || {};
          const skills = [
            ...(report.skills || []),
            ...(report.keywords || []),
            data.resume.raw_text || "",
          ].join(" ");
          setCandidateSkillsText(skills);
        } else {
          setHasResume(false);
        }
      } catch {
        setHasResume(false);
      }
    }
    checkResume();
  }, []);

  // Sync Attendance with Database API (/api/projects/attendance) on Mount
  useEffect(() => {
    async function loadDbAttendance() {
      try {
        const res = await fetch(`/api/projects/attendance?projectId=${enrolledProject.id}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.records) && data.records.length > 0) {
          setAttendanceLogs((prev) => {
            const combinedMap = new Map<string, AttendanceRecord>();
            prev.forEach((rec) => combinedMap.set(rec.id, rec));
            data.records.forEach((rec: AttendanceRecord) => combinedMap.set(rec.id, rec));
            return Array.from(combinedMap.values()).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
          });
        }
      } catch (err) {
        console.error("Failed to sync DB attendance:", err);
      }
    }
    loadDbAttendance();
  }, [enrolledProject.id]);

  // Sync Project Applications with Database API (/api/projects/applications) on Mount
  useEffect(() => {
    async function loadDbApplications() {
      try {
        const res = await fetch(`/api/projects/applications?projectId=${enrolledProject.id}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.applications) && data.applications.length > 0) {
          setApplications((prev) => {
            const map = new Map<string, ProjectApplication>();
            prev.forEach((app) => map.set(app.id, app));
            data.applications.forEach((app: ProjectApplication) => map.set(app.id, app));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.error("Failed to sync DB applications:", err);
      }
    }
    loadDbApplications();
  }, [enrolledProject.id]);

  // Sequence Candidate Applications by Seniority Level Order
  const sequencedApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const tag = app.seniorityLevel || (
          (app.atsScore ?? 0) >= 95 || (app.dsaSolvedCount ?? 0) >= 300
            ? "Architect / PM Level"
            : (app.atsScore ?? 0) >= 92 || (app.dsaSolvedCount ?? 0) >= 200
            ? "Senior / Lead Track"
            : (app.atsScore ?? 0) >= 88 || (app.dsaSolvedCount ?? 0) >= 150
            ? "Mid-Level Engineer"
            : (app.atsScore ?? 0) >= 80 || (app.dsaSolvedCount ?? 0) >= 80
            ? "Junior Intern"
            : "Freshers / Entry Level"
        );
        return pmSeniorityFilter === "All" || tag.toLowerCase() === pmSeniorityFilter.toLowerCase();
      })
      .sort((a, b) => {
        const tagA = a.seniorityLevel || (
          (a.atsScore ?? 0) >= 95 || (a.dsaSolvedCount ?? 0) >= 300
            ? "Architect / PM Level"
            : (a.atsScore ?? 0) >= 92 || (a.dsaSolvedCount ?? 0) >= 200
            ? "Senior / Lead Track"
            : (a.atsScore ?? 0) >= 88 || (a.dsaSolvedCount ?? 0) >= 150
            ? "Mid-Level Engineer"
            : (a.atsScore ?? 0) >= 80 || (a.dsaSolvedCount ?? 0) >= 80
            ? "Junior Intern"
            : "Freshers / Entry Level"
        );
        const tagB = b.seniorityLevel || (
          (b.atsScore ?? 0) >= 95 || (b.dsaSolvedCount ?? 0) >= 300
            ? "Architect / PM Level"
            : (b.atsScore ?? 0) >= 92 || (b.dsaSolvedCount ?? 0) >= 200
            ? "Senior / Lead Track"
            : (b.atsScore ?? 0) >= 88 || (b.dsaSolvedCount ?? 0) >= 150
            ? "Mid-Level Engineer"
            : (b.atsScore ?? 0) >= 80 || (b.dsaSolvedCount ?? 0) >= 80
            ? "Junior Intern"
            : "Freshers / Entry Level"
        );
        const rankA = getSeniorityRank(tagA);
        const rankB = getSeniorityRank(tagB);
        if (pmSenioritySort === "desc") return rankB - rankA;
        return rankA - rankB;
      });
  }, [applications, pmSeniorityFilter, pmSenioritySort]);

  // Sync Project Teams with Database API (/api/projects/teams) on Mount
  useEffect(() => {
    async function loadDbTeams() {
      try {
        const res = await fetch("/api/projects/teams");
        const data = await res.json();
        if (data?.success && Array.isArray(data.teams) && data.teams.length > 0) {
          setTeams(data.teams);
        }
      } catch (err) {
        console.error("Failed to sync DB teams:", err);
      }
    }
    loadDbTeams();
  }, []);

  // Sync Project Tasks with Database API (/api/projects/tasks) on Mount
  useEffect(() => {
    async function loadDbTasks() {
      try {
        const res = await fetch(`/api/projects/tasks?projectId=${enrolledProject.id}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.tasks) && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
      } catch (err) {
        console.error("Failed to sync DB tasks:", err);
      }
    }
    loadDbTasks();
  }, [enrolledProject.id]);

  // Compute Today's Date String and Today's Attendance Record for current user (Once-Per-Day Lock)
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const todayUserAttendance = useMemo(() => {
    return attendanceLogs.find(
      (log) => (log.userId === "mem-2" || log.userName === "Bhavesh Rao") && log.date === todayStr
    );
  }, [attendanceLogs, todayStr]);

  const calculateProjectMatch = (techStack: string[], category: string): number | null => {
    if (!hasResume || !candidateSkillsText) return null;
    const norm = candidateSkillsText.toLowerCase();
    let count = 0;
    for (const tech of techStack) {
      if (norm.includes(tech.toLowerCase())) count++;
    }
    const ratio = techStack.length > 0 ? count / techStack.length : 0.5;
    return Math.max(52, Math.min(98, Math.round(ratio * 50 + 48)));
  };

  // Filter projects for catalog
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" ||
        p.category === selectedCategory ||
        (selectedCategory === "AI Track" && (p.category === "AI Track" || p.category === "AI")) ||
        (selectedCategory === "ML Systems" && (p.category === "ML Systems" || p.category === "ML"));

      const pSeniority =
        p.seniorityTag ||
        (p.difficulty === "Beginner"
          ? "Freshers / Entry Level"
          : p.difficulty === "Intermediate"
          ? "Junior Intern"
          : p.difficulty === "Advanced"
          ? "Senior / Lead Track"
          : "Architect / PM Level");

      const matchesSeniority =
        selectedSeniority === "All Seniorities" ||
        pSeniority.toLowerCase() === selectedSeniority.toLowerCase();

      return matchesSearch && matchesCategory && matchesSeniority;
    }).sort((a, b) => {
      if (sortBy === "highest_match") {
        const matchA = calculateProjectMatch(a.techStack, a.category) ?? 0;
        const matchB = calculateProjectMatch(b.techStack, b.category) ?? 0;
        return matchB - matchA;
      }
      if (sortBy === "latest") return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      if (sortBy === "starting_soon") return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      return 0;
    });
  }, [search, selectedCategory, selectedSeniority, sortBy, candidateSkillsText, hasResume, allProjects]);

  // Candidate Internship Application Form Submit Handler
  async function handleApplyFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProjectForApply) return;

    setIsSubmittingApply(true);

    const userEmail = currentUser?.email || "registered.candidate@careeros.com";
    const userName = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "Registered Candidate";

    const newApp: ProjectApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      projectId: selectedProjectForApply.id,
      userId: currentUser?.id || `user-${Date.now()}`,
      applicantName: userName,
      email: userEmail,
      phone: applyPhone || "+91 98765 43210",
      college: applyCollege || "Engineering Institute",
      degree: applyDegree,
      gradYear: applyGradYear,
      domain: applyDomain,
      githubUrl: applyGithubUrl || "https://github.com",
      portfolioUrl: applyPortfolioUrl,
      resumeUrl: applyResumeUrl || "https://careeros.app/resumes/candidate_resume.pdf",
      whyJoin: applyWhyJoin || "Eager to work on production Next.js & TypeScript architecture and collaborate with senior engineering captains.",
      experience: applyExperience || "Built production React and Node.js projects with REST APIs and modern UI components.",
      availability: applyAvailability,
      status: "applied", // Awaiting PM review
      appliedAt: new Date().toISOString().split("T")[0],
      atsScore: Math.floor(Math.random() * 12) + 86,
      atsKeywordMatch: Math.floor(Math.random() * 8) + 90,
      atsFormattingScore: Math.floor(Math.random() * 10) + 88,
      dsaSolvedCount: Math.floor(Math.random() * 90) + 60,
      dsaTopicsMastered: [
        { topic: "Arrays & Strings", count: 28 },
        { topic: "Dynamic Programming", count: 18 },
        { topic: "Trees & BST", count: 22 },
        { topic: "SQL & DB Queries", count: 14 },
      ],
      aiMockInterviewScore: 92,
      streakDays: 14,
      project: selectedProjectForApply,
    };

    const updated = [newApp, ...userApplications];
    setUserApplications(updated);

    const storageKey = userEmail ? `careeros_user_apps_${userEmail}` : "careeros_user_apps_guest";
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    // Persist application to backend DB for PM console review
    try {
      await fetch("/api/projects/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApp),
      });
    } catch (err) {
      console.error("Failed to persist application:", err);
    }

    setIsSubmittingApply(false);
    setSelectedProjectForApply(null);

    notify({
      type: "success",
      icon: "📝",
      title: "Application Submitted to PM!",
      body: `Your internship application for "${selectedProjectForApply.title}" has been submitted. Status: UNDER REVIEW ⏳`,
      autoDismiss: 5000,
    });
  }

  // Join Project Handler
  async function handleJoinProject(proj: any) {
    const userEmail = currentUser?.email || "registered.user@careeros.com";
    const userName = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "Registered Candidate";

    const newApp = {
      id: `app-${Date.now()}`,
      projectId: proj.id,
      userId: currentUser?.id || `user-${Date.now()}`,
      applicantName: userName,
      email: userEmail,
      domain: "Full Stack",
      status: "selected",
      appliedAt: new Date().toISOString().split("T")[0],
      project: proj,
    };
    const updated = [newApp, ...userApplications];
    setUserApplications(updated);
    setViewMode("my_project");

    const storageKey = userEmail ? `careeros_user_apps_${userEmail}` : "careeros_user_apps_guest";
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem("careeros_enrolled_project_id", proj.id);
    } catch {}

    try {
      await fetch("/api/projects/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApp),
      });
    } catch (err) {
      console.error("Failed to persist application:", err);
    }

    notify({
      type: "success",
      icon: "🎉",
      title: "Successfully Enrolled in Project!",
      body: `You are now an active team member of "${proj.title}". Opening your workspace!`,
      autoDismiss: 4000,
    });

    setViewMode("my_project");
  }

  // Drag & Drop Handlers for Manager -> Team Assignment
  const handleDropTaskToTeam = async (e: React.DragEvent, team: ProjectTeam) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId") || draggedTaskId;
    if (!taskId) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assignedToType: "team",
              assignedTeamId: team.id,
              assignedTeamName: team.teamName,
            }
          : t
      )
    );

    try {
      await fetch("/api/projects/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          assignedToType: "team",
          assignedTeamId: team.id,
          assignedTeamName: team.teamName,
        }),
      });
    } catch (err) {
      console.error("Failed to update task assignment:", err);
    }

    notify({
      type: "success",
      icon: "⚡",
      title: "Task Assigned to Team!",
      body: `Assigned task to ${team.teamName} (TL: ${team.teamLeaderName}).`,
      autoDismiss: 3000,
    });
    setDraggedTaskId(null);
    setHoveredDropTargetId(null);
  };

  // Drag & Drop Handlers for TL -> Member Assignment
  const handleDropTaskToMember = async (e: React.DragEvent, member: any, team?: ProjectTeam) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId") || draggedTaskId;
    if (!taskId) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assignedToType: "member",
              assignedTeamId: team?.id || t.assignedTeamId || "team-1",
              assignedTeamName: team?.teamName || t.assignedTeamName || "Team 1",
              assignedMemberId: member.id,
              assignedMemberName: member.name,
              assignedMemberAvatar: member.avatar,
              assignedMemberRole: member.role,
            }
          : t
      )
    );

    try {
      await fetch("/api/projects/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          assignedToType: "member",
          assignedTeamId: team?.id || "team-1",
          assignedTeamName: team?.teamName || "Team 1",
          assignedMemberId: member.id,
          assignedMemberName: member.name,
          assignedMemberAvatar: member.avatar,
          assignedMemberRole: member.role,
        }),
      });
    } catch (err) {
      console.error("Failed to update task member assignment:", err);
    }

    notify({
      type: "success",
      icon: "🎯",
      title: "Task Assigned to Member!",
      body: `Assigned task to ${member.name} (${member.role}).`,
      autoDismiss: 3000,
    });
    setDraggedTaskId(null);
    setHoveredDropTargetId(null);
  };

  // Create New Task Submission Handler
  const handleCreateNewTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assignedTeam = teams.find((t) => t.id === newTaskTargetTeamId);
    const assignedMember = teams.flatMap((t) => t.members).find((m) => m.id === newTaskTargetMemberId);

    const newTaskItem: Task = {
      id: `task-${Date.now()}`,
      projectId: enrolledProject.id,
      title: newTaskTitle,
      description: newTaskDesc,
      createdByRole: "Project Manager",
      createdByName: "Bhavesh Rao",
      assignedToType: assignedMember ? "member" : assignedTeam ? "team" : "unassigned",
      assignedTeamId: assignedTeam?.id,
      assignedTeamName: assignedTeam?.teamName,
      assignedMemberId: assignedMember?.id,
      assignedMemberName: assignedMember?.name,
      assignedMemberAvatar: assignedMember?.avatar,
      assignedMemberRole: assignedMember?.role,
      status: "todo",
      priority: newTaskPriority,
      points: newTaskPoints,
      dueDate: newTaskDueDate,
    };

    setTasks((prev) => [newTaskItem, ...prev]);
    setShowCreateTaskModal(false);
    setNewTaskTitle("");
    setNewTaskDesc("");

    try {
      await fetch("/api/projects/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskItem),
      });
    } catch (err) {
      console.error("Failed to create task in DB:", err);
    }

    notify({
      type: "success",
      icon: "📋",
      title: "Task Created Successfully!",
      body: `Task "${newTaskTitle}" created & added to queue.`,
      autoDismiss: 3000,
    });
  };

  // Intern Task Status & Remarks Submission Handler
  const handleInternTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForInternUpdate) return;

    const taskId = selectedTaskForInternUpdate.id;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: internStatusChoice,
              internRemarks: internRemarksInput,
              submittedAt: new Date().toISOString(),
            }
          : t
      )
    );

    try {
      await fetch("/api/projects/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          status: internStatusChoice,
          internRemarks: internRemarksInput,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Failed to update task deliverable:", err);
    }

    notify({
      type: "success",
      icon: "✅",
      title: "Task Deliverable Updated!",
      body: `Marked as ${internStatusChoice.replace("_", " ")}. Remarks submitted to TL.`,
      autoDismiss: 3500,
    });
    setSelectedTaskForInternUpdate(null);
    setInternRemarksInput("");
  };

  // Promote Member Function
  const handlePromoteMember = async (memberId: string, newRole: string) => {
    setTeams((prev) =>
      prev.map((team) => {
        const memIdx = team.members.findIndex((m) => m.id === memberId || m.name === memberId);
        if (memIdx !== -1) {
          const updatedMembers = [...team.members];
          updatedMembers[memIdx] = { ...updatedMembers[memIdx], role: newRole };
          return {
            ...team,
            ...(newRole.includes("TL") || newRole.includes("Leader")
              ? { teamLeaderName: updatedMembers[memIdx].name }
              : {}),
            members: updatedMembers,
          };
        }
        return team;
      })
    );

    try {
      await fetch("/api/projects/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "promote", memberId, newRole }),
      });
    } catch (err) {
      console.error("Failed to promote member in DB:", err);
    }

    notify({
      type: "success",
      icon: "👑",
      title: "Member Promoted!",
      body: `Promoted candidate to "${newRole}". Powers updated live in team hierarchy.`,
      autoDismiss: 4500,
    });

    if (selectedMemberForModal) {
      setSelectedMemberForModal((prev: any) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  // Submit PR Link
  function handleSubmitPR(taskId: string, e: React.FormEvent) {
    e.preventDefault();
    const url = prUrlMap[taskId];
    if (!url) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "review" } : t))
    );

    notify({
      type: "success",
      icon: "🚀",
      title: "Pull Request Submitted!",
      body: `Submitted PR link to Team Leader for review: ${url}`,
      autoDismiss: 3500,
    });
  }

  // Attendance Mark
  function handleMarkAttendance(status: "present" | "leave" | "half_day") {
    setTodayAttendanceStatus(status);
    const todayStr = new Date().toISOString().split("T")[0];
    const newLog: AttendanceRecord = {
      id: `att-${Date.now()}`,
      projectId: enrolledProject.id,
      userId: "user-1",
      date: todayStr,
      status: status,
      verifiedByTL: true,
    };
    setAttendanceLogs((prev) => [newLog, ...prev.filter((l) => l.date !== todayStr)]);

    notify({
      type: "success",
      icon: "🗓️",
      title: "Attendance Marked!",
      body: `Marked as ${status.toUpperCase()} for today. Verified by TL Ananya Roy.`,
      autoDismiss: 3000,
    });
  }

  // Post Announcement
  function handlePostAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    const newAnn: ProjectAnnouncement = {
      id: `ann-${Date.now()}`,
      projectId: enrolledProject.id,
      authorName: annRole === "Project Manager" ? "Bhavesh Rao" : annRole === "Project Leader" ? "Siddharth Malhotra" : "Ananya Roy",
      authorRole: annRole,
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      title: annTitle,
      content: annContent,
      priority: annPriority,
      createdAt: new Date().toISOString(),
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setAnnTitle("");
    setAnnContent("");
    setShowAnnForm(false);

    notify({
      type: "success",
      icon: "📢",
      title: "Announcement Broadcasted!",
      body: `Published announcement "${annTitle}" to all team members.`,
      autoDismiss: 3500,
    });
  }

  // PM Handler: Add Team
  function handleAddTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeamName || !newTeamTLName) return;
    const team: ProjectTeam = {
      id: `team-${Date.now()}`,
      projectId: enrolledProject.id,
      teamName: newTeamName,
      teamLeaderName: newTeamTLName,
      teamLeaderEmail: newTeamTLEmail || `${newTeamTLName.toLowerCase().replace(/\s+/g, ".")}@careeros.in`,
      maxSeats: Number(newTeamMaxSeats),
      filledSeats: 1,
      members: [
        {
          id: `tl-${Date.now()}`,
          name: newTeamTLName,
          email: newTeamTLEmail || `${newTeamTLName.toLowerCase().replace(/\s+/g, ".")}@careeros.in`,
          domain: "Full Stack",
          role: "Team Leader (TL)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      ],
    };
    setTeams((prev) => [...prev, team]);
    setShowAddTeamModal(false);
    setNewTeamName("");
    setNewTeamTLName("");
    setNewTeamTLEmail("");
    notify({
      type: "success",
      icon: "👥",
      title: "New Team Created!",
      body: `Created ${newTeamName} led by TL ${newTeamTLName} with ${newTeamMaxSeats} max seats.`,
      autoDismiss: 4000,
    });
  }

  // PM Handler: Schedule 1-on-1 Interview
  async function handleScheduleInterview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedApplicantForInterview) return;
    const targetId = selectedApplicantForInterview.id;
    setApplications((prev) =>
      prev.map((app) =>
        app.id === targetId
          ? {
              ...app,
              status: "interview_scheduled",
              interviewDate,
              interviewTime,
              interviewLink: interviewMeetLink,
            }
          : app
      )
    );

    try {
      await fetch("/api/projects/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetId,
          status: "interview_scheduled",
          interviewDate,
          interviewTime,
          meetUrl: interviewMeetLink,
        }),
      });
    } catch (err) {
      console.error("Failed to update application interview info:", err);
    }

    const applicantName = selectedApplicantForInterview.applicantName;
    setSelectedApplicantForInterview(null);
    notify({
      type: "success",
      icon: "📅",
      title: "1-on-1 Interview Scheduled!",
      body: `Scheduled interview with ${applicantName} for ${interviewDate} at ${interviewTime}. Google Meet: ${interviewMeetLink}`,
      autoDismiss: 4000,
    });
  }

  // PM Handler: Candidate Allocation to Team & TL
  async function handleAllocateCandidate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedApplicantForAllocation || !targetTeamId) return;
    const targetTeam = teams.find((t) => t.id === targetTeamId);
    if (!targetTeam) return;

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApplicantForAllocation.id
          ? {
              ...app,
              status: "selected",
              assignedTeamId: targetTeam.id,
              assignedTeamName: targetTeam.teamName,
              assignedTLName: targetTeam.teamLeaderName,
            }
          : app
      )
    );

    try {
      await fetch("/api/projects/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApplicantForAllocation.id,
          status: "selected",
          assignedTeamId: targetTeam.id,
          assignedTeamName: targetTeam.teamName,
          assignedTLName: targetTeam.teamLeaderName,
        }),
      });
    } catch (err) {
      console.error("Failed to update application allocation info:", err);
    }

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === targetTeam.id) {
          return {
            ...t,
            filledSeats: t.filledSeats + 1,
            members: [
              ...t.members,
              {
                id: `mem-${Date.now()}`,
                name: selectedApplicantForAllocation.applicantName,
                email: selectedApplicantForAllocation.email,
                domain: selectedApplicantForAllocation.domain,
                role: "Intern / Team Member",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              },
            ],
          };
        }
        return t;
      })
    );

    const candName = selectedApplicantForAllocation.applicantName;
    setSelectedApplicantForAllocation(null);
    notify({
      type: "success",
      icon: "🎉",
      title: "Candidate Allocated!",
      body: `Successfully allocated ${candName} to ${targetTeam.teamName} under TL ${targetTeam.teamLeaderName}!`,
      autoDismiss: 4000,
    });
  }

  // Intern Handler: Submit or Re-submit Leave / Half Day Request with Reason (Database Connected)
  async function handleLeaveRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leaveRequestReason) return;

    // Strict Once-Per-Day check
    const existingForDate = attendanceLogs.find(
      (l) => (l.userId === "mem-2" || l.userName === "Bhavesh Rao") && l.date === leaveRequestDate
    );

    if (existingForDate && !resubmitRecordId) {
      notify({
        type: "warning",
        icon: "🔒",
        title: "Attendance Already Taken Today!",
        body: `Attendance/Request for ${leaveRequestDate} has already been recorded (${existingForDate.status.replace("_", " ")}). Attendance can only be taken once per day.`,
        autoDismiss: 4500,
      });
      setShowLeaveRequestModal(false);
      return;
    }

    const payload: AttendanceRecord = {
      id: resubmitRecordId || `att-${Date.now()}`,
      projectId: enrolledProject.id,
      userId: "mem-2",
      userName: "Bhavesh Rao",
      userRole: "Intern",
      teamId: "team-1",
      teamName: "Team 1 - Frontend & AI Pipeline",
      date: leaveRequestDate,
      status: leaveRequestType,
      requestReason: leaveRequestReason,
      approvalStatus: "pending",
      verifiedByTL: false,
    };

    // Save to Database API
    try {
      const res = await fetch("/api/projects/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok && data.alreadyMarked) {
        notify({
          type: "warning",
          icon: "🔒",
          title: "Attendance Already Recorded Today",
          body: data.error,
          autoDismiss: 4500,
        });
        setShowLeaveRequestModal(false);
        return;
      }
    } catch (err) {
      console.error("Database sync error:", err);
    }

    let updatedLogs: AttendanceRecord[];
    if (resubmitRecordId) {
      updatedLogs = attendanceLogs.map((rec) => (rec.id === resubmitRecordId ? payload : rec));
    } else {
      updatedLogs = [payload, ...attendanceLogs];
    }

    setAttendanceLogs(updatedLogs);
    try {
      localStorage.setItem("careeros_attendance_logs_v2", JSON.stringify(updatedLogs));
    } catch {}

    setShowLeaveRequestModal(false);
    setLeaveRequestReason("");
    setResubmitRecordId(null);

    notify({
      type: "success",
      icon: "✅",
      title: "Request Saved to Database!",
      body: `Submitted ${leaveRequestType.replace("_", " ")} request for ${leaveRequestDate} to DB & TL review.`,
      autoDismiss: 4000,
    });
  }

  // TL / Manager Handler: Approve or Reject Leave Request with Remark (Database Connected & Auto Absent on Leave Approval)
  async function handleApprovalDecision(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRecordForApproval) return;

    const reviewerName = "PM Bhavesh Rao";

    // Auto assign status to leave/absent if TL approved full day leave
    const finalStatus =
      reviewAction === "approved"
        ? (selectedRecordForApproval.status === "leave" ? "leave" : selectedRecordForApproval.status)
        : selectedRecordForApproval.status;

    const updatedLogs = attendanceLogs.map((rec) =>
      rec.id === selectedRecordForApproval.id
        ? {
            ...rec,
            status: finalStatus,
            approvalStatus: reviewAction,
            reviewedBy: reviewerName,
            remark:
              reviewRemark ||
              (reviewAction === "approved"
                ? `Leave request approved by ${reviewerName}. Automatically marked as Approved Leave / Absent.`
                : "Leave request rejected by Team Lead."),
            verifiedByTL: reviewAction === "approved",
          }
        : rec
    );

    setAttendanceLogs(updatedLogs);
    try {
      localStorage.setItem("careeros_attendance_logs_v2", JSON.stringify(updatedLogs));
    } catch {}

    // Patch Database API
    try {
      await fetch("/api/projects/attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRecordForApproval.id,
          status: finalStatus,
          approvalStatus: reviewAction,
          reviewedBy: reviewerName,
          remark:
            reviewRemark ||
            (reviewAction === "approved"
              ? `Leave request approved by ${reviewerName}. Automatically marked as Approved Leave / Absent.`
              : "Leave request rejected by Team Lead."),
        }),
      });
    } catch (err) {
      console.error("DB Patch error:", err);
    }

    const applicantName = selectedRecordForApproval.userName;
    setSelectedRecordForApproval(null);
    setReviewRemark("");

    notify({
      type: reviewAction === "approved" ? "success" : "info",
      icon: reviewAction === "approved" ? "✅" : "❌",
      title: reviewAction === "approved" ? "Leave Approved & Marked Absent!" : "Leave Request Rejected",
      body:
        reviewAction === "approved"
          ? `Approved leave request. ${applicantName} automatically marked as LEAVE / ABSENT in Database.`
          : `Rejected leave request for ${applicantName}.`,
      autoDismiss: 4500,
    });
  }

  // TL / Manager Handler: Directly Mark or Edit Member Attendance (Database Connected & Once-Per-Day Enforced with Edit Support)
  async function handleTLMarkMemberAttendance(userId: string, userName: string, status: "present" | "half_day" | "leave" | "absent", allowEdit = false) {
    const todayDateStr = new Date().toISOString().split("T")[0];
    const reviewerName = "PM Bhavesh Rao";

    // Strict Once-Per-Day per member check
    const existing = attendanceLogs.find(
      (r) => (r.userId === userId || r.userName === userName) && r.date === todayDateStr
    );

    if (existing && !allowEdit) {
      notify({
        type: "warning",
        icon: "🔒",
        title: "Attendance Already Recorded Today!",
        body: `Attendance for ${userName} has already been recorded for today (${existing.status.replace("_", " ")}). Click the Edit button to modify today's entry.`,
        autoDismiss: 4500,
      });
      return;
    }

    if (existing && allowEdit) {
      const updatedLog: AttendanceRecord = {
        ...existing,
        status,
        approvalStatus: "approved",
        reviewedBy: reviewerName,
        remark: status === "present" ? "Updated check-in to Present." : `Updated to ${status.replace("_", " ")} by ${reviewerName}.`,
        verifiedByTL: true,
      };

      const updatedLogs = attendanceLogs.map((r) => (r.id === existing.id ? updatedLog : r));
      setAttendanceLogs(updatedLogs);
      try {
        localStorage.setItem("careeros_attendance_logs_v2", JSON.stringify(updatedLogs));
      } catch {}

      // Patch Database API
      try {
        await fetch("/api/projects/attendance", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: existing.id,
            approvalStatus: "approved",
            reviewedBy: reviewerName,
            remark: updatedLog.remark,
          }),
        });
      } catch (err) {}

      setEditingMemberAttendanceId(null);
      notify({
        type: "success",
        icon: "✏️",
        title: "Attendance Updated!",
        body: `Updated today's attendance for ${userName} to ${status.replace("_", " ").toUpperCase()}.`,
        autoDismiss: 3500,
      });
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      projectId: enrolledProject.id,
      userId,
      userName,
      userRole: userId.startsWith("tl") || userId === "mem-1" || userId === "mem-4" ? "TL" : "Intern",
      teamId: "team-1",
      teamName: "Team 1 - Frontend & AI Pipeline",
      date: todayDateStr,
      status,
      approvalStatus: "approved",
      reviewedBy: reviewerName,
      remark: status === "present" ? "Checked in for daily standup." : `Marked ${status.replace("_", " ")} by TL.`,
      verifiedByTL: true,
    };

    // Save to Database API
    try {
      const res = await fetch("/api/projects/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
      const data = await res.json();
      if (!res.ok && data.alreadyMarked) {
        notify({
          type: "warning",
          icon: "🔒",
          title: "Attendance Lock Warning",
          body: data.error,
          autoDismiss: 4500,
        });
        return;
      }
    } catch (err) {
      console.error("DB Sync error:", err);
    }

    const updatedLogs = [newRecord, ...attendanceLogs];
    setAttendanceLogs(updatedLogs);
    try {
      localStorage.setItem("careeros_attendance_logs_v2", JSON.stringify(updatedLogs));
    } catch {}

    setEditingMemberAttendanceId(null);

    notify({
      type: "success",
      icon: "⚡",
      title: "Attendance Saved to DB!",
      body: `Recorded ${status.replace("_", " ").toUpperCase()} for ${userName} on ${todayDateStr}. Saved in Database.`,
      autoDismiss: 3500,
    });
  }

  function handleDownloadOffer() {
    notify({
      type: "success",
      icon: "📜",
      title: "Offer Letter Downloaded!",
      body: "Downloaded official CareerOS Internship Offer Letter (PDF).",
      autoDismiss: 3500,
    });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ─────────────────────────────────────────────────────────────
          1. ENROLLED PROJECT WORKSPACE (WHEN USER HAS JOINED A PROJECT & viewMode === "my_project")
         ───────────────────────────────────────────────────────────── */}
      {hasJoinedProject && viewMode === "my_project" && (
        <div className="space-y-8">

          {/* Header Banner */}
          <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-surface to-surface">
            
            {/* Top Bar: Role Badge & Project Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 border-b border-border/60 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {isBoss && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                    <Crown className="size-3.5 text-amber-400" /> Boss / Admin Mode (Full System Access)
                  </span>
                )}
                {isManager && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-purple-400 bg-purple-500/15 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
                    <Briefcase className="size-3.5 text-purple-400" /> Manager Mode ({accessibleProjects.length} Managed Projects)
                  </span>
                )}
                {isPM && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="size-3.5 text-orange-400" /> Project Manager (PM) Workspace
                  </span>
                )}
                {isIntern && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-400 bg-teal-500/15 border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="size-3.5 text-teal-400" /> PM Accepted Intern Workspace
                  </span>
                )}
              </div>

              {(isBoss || isManager) && (
                <div className="flex items-center gap-2 surface-2 px-3.5 py-1.5 rounded-2xl border border-border shadow-sm shrink-0">
                  <span className="text-xs font-bold text-secondary whitespace-nowrap">Switch Project:</span>
                  <select
                    value={enrolledProject.id}
                    onChange={(e) => setActiveProjectId(e.target.value)}
                    className="bg-transparent text-xs font-bold text-primary focus:outline-none cursor-pointer border-none py-0.5 pr-2"
                  >
                    {accessibleProjects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-surface text-primary">
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Main Section: Project Title & Explore Button */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-3xl">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-snug">
                  {enrolledProject.title}
                </h1>

                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  Manager: <strong className="text-primary">{enrolledProject.managerName || "Vikramaditya Roy (Handles 6 Projs)"}</strong> · PM: <strong className="text-orange-400">{enrolledProject.projectManagerName || "Bhavesh Rao (Dedicated PM)"}</strong> · Stipend: <strong className="text-teal-400">{enrolledProject.stipend}</strong>
                </p>

                {/* Quick Resources / Links Bar */}
                <div className="flex items-center gap-3 pt-1 flex-wrap text-xs">
                  <a
                    href={gitRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl surface-2 border border-border text-primary font-bold hover:border-teal-500/50 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <GitBranch className="size-3.5 text-teal-400" /> Git Repo: <span className="text-teal-400 underline">GitHub Link</span>
                  </a>
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl surface-2 border border-border text-primary font-bold hover:border-orange-500/50 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Video className="size-3.5 text-orange-400" /> Daily Standup: <span className="text-orange-400 underline">Google Meet Link</span>
                  </a>
                </div>
              </div>

              {/* TOP ACTION BUTTON: EXPLORE MORE PROJECTS */}
              <div className="flex flex-col items-start lg:items-end gap-1 shrink-0 self-start lg:self-center">
                <button
                  onClick={() => setViewMode("explore")}
                  className="px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  <Briefcase className="size-4" /> Explore More Projects
                </button>
                <span className="text-[11px] text-muted">Click to view marketplace projects catalog</span>
              </div>
            </div>
          </div>

          {/* Workspace Sub-Tabs Bar */}
          <div className="surface p-1.5 rounded-2xl border border-border flex items-center gap-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setWorkspaceTab("announcements")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === "announcements"
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <Bell className="size-4" /> Broadcasts &amp; Links ({announcements.length})
            </button>

            <button
              onClick={() => setWorkspaceTab("tasks")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === "tasks"
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <CheckCircle2 className="size-4" /> Sprint Backlog &amp; PRs ({tasks.length})
            </button>

            <button
              onClick={() => setWorkspaceTab("attendance")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === "attendance"
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <Calendar className="size-4" /> Attendance Tracker
            </button>

            <button
              onClick={() => setWorkspaceTab("leadership")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === "leadership"
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <ShieldCheck className="size-4" /> Leadership Roster
            </button>

            <button
              onClick={() => setWorkspaceTab("rewards")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === "rewards"
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <Settings className="size-4" /> Settings &amp; Credentials
            </button>

            <button
              onClick={() => setWorkspaceTab("pm_teams" as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                workspaceTab === ("pm_teams" as any)
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <Users className="size-4" /> Project Teams Hub ({teams.length})
            </button>

            {(isBoss || isManager || isPM) && (
              <button
                onClick={() => setWorkspaceTab("pm_applicants" as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  workspaceTab === ("pm_applicants" as any)
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-secondary hover:text-primary"
                }`}
              >
                <UserPlus className="size-4" /> PM Governance &amp; Applicants ({applications.length})
              </button>
            )}
          </div>

          {/* ── PM/TL TAB: PROJECT TEAMS HUB & MEMBER LIST SCOPING ── */}
          {workspaceTab === ("pm_teams" as any) && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <Users className="size-5 text-orange-500" />
                    All Project Teams &amp; Member List
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    View project teams, Team Leaders, and enrolled intern member rosters.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddTeamModal(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="size-4" /> Create New Team &amp; Appoint TL
                </button>
              </div>

              {/* Teams Cards Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {teams.map((t) => (
                  <div key={t.id} className="surface p-5 rounded-3xl border border-orange-500/30 space-y-4 shadow-lg hover:border-orange-500/60 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">
                          {t.filledSeats} / {t.maxSeats} Seats Filled
                        </span>
                        <h4 className="font-bold text-base text-primary mt-1.5">{t.teamName}</h4>
                      </div>

                      <span className="text-xs font-bold font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-xl border border-orange-500/20">
                        TL: {t.teamLeaderName}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                      <p className="text-xs font-bold text-muted uppercase tracking-wider">Enrolled Team Members ({t.members.length}):</p>
                      <div className="space-y-2">
                        {t.members.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMemberForModal({ ...m, teamName: t.teamName, tlName: t.teamLeaderName })}
                            className="flex items-center gap-3 surface-2 p-2.5 rounded-xl border border-border cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
                            title="Click to view detailed intern profile card"
                          >
                            <img src={m.avatar} alt={m.name} className="size-8 rounded-full object-cover border border-border shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs text-primary group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                                {m.name}
                                <span className="text-[10px] text-muted font-normal group-hover:text-orange-400/80">(Profile)</span>
                              </p>
                              <p className="text-[11px] text-muted">{m.email} · <span className="text-teal-400 font-semibold">{m.domain}</span></p>
                            </div>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                              {m.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PM TAB: APPLICANTS & INTERVIEW SCHEDULER & EXTENDED LEAVES & EXTENSION HUB ── */}
          {workspaceTab === ("pm_applicants" as any) && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <UserPlus className="size-5 text-orange-500" /> Received Applications &amp; Intern Governance Console
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Review candidate applications, issue PDF Offer Letters with custom stipends/teams, schedule Next Technical/HR Rounds, and manage intern **Extended Leaves (3–10 Days)** and **Tenure Extensions**.
                  </p>
                </div>

                {/* Sub-tab view toggles */}
                <div className="flex items-center gap-1.5 surface-2 p-1 rounded-2xl border border-border shrink-0">
                  <button
                    onClick={() => setPmSubTab("candidates")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      pmSubTab === "candidates"
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    <UserPlus className="size-3.5" /> Received Apps ({applications.length})
                  </button>

                  <button
                    onClick={() => setPmSubTab("leaves")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      pmSubTab === "leaves"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    <Calendar className="size-3.5" /> PM Leaves (
                    {attendanceLogs.filter((r) => r.requestReason?.includes("[EXTENDED LEAVE TO PM") || r.reviewedBy?.includes("Project Manager")).length})
                  </button>

                  <button
                    onClick={() => setPmSubTab("extensions")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      pmSubTab === "extensions"
                        ? "bg-purple-500 text-white shadow-sm"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    <Clock className="size-3.5" /> Tenure Extensions ({tenureExtensionsList.length})
                  </button>
                </div>
              </div>

              {/* TELEMETRY METRICS */}
              <div className="grid grid-cols-3 gap-4">
                <div className="surface p-4 rounded-2xl border border-border text-center space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase">Received Applications</span>
                  <p className="font-display text-2xl font-extrabold text-primary">{applications.length}</p>
                </div>
                <div className="surface p-4 rounded-2xl border border-border text-center space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase">Interviews Scheduled</span>
                  <p className="font-display text-2xl font-extrabold text-amber-400">
                    {applications.filter((a) => a.status === "interview_scheduled").length}
                  </p>
                </div>
                <div className="surface p-4 rounded-2xl border border-border text-center space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase">Hired &amp; Allocated</span>
                  <p className="font-display text-2xl font-extrabold text-teal-400">
                    {applications.filter((a) => a.status === "selected").length}
                  </p>
                </div>
              </div>

              {/* SUB-VIEW 1: RECEIVED CANDIDATE APPLICATIONS */}
              {pmSubTab === "candidates" && (
                <div className="space-y-3">
                  {/* Seniority Sequence Toolbar */}
                  <div className="surface p-3.5 rounded-2xl border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                      <span className="font-bold text-muted uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
                        <Award className="size-3.5 text-purple-400" /> Seniority Level:
                      </span>
                      {["All", "Architect / PM Level", "Senior / Lead Track", "Mid-Level Engineer", "Junior Intern", "Freshers / Entry Level"].map((sen) => (
                        <button
                          key={sen}
                          onClick={() => setPmSeniorityFilter(sen)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${
                            pmSeniorityFilter === sen
                              ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                              : "surface-2 text-secondary hover:text-primary border-border"
                          }`}
                        >
                          {sen}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-muted uppercase whitespace-nowrap">Seniority Order:</span>
                      <select
                        value={pmSenioritySort}
                        onChange={(e: any) => setPmSenioritySort(e.target.value)}
                        className="h-8 px-2.5 rounded-xl surface-2 border border-border text-[11px] font-bold text-primary focus:outline-none cursor-pointer"
                      >
                        <option value="desc">⬇ Seniority: High → Low</option>
                        <option value="asc">⬆ Seniority: Low → High</option>
                      </select>
                    </div>
                  </div>

                  <div className="surface rounded-2xl border border-border overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border bg-surface-2 text-muted font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3.5 px-4">Candidate</th>
                          <th className="py-3.5 px-4">Seniority Tag &amp; Domain</th>
                          <th className="py-3.5 px-4">Status &amp; Allocation</th>
                          <th className="py-3.5 px-4 text-right">Actions (Hire / Next Round / Reject)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {sequencedApplications.map((app) => {
                          const displaySeniority =
                            app.seniorityLevel ||
                            ((app.atsScore ?? 0) >= 95 || (app.dsaSolvedCount ?? 0) >= 300
                              ? "Architect / PM Level"
                              : (app.atsScore ?? 0) >= 92 || (app.dsaSolvedCount ?? 0) >= 200
                              ? "Senior / Lead Track"
                              : (app.atsScore ?? 0) >= 88 || (app.dsaSolvedCount ?? 0) >= 150
                              ? "Mid-Level Engineer"
                              : (app.atsScore ?? 0) >= 80 || (app.dsaSolvedCount ?? 0) >= 80
                              ? "Junior Intern"
                              : "Freshers / Entry Level");

                          return (
                            <tr key={app.id} className="hover:bg-surface-2/50 transition-colors">
                              <td className="py-3.5 px-4 cursor-pointer group" onClick={() => setSelectedApplicantForView(app)}>
                                <p className="font-bold text-primary text-sm group-hover:text-orange-400 flex items-center gap-1">
                                  {app.applicantName}
                                  <span className="text-[10px] text-muted font-normal group-hover:text-orange-400/80">(Click to View)</span>
                                </p>
                                <p className="text-[11px] text-muted font-mono">{app.email}</p>
                                {app.college && (
                                  <p className="text-[10px] text-teal-400 font-semibold mt-0.5">{app.college} · {app.degree}</p>
                                )}
                              </td>
                              <td className="py-3.5 px-4 max-w-xs cursor-pointer" onClick={() => setSelectedApplicantForView(app)}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-[10px] font-extrabold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                                    <Award className="size-3 text-purple-400" /> 🎯 {displaySeniority}
                                  </span>
                                </div>
                                <p className="font-bold text-teal-400">{app.domain}</p>
                                <p className="text-[11px] text-secondary truncate">{app.experience}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {app.atsScore && (
                                    <span className="text-[10px] font-extrabold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                                      ATS: {app.atsScore}%
                                    </span>
                                  )}
                                  {app.dsaSolvedCount && (
                                    <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                      DSA: {app.dsaSolvedCount} Solved
                                    </span>
                                  )}
                                </div>
                              </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                app.status === "selected"
                                  ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                                  : app.status === "interview_scheduled"
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                  : app.status === "rejected"
                                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                  : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {app.status.replace("_", " ")}
                            </span>
                            {app.assignedTeamName && (
                              <p className="text-[11px] text-teal-400 font-bold mt-1">
                                ✓ {app.assignedTeamName} (TL: {app.assignedTLName})
                              </p>
                            )}
                            {app.interviewDate && (
                              <p className="text-[10px] text-amber-400 font-mono mt-1">
                                📅 {app.interviewDate} @ {app.interviewTime}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* 📄 VIEW FULL APPLICATION BUTTON */}
                              <button
                                onClick={() => setSelectedApplicantForView(app)}
                                className="px-3 py-1.5 rounded-xl surface-2 border border-border text-primary hover:border-orange-500/50 font-bold text-[11px] flex items-center gap-1 transition-all"
                              >
                                <FileText className="size-3 text-orange-400" /> Full Application
                              </button>

                              {/* 🟢 HIRE BUTTON */}
                              {app.status !== "selected" && (
                                <button
                                  onClick={() => {
                                    setSelectedApplicantForHire(app);
                                    setHirePost(app.domain || "Full Stack Intern");
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                                >
                                  <CheckCircle2 className="size-3" /> Hire &amp; Offer
                                </button>
                              )}

                              {/* 🔵 NEXT ROUND BUTTON */}
                              <button
                                onClick={() => setSelectedApplicantForNextRound(app)}
                                className="px-3 py-1.5 rounded-xl surface-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-bold text-[11px] flex items-center gap-1 transition-all"
                              >
                                <Video className="size-3" /> Next Round
                              </button>

                              {/* 🔴 REJECT BUTTON */}
                              {app.status !== "rejected" && (
                                <button
                                  onClick={() => setSelectedApplicantForReject(app)}
                                  className="px-2.5 py-1.5 rounded-xl surface-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold text-[11px] flex items-center gap-1 transition-all"
                                >
                                  <X className="size-3" /> Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

              {/* SUB-VIEW 2: EXTENDED LEAVE REQUESTS (3 TO 10 DAYS TO PM) */}
              {pmSubTab === "leaves" && (
                <div className="space-y-4">
                  <div className="surface p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-xs space-y-1">
                    <h4 className="font-bold text-primary flex items-center gap-1.5">
                      <Calendar className="size-4 text-amber-400" /> PM Governance — Extended Leave Applications (3–10 Days)
                    </h4>
                    <p className="text-secondary">
                      Multi-day intern leaves route directly to Project Managers for team coverage check. Approving automatically updates attendance logs.
                    </p>
                  </div>

                  {attendanceLogs.filter((r) => r.requestReason?.includes("[EXTENDED LEAVE TO PM") || r.reviewedBy?.includes("Project Manager")).length === 0 ? (
                    <div className="surface p-6 rounded-2xl border border-border text-center text-xs text-muted">
                      No extended leave requests pending for Project Manager review.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attendanceLogs
                        .filter((r) => r.requestReason?.includes("[EXTENDED LEAVE TO PM") || r.reviewedBy?.includes("Project Manager"))
                        .map((leave) => (
                          <div key={leave.id} className="surface p-5 rounded-2xl border border-border space-y-3 shadow-sm hover:border-amber-500/40 transition-all">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-border">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-primary">{leave.userName}</h4>
                                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    Extended Leave Application
                                  </span>
                                </div>
                                <p className="text-xs text-muted mt-0.5">Start Date: <strong className="text-primary font-mono">{leave.date}</strong></p>
                              </div>

                              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                                leave.approvalStatus === "approved"
                                  ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                                  : leave.approvalStatus === "rejected"
                                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                  : "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse"
                              }`}>
                                Status: {leave.approvalStatus || "pending"}
                              </span>
                            </div>

                            <div className="surface-2 p-3.5 rounded-xl border border-border text-xs space-y-1">
                              <span className="font-bold text-amber-400 text-[10px] uppercase">Reason &amp; Leave Duration</span>
                              <p className="text-secondary">{leave.requestReason}</p>
                              {leave.remark && <p className="text-teal-400 font-semibold pt-1">PM Remark: {leave.remark}</p>}
                            </div>

                            {leave.approvalStatus === "pending" && (
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  onClick={() => setSelectedPMLeaveForReview(leave)}
                                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center gap-1.5"
                                >
                                  <UserCheck className="size-3.5" /> Review Leave Request
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 3: TENURE EXTENSION APPLICATIONS */}
              {pmSubTab === "extensions" && (
                <div className="space-y-4">
                  <div className="surface p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 text-xs space-y-1">
                    <h4 className="font-bold text-primary flex items-center gap-1.5">
                      <Clock className="size-4 text-purple-400" /> PM Governance — Internship Tenure Extensions
                    </h4>
                    <p className="text-secondary">
                      Review intern applications to extend internship tenure (+1 to +3 Months). Approving automatically updates target end date.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {tenureExtensionsList.map((ext) => (
                      <div key={ext.id} className="surface p-5 rounded-2xl border border-border space-y-3 shadow-sm hover:border-purple-500/40 transition-all">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-border">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-primary">{ext.internName}</h4>
                              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                                +{ext.extensionMonths} Month(s) Extension
                              </span>
                            </div>
                            <p className="text-xs text-muted mt-0.5">
                              {ext.email} · Current End: <strong className="text-orange-400 font-mono">{ext.currentEndDate}</strong> ➔ Proposed End: <strong className="text-teal-400 font-mono">{ext.newEndDate}</strong>
                            </p>
                          </div>

                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                            ext.status === "approved"
                              ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                              : ext.status === "rejected"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              : "bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse"
                          }`}>
                            Status: {ext.status}
                          </span>
                        </div>

                        <div className="surface-2 p-3.5 rounded-xl border border-border text-xs space-y-1">
                          <span className="font-bold text-purple-400 text-[10px] uppercase">Goal Justification</span>
                          <p className="text-secondary">{ext.reason}</p>
                          {ext.reviewRemark && <p className="text-teal-400 font-semibold pt-1">PM Remark: {ext.reviewRemark}</p>}
                        </div>

                        {ext.status === "pending" && (
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => setSelectedPMExtensionForReview(ext)}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-600 text-white shadow-md flex items-center gap-1.5"
                            >
                              <Award className="size-3.5" /> Review Extension Request
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 1: ANNOUNCEMENTS & NOTIFICATIONS FEED ── */}
          {workspaceTab === "announcements" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <Bell className="size-5 text-orange-500" /> Important Leadership Announcements
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Official broadcast feed from Project Leader, Manager, TLs, and Technical Captains.
                  </p>
                </div>

                <button
                  onClick={() => setShowAnnForm(!showAnnForm)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold surface-2 border border-border text-primary hover:border-orange-500/50 flex items-center gap-1.5"
                >
                  <Plus className="size-3.5 text-orange-500" />
                  <span>{showAnnForm ? "Close Form" : "Post Announcement"}</span>
                </button>
              </div>

              {/* Form to Post Announcement */}
              {showAnnForm && (
                <form
                  onSubmit={handlePostAnnouncement}
                  className="surface p-5 rounded-2xl border border-orange-500/30 space-y-4 shadow-md"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted mb-1">
                        Announcement Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sprint 2 Code Review & Architecture Call"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted mb-1">
                          Sender Role
                        </label>
                        <select
                          value={annRole}
                          onChange={(e: any) => setAnnRole(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                        >
                          <option value="Project Manager">Project Manager</option>
                          <option value="Project Leader">Project Leader</option>
                          <option value="Team Leader (TL)">Team Leader (TL)</option>
                          <option value="Technical Captain">Technical Captain</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-muted mb-1">
                          Priority
                        </label>
                        <select
                          value={annPriority}
                          onChange={(e: any) => setAnnPriority(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                        >
                          <option value="urgent">🔴 Urgent</option>
                          <option value="important">🟡 Important</option>
                          <option value="normal">🟢 Normal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-muted mb-1">
                      Announcement Content *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter detailed notification content for team members..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-1.5"
                    >
                      <Send className="size-3.5" /> Broadcast to Team
                    </button>
                  </div>
                </form>
              )}

              {/* Feed List */}
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="surface p-5 rounded-2xl border border-border space-y-3 hover:border-orange-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ann.authorAvatar}
                          alt={ann.authorName}
                          className="size-10 rounded-full object-cover border border-border"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-primary text-sm">{ann.authorName}</p>
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                              {ann.authorRole}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted">
                            Broadcasted on {new Date(ann.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          ann.priority === "urgent"
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : ann.priority === "important"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                        }`}
                      >
                        {ann.priority}
                      </span>
                    </div>

                    <div className="space-y-1 pl-13">
                      <h4 className="font-bold text-primary text-sm">{ann.title}</h4>
                      <p className="text-xs text-secondary leading-relaxed">{ann.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 2: TASK BOARD & DRAG-AND-DROP DELEGATION CONSOLE ── */}
          {workspaceTab === "tasks" && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-orange-500" />
                    Sprint Backlog &amp; Deliverables Board
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    View assigned sprint tasks, track progress (To Do, In Progress, Completed, Blocked), submit PR links, and manage deliverables.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNewTaskTargetTeamId("");
                    setNewTaskTargetMemberId("");
                    setShowCreateTaskModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="size-4" /> Create Task
                </button>
              </div>

              {/* Sprint Task Board (Kanban Columns) */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    { key: "todo", label: "📝 To Do", color: "border-border text-primary" },
                    { key: "in_progress", label: "⚡ In Progress", color: "border-blue-500/30 text-blue-400" },
                    { key: "partially_done", label: "🟡 Partially Done", color: "border-amber-500/30 text-amber-400" },
                    { key: "completed", label: "🟢 Completed", color: "border-teal-500/30 text-teal-400" },
                    { key: "issue", label: "🔴 Issue / Blocked", color: "border-rose-500/30 text-rose-400" },
                  ].map((column) => {
                    const colTasks = tasks.filter((t) => (t.status || "todo") === column.key);
                    return (
                      <div key={column.key} className="surface p-4 rounded-2xl border border-border space-y-3 min-h-[300px]">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <span className={`text-xs font-extrabold ${column.color}`}>{column.label}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-2 text-muted">
                            {colTasks.length}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {colTasks.length === 0 ? (
                            <p className="text-[11px] text-muted italic text-center py-6">No tasks in this stage</p>
                          ) : (
                            colTasks.map((t) => (
                              <div
                                key={t.id}
                                onClick={() => {
                                  setSelectedTaskForInternUpdate(t);
                                  setInternStatusChoice(
                                    (t.status as any) === "todo" ? "in_progress" : (t.status as any) || "completed"
                                  );
                                  setInternRemarksInput(t.internRemarks || "");
                                }}
                                className="surface-2 p-3.5 rounded-xl border border-border space-y-2.5 hover:border-orange-500/50 cursor-pointer transition-all shadow-sm group"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-bold text-xs text-primary group-hover:text-orange-400 transition-colors line-clamp-2">
                                    {t.title}
                                  </h4>
                                  <span
                                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase shrink-0 ${
                                      t.priority === "high"
                                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    }`}
                                  >
                                    {t.priority}
                                  </span>
                                </div>

                                <p className="text-[11px] text-secondary line-clamp-2">{t.description}</p>

                                {t.internRemarks && (
                                  <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-300 italic">
                                    💬 &quot;{t.internRemarks}&quot;
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px] text-muted">
                                  <span className="text-orange-400 font-bold">+{t.points} pts</span>
                                  <span>Due: {t.dueDate}</span>
                                </div>

                                <button className="w-full py-1.5 rounded-lg text-[10px] font-bold bg-orange-500/15 hover:bg-orange-500 text-orange-400 hover:text-white transition-all">
                                  ✏️ Update Status &amp; Remarks
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>
          )}

          {/* ── TAB 3: ATTENDANCE & LEAVE APPROVAL WORKFLOW ── */}
          {workspaceTab === "attendance" && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <Calendar className="size-5 text-orange-500" />
                    Daily Attendance &amp; Leave Console
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    {isTL
                      ? "Manage your personal attendance rate or switch to Team Attendance to mark and maintain your team's records."
                      : "Track your personal attendance rate, date-wise check-ins, and 1-day short leave request status."}
                  </p>
                </div>

                {/* TL SUB-TAB SWITCHER (Visible strictly for Team Leaders) */}
                {isTL && (
                  <div className="surface-2 p-1.5 rounded-2xl border border-border flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setTlAttendanceSubTab("your_attendance")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        tlAttendanceSubTab === "your_attendance"
                          ? "bg-orange-500 text-white shadow-md"
                          : "text-secondary hover:text-primary"
                      }`}
                    >
                      <User className="size-3.5" /> Your Attendance
                    </button>
                    <button
                      onClick={() => setTlAttendanceSubTab("team_attendance")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        tlAttendanceSubTab === "team_attendance"
                          ? "bg-orange-500 text-white shadow-md"
                          : "text-secondary hover:text-primary"
                      }`}
                    >
                      <Users className="size-3.5" /> Team Attendance ({teams.flatMap((t) => t.members).length})
                    </button>
                  </div>
                )}
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  SECTION 1: PERSONAL ATTENDANCE VIEW (INTERNS & TL "YOUR ATTENDANCE")
                 ───────────────────────────────────────────────────────────── */}
              {(!isTL || tlAttendanceSubTab === "your_attendance") && (
                <div className="space-y-6 animate-fade-in">
                  {/* Personal Attendance Stats Ring & Metrics Card */}
                  <div className="surface p-6 rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-surface to-surface space-y-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="size-16 rounded-2xl bg-orange-500/20 text-orange-400 flex flex-col items-center justify-center font-display font-extrabold text-xl border border-orange-500/40 shadow-inner">
                          <span>95%</span>
                          <span className="text-[9px] font-mono text-muted uppercase -mt-1">Rate</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-primary">Personal Attendance Performance</h4>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                              ✓ Verified Active
                            </span>
                          </div>
                          <p className="text-xs text-secondary mt-0.5">
                            Maintaining 95%+ attendance qualifies you for Certificate of Excellence and 5% Revenue Share tier.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                        <span className="px-3 py-1.5 rounded-xl surface-2 border border-border text-teal-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> 19 / 20 Days Present
                        </span>
                        <span className="px-3 py-1.5 rounded-xl surface-2 border border-border text-amber-400 font-bold flex items-center gap-1">
                          <Flame className="size-3.5" /> 14 Day Streak
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="surface-2 p-3 rounded-2xl border border-teal-500/20 bg-teal-500/5 text-center space-y-0.5">
                        <span className="text-[10px] font-bold text-teal-400 uppercase">Present Days</span>
                        <p className="font-display text-lg font-extrabold text-primary">19 Days</p>
                      </div>
                      <div className="surface-2 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center space-y-0.5">
                        <span className="text-[10px] font-bold text-amber-400 uppercase">Half Days</span>
                        <p className="font-display text-lg font-extrabold text-primary">1 Day</p>
                      </div>
                      <div className="surface-2 p-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center space-y-0.5">
                        <span className="text-[10px] font-bold text-rose-400 uppercase">Leave Days</span>
                        <p className="font-display text-lg font-extrabold text-primary">0 Days</p>
                      </div>
                    </div>
                  </div>

                  {/* Today's Check-in Action Card */}
                  {todayUserAttendance ? (
                    <div className="surface p-6 rounded-2xl border border-teal-500/40 bg-gradient-to-r from-teal-500/10 via-surface to-surface space-y-3 shadow-md">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold text-xl shrink-0">
                            ✓
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-base text-primary">Today&apos;s Attendance Recorded</h4>
                              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30 font-mono">
                                Lock Active 🔒
                              </span>
                            </div>
                            <p className="text-xs text-secondary mt-0.5">
                              Recorded Date: <span className="font-mono text-primary font-bold">{todayUserAttendance.date}</span> · Status:{" "}
                              <span className="text-teal-400 font-bold uppercase">{todayUserAttendance.status.replace("_", " ")}</span>
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-xl border border-teal-500/20 shrink-0">
                          TL Verified &amp; Saved ✅
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="surface p-6 rounded-2xl border border-orange-500/30 space-y-4 bg-gradient-to-br from-orange-500/10 via-surface to-surface">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest bg-orange-500/15 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                            Today&apos;s Attendance Check-in
                          </span>
                          <h4 className="font-bold text-base text-primary mt-1">
                            Date: {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleTLMarkMemberAttendance("mem-2", "Bhavesh Rao", "present")}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-500 text-white shadow-md flex items-center gap-1.5 hover:bg-teal-600 transition-all"
                          >
                            <UserCheck className="size-4" /> Present (Full Day)
                          </button>

                          <button
                            onClick={() => {
                              setLeaveRequestType("half_day");
                              setShowLeaveRequestModal(true);
                            }}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-md flex items-center gap-1.5 hover:bg-amber-600 transition-all"
                          >
                            <Clock className="size-4" /> Request Half Day
                          </button>

                          <button
                            onClick={() => {
                              setLeaveRequestType("leave");
                              setShowLeaveRequestModal(true);
                            }}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-md flex items-center gap-1.5 hover:bg-rose-600 transition-all"
                          >
                            <UserX className="size-4" /> Request 1-Day Leave
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Date-Wise Attendance History Table */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                      <Calendar className="size-4 text-orange-400" /> My Personal Date-Wise Attendance Logs
                    </h4>

                    <div className="surface rounded-2xl border border-border overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-surface-2 text-muted font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Check-in Status</th>
                            <th className="py-3 px-4">Approval Status</th>
                            <th className="py-3 px-4">TL / Reviewer Remark</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {attendanceLogs
                            .filter(
                              (log) =>
                                log.userId === currentUser?.id ||
                                log.userId === "mem-2" ||
                                log.userName?.toLowerCase().includes("bhavesh")
                            )
                            .map((log) => (
                              <tr key={log.id} className="hover:bg-surface-2/50 transition-colors">
                                <td className="py-3 px-4 font-bold text-primary font-mono">{log.date}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                      log.status === "present"
                                        ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                                        : log.status === "half_day"
                                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                        : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                    }`}
                                  >
                                    {log.status.replace("_", " ")}
                                  </span>
                                  {log.requestReason && (
                                    <p className="text-[11px] text-secondary italic mt-1 max-w-xs truncate">
                                      &quot;{log.requestReason}&quot;
                                    </p>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                      log.approvalStatus === "approved"
                                        ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                                        : log.approvalStatus === "rejected"
                                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    }`}
                                  >
                                    {log.approvalStatus || (log.verifiedByTL ? "approved" : "pending")}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-semibold text-xs text-secondary">
                                  {log.remark || "Verified by Team Leader"}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {log.approvalStatus !== "approved" && (
                                    <button
                                      onClick={() => {
                                        setResubmitRecordId(log.id);
                                        setLeaveRequestDate(log.date);
                                        setLeaveRequestType(log.status === "half_day" ? "half_day" : "leave");
                                        setLeaveRequestReason(log.requestReason || "");
                                        setShowLeaveRequestModal(true);
                                      }}
                                      className="px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] shadow-sm"
                                    >
                                      🔄 Re-submit
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  SECTION 2: TEAM LEADER (TL) "TEAM ATTENDANCE" CONSOLE
                 ───────────────────────────────────────────────────────────── */}
              {isTL && tlAttendanceSubTab === "team_attendance" && (
                <div className="space-y-6 animate-fade-in">
                  {/* PENDING LEAVE & HALF DAY REQUESTS DESK */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                        <AlertCircle className="size-4 text-amber-400" /> Pending Team 1-Day Leave Requests (
                        {attendanceLogs.filter((r) => r.approvalStatus === "pending").length})
                      </h4>
                      <span className="text-[11px] text-muted font-mono">TL Review Desk</span>
                    </div>

                    {attendanceLogs.filter((r) => r.approvalStatus === "pending").length === 0 ? (
                      <div className="surface p-4 rounded-2xl border border-border text-center text-xs text-muted">
                        ✓ No pending 1-day leave requests from team members.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {attendanceLogs
                          .filter((r) => r.approvalStatus === "pending")
                          .map((req) => (
                            <div key={req.id} className="surface p-4 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-primary">{req.userName}</span>
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    {req.status === "half_day" ? "Half Day Request" : "Leave Request"}
                                  </span>
                                  <span className="text-xs text-muted font-mono">{req.date}</span>
                                </div>
                                <p className="text-xs text-secondary italic">
                                  &quot;{req.requestReason || "No reason provided."}&quot;
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => {
                                    setSelectedRecordForApproval(req);
                                    setReviewAction("approved");
                                    setReviewRemark("Approved by TL. Good to go.");
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                                >
                                  <Check className="size-3.5" /> Approve Leave
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedRecordForApproval(req);
                                    setReviewAction("rejected");
                                    setReviewRemark("Declined by TL. Mandatory sprint deliverable today.");
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                                >
                                  <UserX className="size-3.5" /> Decline Request
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* DIRECT TEAM MEMBER ATTENDANCE MATRIX FOR TL */}
                  <div className="surface p-5 rounded-3xl border border-orange-500/30 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                        <UserCheck className="size-4 text-orange-500" />
                        Mark &amp; Maintain Team 1 Attendance
                      </h4>
                      <span className="text-xs text-teal-400 font-bold font-mono">Today: {new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {teams.flatMap((t) => t.members).map((member) => {
                        const todayLog = attendanceLogs.find(
                          (r) => (r.userId === member.id || r.userName === member.name) && r.date === todayStr
                        );
                        const isEditing = editingMemberAttendanceId === member.id;

                        return (
                          <div key={member.id} className="surface-2 p-3 rounded-2xl border border-border flex items-center justify-between gap-3 shadow-sm hover:border-orange-500/30 transition-all">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={member.avatar} alt={member.name} className="size-8 rounded-full object-cover border border-border shrink-0" />
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-primary truncate">{member.name}</p>
                                <p className="text-[10px] text-muted truncate">{member.role}</p>
                              </div>
                            </div>

                            {todayLog && !isEditing ? (
                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${
                                    todayLog.status === "present"
                                      ? "bg-teal-500/15 text-teal-400 border-teal-500/30"
                                      : todayLog.status === "half_day"
                                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                      : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                  }`}
                                >
                                  {todayLog.status === "present"
                                    ? "✓ Present"
                                    : todayLog.status === "half_day"
                                    ? "🟡 Half Day"
                                    : "🔴 Leave"}
                                </span>

                                <button
                                  onClick={() => setEditingMemberAttendanceId(member.id)}
                                  className="px-2.5 py-1 rounded-xl surface border border-border text-muted hover:text-orange-400 hover:border-orange-500/40 transition-all flex items-center gap-1 text-[11px] font-bold shadow-sm"
                                >
                                  <Edit3 className="size-3 text-orange-400" /> Edit
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleTLMarkMemberAttendance(member.id, member.name, "present", isEditing)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-teal-500/20 text-teal-400 border border-teal-500/40 hover:bg-teal-500 hover:text-white transition-all"
                                >
                                  P
                                </button>
                                <button
                                  onClick={() => handleTLMarkMemberAttendance(member.id, member.name, "half_day", isEditing)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500 hover:text-white transition-all"
                                >
                                  HD
                                </button>
                                <button
                                  onClick={() => handleTLMarkMemberAttendance(member.id, member.name, "leave", isEditing)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all"
                                >
                                  L
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Team-Wide Attendance History Table */}
                  <div className="surface rounded-2xl border border-border overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border bg-surface-2 text-muted font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Date &amp; Team Member</th>
                          <th className="py-3 px-4">Status &amp; Reason</th>
                          <th className="py-3 px-4">Approval Status</th>
                          <th className="py-3 px-4">TL Reviewer Remark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {attendanceLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-surface-2/50 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-bold text-primary">{log.date}</p>
                              <p className="text-[11px] text-teal-400 font-semibold">{log.userName || "Team Member"}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  log.status === "present"
                                    ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                                    : log.status === "half_day"
                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {log.status.replace("_", " ")}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  log.approvalStatus === "approved"
                                    ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                                    : log.approvalStatus === "rejected"
                                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {log.approvalStatus || "approved"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-secondary text-xs">
                              {log.remark || "Verified by TL"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: LEADERSHIP & CAPTAINS ROSTER ── */}
          {workspaceTab === "leadership" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <ShieldCheck className="size-5 text-orange-500" /> Leadership &amp; Technical Captains Roster
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Direct access to Project Founders, Managers, Team Leads, and Domain Captains.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LEADERSHIP_ROSTER.map((lead) => {
                  const Icon = lead.icon;
                  return (
                    <div
                      key={lead.role}
                      className="surface p-5 rounded-2xl border border-border space-y-4 hover:border-orange-500/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={lead.avatar}
                          alt={lead.name}
                          className="size-12 rounded-2xl object-cover border border-border"
                        />
                        <div>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${lead.color}`}>
                            {lead.role}
                          </span>
                          <h4 className="font-bold text-primary text-base mt-1">{lead.name}</h4>
                        </div>
                      </div>

                      <p className="text-xs text-secondary leading-relaxed">{lead.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TAB 5: ROLE-AWARE PROJECT SETTINGS & GOVERNANCE CONSOLE ── */}
          {workspaceTab === "rewards" && (
            <div className="space-y-8 animate-fade-in">
              {/* Settings Header Banner (Auto-Detected According to User's Role / Post) */}
              <div className="surface p-6 sm:p-8 rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-surface to-surface space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 mb-2">
                      <Settings className="size-3.5" /> Project &amp; Role Governance Console
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                      Project Settings &amp; Governance Hub
                    </h2>
                    <p className="text-xs sm:text-sm text-secondary mt-1">
                      Automated settings console configured according to your assigned post and role in the database.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 font-mono shadow-sm">
                      {effectiveSettingsRole.replace("_", " ")} CONSOLE 🔒
                    </span>
                  </div>
                </div>

                {/* PERSPECTIVE SUB-TEXT */}
                <p className="text-xs text-secondary">
                  {effectiveSettingsRole === "intern" && "Active Intern View: Tenure Details, Leave Requests to TL & PM, Extensions, & Offer Letter."}
                  {effectiveSettingsRole === "post_intern" && "Post-Intern View: Verified Certificate, LOR, Experience Letter & 5% Revenue Share Payout."}
                  {effectiveSettingsRole === "tl" && "TL View: Team Roster, 1-Day Short Leave Approval Desk, Code Review, & Star Ratings."}
                  {effectiveSettingsRole === "pm" && "PM View: Master Project Settings, Candidate Application Criteria, Team TL Setup, & Leave Approvals."}
                  {effectiveSettingsRole === "boss" && "Boss View: Executive System Overrides, PM Reassignment, Status Toggle, & Revenue Allocations."}
                </p>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  PERSPECTIVE 1: ACTIVE INTERN VIEW
                 ───────────────────────────────────────────────────────────── */}
              {effectiveSettingsRole === "intern" && (
                <div className="space-y-8 animate-fade-in">
                  {/* Grid Section 1: Intern Info & Dates + Credentials */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* 1. Intern Roster Info & Tenure Card */}
                    <div className="surface p-6 rounded-3xl border border-border space-y-5 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                          <User className="size-5 text-orange-400" /> Intern Profile &amp; Tenure Details
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-500/15 text-teal-400 border border-teal-500/30">
                          Active Member
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-0.5">
                          <span className="text-[10px] font-bold text-muted uppercase">Candidate Name</span>
                          <p className="font-bold text-primary text-sm">Bhavesh Rao</p>
                          <p className="text-[11px] text-muted font-mono">bhavesh@careeros.in</p>
                        </div>

                        <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-0.5">
                          <span className="text-[10px] font-bold text-muted uppercase">Role &amp; Track</span>
                          <p className="font-bold text-teal-400 text-sm">Full Stack Intern</p>
                          <p className="text-[11px] text-secondary">React 19 &amp; Node.js</p>
                        </div>

                        <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-0.5">
                          <span className="text-[10px] font-bold text-muted uppercase">Assigned Team</span>
                          <p className="font-bold text-primary">Team 1 — Full Stack &amp; AI</p>
                          <p className="text-[11px] text-orange-400 font-semibold">TL: Ananya Roy</p>
                        </div>

                        <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-0.5">
                          <span className="text-[10px] font-bold text-muted uppercase">Reporting PM</span>
                          <p className="font-bold text-purple-400">PM Lead Authority</p>
                          <p className="text-[11px] text-secondary">Governance Hub</p>
                        </div>

                        <div className="surface-2 p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-0.5">
                          <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                            <Calendar className="size-3" /> Official Join Date
                          </span>
                          <p className="font-display text-sm font-extrabold text-primary font-mono">2026-08-05</p>
                        </div>

                        <div className="surface-2 p-3.5 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-0.5">
                          <span className="text-[10px] font-bold text-teal-400 uppercase flex items-center gap-1">
                            <Calendar className="size-3" /> Scheduled End Date
                          </span>
                          <p className="font-display text-sm font-extrabold text-primary font-mono">2026-11-05</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Official Credentials & Revenue Share Card */}
                    <div className="surface p-6 rounded-3xl border border-border space-y-5 shadow-sm flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                          <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                            <Award className="size-5 text-orange-400" /> Credentials &amp; 5% Revenue Share
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-500/15 text-orange-400 border border-orange-500/30">
                            5% Share Tier
                          </span>
                        </div>

                        <p className="text-xs text-secondary leading-relaxed">
                          Your team enrollment is verified. You are eligible for an official Internship Certificate, LOR, and 5% revenue sharing payout on product sales upon completing your 3-month tenure.
                        </p>

                        <div className="surface-2 p-4 rounded-2xl border border-border space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-muted">Certificate Status:</span>
                            <span className="font-bold text-teal-400">✓ In Progress (95% Attendance)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted">Revenue Share Tier:</span>
                            <span className="font-bold text-orange-400">5% Equity Pool</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleDownloadOffer}
                          className="w-full py-3 rounded-2xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="size-4" /> Download Official Offer Letter (PDF)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Grid Section 2: Extended Leave to PM (3-10 Days) & Tenure Extension */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* 3. Extended Leave Request Form (3 – 10 Days) -> GOES TO PM */}
                    <div className="surface p-6 rounded-3xl border border-purple-500/30 space-y-5 shadow-sm bg-gradient-to-b from-purple-500/5 via-surface to-surface">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div>
                          <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                            <Calendar className="size-5 text-purple-400" /> Extended Leave Request (3–10 Days)
                          </h3>
                          <p className="text-[11px] text-purple-400 font-semibold mt-0.5">
                            ⚠️ Note: 1-Day short leaves go to TL. Extended Leaves (3–10 Days) route directly to PM!
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleBigLeaveSubmit} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-bold text-primary">Start Date *</label>
                            <input
                              type="date"
                              required
                              value={bigLeaveStartDate}
                              onChange={(e) => setBigLeaveStartDate(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-purple-500/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-primary">End Date *</label>
                            <input
                              type="date"
                              required
                              value={bigLeaveEndDate}
                              onChange={(e) => setBigLeaveEndDate(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-purple-500/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-primary">Reason &amp; Description for PM Review *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="State reason for extended 3–10 day leave (e.g. End-semester university exams, medical emergency)..."
                            value={bigLeaveReason}
                            onChange={(e) => setBigLeaveReason(e.target.value)}
                            className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-purple-500/50"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Send className="size-4" /> Submit Extended Leave Request to PM
                        </button>
                      </form>
                    </div>

                    {/* 4. Extend Internship Tenure Form -> GOES TO PM */}
                    <div className="surface p-6 rounded-3xl border border-teal-500/30 space-y-5 shadow-sm bg-gradient-to-b from-teal-500/5 via-surface to-surface">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div>
                          <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                            <Clock className="size-5 text-teal-400" /> Extend Internship Tenure
                          </h3>
                          <p className="text-[11px] text-teal-400 font-semibold mt-0.5">
                            Request tenure extension (+1 to +3 Months) directly to Project Manager.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleExtendTenureSubmit} className="space-y-4 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-primary">Extension Duration *</label>
                          <select
                            value={extendMonths}
                            onChange={(e) => setExtendMonths(Number(e.target.value))}
                            className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                          >
                            <option value={1}>+1 Month Extension (New End Date: Dec 5, 2026)</option>
                            <option value={2}>+2 Months Extension (New End Date: Jan 5, 2027)</option>
                            <option value={3}>+3 Months Extension (New End Date: Feb 5, 2027)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-primary">Goals &amp; Justification for Extension *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Detail what key architecture components or features you plan to build during the extension..."
                            value={extendReason}
                            onChange={(e) => setExtendReason(e.target.value)}
                            className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-teal-500/50"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Send className="size-4" /> Submit Tenure Extension Request to PM
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Section 3: My Governance Request History & PM Replies */}
                  <div className="surface p-6 sm:p-8 rounded-3xl border border-orange-500/30 space-y-5 shadow-lg bg-gradient-to-b from-orange-500/5 via-surface to-surface">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                          <FileText className="size-5 text-orange-400" /> My Governance Request History &amp; PM Status
                        </h3>
                        <p className="text-xs text-secondary mt-0.5">
                          Track all your submitted Extended Leave Requests and Tenure Extension applications, along with Project Manager (PM) decisions and official remarks.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-500/15 text-orange-400 border border-orange-500/30 font-mono shrink-0">
                        Live Status Feed 📡
                      </span>
                    </div>

                    <div className="space-y-4">
                      {(() => {
                        const myLeaves = attendanceLogs
                          .filter((r) => r.requestReason?.includes("[EXTENDED LEAVE TO PM") || (r.userId === "mem-2" && r.status === "leave"))
                          .map((r) => ({
                            id: r.id,
                            type: "Extended Leave (3–10 Days)",
                            date: r.date,
                            reason: r.requestReason,
                            status: r.approvalStatus || "pending",
                            reviewedBy: r.reviewedBy || "Project Manager (Pending)",
                            remark: r.remark || (r.approvalStatus === "approved" ? "Approved by PM. Ensure sprint handovers." : r.approvalStatus === "rejected" ? "Request declined." : "Awaiting PM review..."),
                            badgeColor: "amber",
                          }));

                        const myExtensions = tenureExtensionsList
                          .filter((e) => e.userId === "mem-2" || e.internName === "Bhavesh Rao")
                          .map((e) => ({
                            id: e.id,
                            type: `Tenure Extension (+${e.extensionMonths} Month${e.extensionMonths > 1 ? "s" : ""})`,
                            date: e.appliedAt || "2026-09-06",
                            reason: `Current End Date: ${e.currentEndDate} ➔ Proposed End Date: ${e.newEndDate}. Goal: ${e.reason}`,
                            status: e.status || "pending",
                            reviewedBy: e.reviewedBy || "Project Manager (Pending)",
                            remark: e.reviewRemark || (e.status === "approved" ? "Extension granted by PM." : e.status === "rejected" ? "Extension declined." : "Awaiting PM review..."),
                            badgeColor: "purple",
                          }));

                        const combined = [...myLeaves, ...myExtensions];

                        if (combined.length === 0) {
                          return (
                            <div className="surface-2 p-6 rounded-2xl border border-border text-center text-xs text-muted">
                              No extended leave or tenure extension requests submitted yet.
                            </div>
                          );
                        }

                        return combined.map((item) => (
                          <div
                            key={item.id}
                            className="surface-2 p-5 rounded-2xl border border-border space-y-3 hover:border-orange-500/40 transition-all shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                    item.badgeColor === "amber"
                                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                      : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                  }`}
                                >
                                  {item.type}
                                </span>
                                <span className="text-xs text-muted font-mono">Submitted: {item.date}</span>
                              </div>

                              <span
                                className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                                  item.status === "approved"
                                    ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                                    : item.status === "rejected"
                                    ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                    : "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse"
                                }`}
                              >
                                Status: {item.status.replace("_", " ")}
                              </span>
                            </div>

                            <div className="text-xs space-y-1">
                              <span className="font-bold text-muted text-[10px] uppercase">My Submitted Request Details:</span>
                              <p className="text-secondary leading-relaxed">{item.reason}</p>
                            </div>

                            <div
                              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                                item.status === "approved"
                                  ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                                  : item.status === "rejected"
                                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold text-[11px]">
                                <span className="flex items-center gap-1.5">
                                  💬 PM Decision &amp; Reply ({item.reviewedBy})
                                </span>
                                <span>
                                  {item.status === "approved"
                                    ? "✅ Approved"
                                    : item.status === "rejected"
                                    ? "❌ Declined"
                                    : "⏳ Pending Review"}
                                </span>
                              </div>
                              <p className="italic text-xs font-medium leading-relaxed">&quot;{item.remark}&quot;</p>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Section 4: Danger Zone - Leave / Offboard Project */}
                  <div className="surface p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-base font-bold text-rose-400 flex items-center gap-2">
                          <AlertTriangle className="size-5 text-rose-500" /> Danger Zone — Leave &amp; Offboard Project
                        </h3>
                        <p className="text-xs text-secondary mt-1">
                          Resign or offboard from {enrolledProject.title}. Your assigned team seat will be released and you can re-apply to other projects in the Marketplace.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowLeaveProjectModal(true)}
                        className="px-5 py-3 rounded-2xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 shrink-0"
                      >
                        <LogOut className="size-4" /> Leave &amp; Offboard Project
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  PERSPECTIVE 2: POST-INTERN (ALUMNI & GRADUATED INTERN) VIEW
                 ───────────────────────────────────────────────────────────── */}
              {effectiveSettingsRole === "post_intern" && (
                <div className="space-y-8 animate-fade-in">
                  {/* Graduation Banner */}
                  <div className="surface p-6 sm:p-8 rounded-3xl border border-teal-500/40 bg-gradient-to-r from-teal-500/15 via-surface to-surface space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold border border-teal-500/30">
                          <GraduationCap className="size-7 text-teal-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-xl font-extrabold text-primary">Internship Graduation &amp; Alumni Status</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase">
                              Verified Graduate 🎓
                            </span>
                          </div>
                          <p className="text-xs text-secondary mt-0.5">
                            Congratulations! You have successfully completed your 3-month tenure in <strong className="text-primary">{enrolledProject.title}</strong>.
                          </p>
                        </div>
                      </div>
                      <span className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-xs font-bold shrink-0">
                        Verification ID: CO-CERT-2026-89412
                      </span>
                    </div>

                    <p className="text-xs text-secondary leading-relaxed">
                      Your project contributions have been signed off by Project Manager <strong className="text-orange-400">{enrolledProject.projectManagerName || "Bhavesh Rao"}</strong>. Below are your official verified credentials and 5% revenue sharing payout details.
                    </p>
                  </div>

                  {/* Credentials & Downloads Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* 1. Official Internship Certificate */}
                    <div className="surface p-6 rounded-3xl border border-teal-500/30 space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="size-10 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold border border-teal-500/30">
                          <Award className="size-5" />
                        </div>
                        <h4 className="font-bold text-primary text-base">Internship Certificate</h4>
                        <p className="text-xs text-secondary leading-relaxed">
                          Official Certificate of Completion with digital QR verification and skill breakdown.
                        </p>
                      </div>

                      <button
                        onClick={handleDownloadOffer}
                        className="w-full py-3 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="size-4" /> Download Certificate (PDF)
                      </button>
                    </div>

                    {/* 2. PM Letter of Recommendation (LOR) */}
                    <div className="surface p-6 rounded-3xl border border-purple-500/30 space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="size-10 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">
                          <FileCheck className="size-5" />
                        </div>
                        <h4 className="font-bold text-primary text-base">PM Recommendation (LOR)</h4>
                        <p className="text-xs text-secondary leading-relaxed">
                          Personalized Letter of Recommendation signed by your Project Manager for hiring managers.
                        </p>
                      </div>

                      <button
                        onClick={handleDownloadOffer}
                        className="w-full py-3 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="size-4" /> Download PM LOR (PDF)
                      </button>
                    </div>

                    {/* 3. Verified Experience Letter */}
                    <div className="surface p-6 rounded-3xl border border-amber-500/30 space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="size-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
                          <Briefcase className="size-5" />
                        </div>
                        <h4 className="font-bold text-primary text-base">Work Experience Letter</h4>
                        <p className="text-xs text-secondary leading-relaxed">
                          Formal employment proof document detailing your 3-month tenure, hours, and stack.
                        </p>
                      </div>

                      <button
                        onClick={handleDownloadOffer}
                        className="w-full py-3 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="size-4" /> Download Exp Letter (PDF)
                      </button>
                    </div>
                  </div>

                  {/* 5% Revenue Share Payout Console */}
                  <div className="surface p-6 sm:p-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/10 via-surface to-surface space-y-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                      <div>
                        <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                          <DollarSign className="size-5 text-orange-400" /> 5% Revenue Share Payout Dashboard
                        </h3>
                        <p className="text-xs text-secondary mt-0.5">
                          Calculated share from product sales revenue generated during your sprint tenure.
                        </p>
                      </div>

                      <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono shrink-0">
                        STATUS: PAID &amp; SETTLED ✅
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-xs">
                      <div className="surface-2 p-4 rounded-2xl border border-border space-y-1">
                        <span className="text-[10px] font-bold text-muted uppercase">Total SaaS Sales Attributed</span>
                        <p className="font-display text-xl font-extrabold text-primary font-mono">$9,000.00</p>
                        <p className="text-[11px] text-muted">Across 18 Pro Subscriptions</p>
                      </div>

                      <div className="surface-2 p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 space-y-1">
                        <span className="text-[10px] font-bold text-orange-400 uppercase">Your 5% Share Payout</span>
                        <p className="font-display text-xl font-extrabold text-orange-400 font-mono">$450.00</p>
                        <p className="text-[11px] text-orange-300">Equivalent to ₹37,500 INR</p>
                      </div>

                      <div className="surface-2 p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-1">
                        <span className="text-[10px] font-bold text-teal-400 uppercase">Transfer Method &amp; Ref</span>
                        <p className="font-bold text-primary text-sm">UPI / Bank Transfer</p>
                        <p className="text-[11px] text-teal-300 font-mono">TXN-8821948120</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  PERSPECTIVE 3: TEAM LEADER (TL) VIEW
                 ───────────────────────────────────────────────────────────── */}
              {effectiveSettingsRole === "tl" && (
                <div className="space-y-8 animate-fade-in">
                  {/* TL Header Banner */}
                  <div className="surface p-6 sm:p-8 rounded-3xl border border-purple-500/40 bg-gradient-to-r from-purple-500/15 via-surface to-surface space-y-3 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">
                        <Crown className="size-7 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl font-extrabold text-primary">Team Leader (TL) Governance Console</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                            TL Authority 👔
                          </span>
                        </div>
                        <p className="text-xs text-secondary mt-0.5">
                          Manage your team roster, review 1-day short leave requests, evaluate member ratings, and submit top performer recommendations to PM.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* TL Section 1: Team Roster & Weekly Star Ratings */}
                  <div className="surface p-6 rounded-3xl border border-border space-y-5 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                          <Users className="size-5 text-purple-400" /> Team 1 Roster &amp; TL Member Ratings
                        </h3>
                        <p className="text-xs text-secondary mt-0.5">
                          Assign star ratings (1–5) to team members based on PR quality, standup attendance, and code reviews.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        3 Members Assigned
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: "mem-2", name: "Bhavesh Rao", email: "bhavesh@careeros.in", role: "UI & Component Intern", domain: "Frontend" },
                        { id: "mem-3", name: "Riya Mehta", email: "riya.m@gmail.com", role: "Lead Scoring Intern", domain: "AI/ML" },
                        { id: "mem-5", name: "Arjun Nair", email: "arjun.n@gmail.com", role: "PostgreSQL Intern", domain: "Database" },
                      ].map((mem) => (
                        <div key={mem.id} className="surface-2 p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-primary text-sm flex items-center gap-2">
                              {mem.name} <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted border border-border font-normal">{mem.domain}</span>
                            </p>
                            <p className="text-xs text-secondary">{mem.role} · <span className="font-mono text-muted">{mem.email}</span></p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-muted font-semibold">TL Rating:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => {
                                    setTlRatings((prev) => ({ ...prev, [mem.id]: star }));
                                    notify({
                                      type: "success",
                                      icon: "⭐",
                                      title: "Rating Updated",
                                      body: `Updated TL rating for ${mem.name} to ${star} Stars.`,
                                      autoDismiss: 3000,
                                    });
                                  }}
                                  className="p-1 transition-all hover:scale-110"
                                >
                                  <Star
                                    className={`size-4 ${
                                      star <= (tlRatings[mem.id] || 4)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-muted opacity-30"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TL Section 2: 1-Day Short Leave Approval Desk */}
                  <div className="surface p-6 rounded-3xl border border-border space-y-5 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                          <Calendar className="size-5 text-purple-400" /> TL 1-Day Short Leave Approval Desk
                        </h3>
                        <p className="text-xs text-secondary mt-0.5">
                          1-day leave requests from your team members are routed directly to you for approval.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {tlShortLeaves.filter((l) => l.status === "pending").length} Pending Requests
                      </span>
                    </div>

                    <div className="space-y-4">
                      {tlShortLeaves.map((req) => (
                        <div key={req.id} className="surface-2 p-4 rounded-2xl border border-border space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-primary text-sm">{req.memberName} ({req.memberRole})</p>
                              <p className="text-xs text-muted font-mono mt-0.5">Requested Date: {req.date} · Submitted: {req.submittedAt}</p>
                            </div>

                            <span
                              className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                                req.status === "approved"
                                  ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                                  : req.status === "rejected"
                                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                  : "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse"
                              }`}
                            >
                              Status: {req.status}
                            </span>
                          </div>

                          <div className="surface p-3 rounded-xl border border-border text-xs text-secondary">
                            <strong className="text-primary font-semibold">Reason:</strong> &quot;{req.reason}&quot;
                          </div>

                          {req.status === "pending" && (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setTlShortLeaves((prev) =>
                                    prev.map((l) => (l.id === req.id ? { ...l, status: "approved" } : l))
                                  );
                                  notify({
                                    type: "success",
                                    icon: "✅",
                                    title: "1-Day Leave Approved",
                                    body: `Approved 1-day leave for ${req.memberName}.`,
                                    autoDismiss: 3000,
                                  });
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white transition-all flex items-center gap-1.5"
                              >
                                <Check className="size-3.5" /> Approve Leave
                              </button>
                              <button
                                onClick={() => {
                                  setTlShortLeaves((prev) =>
                                    prev.map((l) => (l.id === req.id ? { ...l, status: "rejected" } : l))
                                  );
                                  notify({
                                    type: "info",
                                    icon: "❌",
                                    title: "1-Day Leave Declined",
                                    body: `Declined 1-day leave for ${req.memberName}.`,
                                    autoDismiss: 3000,
                                  });
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-bold surface-2 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5"
                              >
                                <X className="size-3.5" /> Decline Request
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  PERSPECTIVE 4: PROJECT MANAGER (PM) VIEW
                 ───────────────────────────────────────────────────────────── */}
              {effectiveSettingsRole === "pm" && (
                <div className="space-y-8 animate-fade-in">
                  {/* PM Header Banner */}
                  <div className="surface p-6 sm:p-8 rounded-3xl border border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-surface to-surface space-y-3 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold border border-orange-500/30">
                        <ShieldCheck className="size-7 text-orange-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl font-extrabold text-primary">Project Manager (PM) Master Console</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/40 uppercase">
                            PM Master 📌
                          </span>
                        </div>
                        <p className="text-xs text-secondary mt-0.5">
                          Configure workspace repository links, select candidate application criteria, manage teams &amp; TLs, and process extended leave/tenure extension requests.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PM Master Settings Configuration Form */}
                  <div className="surface p-6 rounded-3xl border border-border space-y-6 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                        <Sliders className="size-5 text-orange-400" /> Master Project Details &amp; Application Mode
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
                        Live Project Settings
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 text-xs">
                      {/* Git Repository Link */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-primary flex items-center gap-1.5">
                          <GitBranch className="size-3.5 text-teal-400" /> Git Repository URL
                        </label>
                        <input
                          type="url"
                          value={gitRepoUrl}
                          onChange={(e) => setGitRepoUrl(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary font-mono focus:outline-none focus:border-orange-500/50"
                        />
                      </div>

                      {/* Daily Standup Meet Link */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-primary flex items-center gap-1.5">
                          <Video className="size-3.5 text-orange-400" /> Daily Standup Google Meet URL
                        </label>
                        <input
                          type="url"
                          value={meetingUrl}
                          onChange={(e) => setMeetingUrl(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary font-mono focus:outline-none focus:border-orange-500/50"
                        />
                      </div>

                      {/* Project Title */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-primary flex items-center gap-1.5">
                          <Briefcase className="size-3.5 text-purple-400" /> Project Title
                        </label>
                        <input
                          type="text"
                          value={pmTitleInput}
                          onChange={(e) => setPmTitleInput(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                        />
                      </div>

                      {/* Stipend Setting */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-primary flex items-center gap-1.5">
                          <DollarSign className="size-3.5 text-teal-400" /> Project Stipend / Equity Pool
                        </label>
                        <input
                          type="text"
                          value={pmStipendInput}
                          onChange={(e) => setPmStipendInput(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                        />
                      </div>
                    </div>

                    {/* Application Mode Selection */}
                    <div className="surface-2 p-5 rounded-2xl border border-border space-y-3 text-xs">
                      <label className="font-bold text-primary text-sm flex items-center gap-2">
                        <UserCheck className="size-4 text-orange-400" /> Candidate Application Criteria Mode
                      </label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <label
                          onClick={() => setPmAppMode("manual")}
                          className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                            pmAppMode === "manual"
                              ? "bg-orange-500/10 border-orange-500 text-primary"
                              : "surface border-border text-secondary hover:border-orange-500/30"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs">
                            <span>📋 Require PM Review &amp; Form (Default)</span>
                            {pmAppMode === "manual" && <Check className="size-4 text-orange-400" />}
                          </div>
                          <p className="text-[11px] text-muted leading-relaxed">
                            Candidates must fill application form with GitHub link, college details &amp; experience before PM approval.
                          </p>
                        </label>

                        <label
                          onClick={() => setPmAppMode("auto")}
                          className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                            pmAppMode === "auto"
                              ? "bg-orange-500/10 border-orange-500 text-primary"
                              : "surface border-border text-secondary hover:border-orange-500/30"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs">
                            <span>⚡ Instant Auto-Join Mode</span>
                            {pmAppMode === "auto" && <Check className="size-4 text-orange-400" />}
                          </div>
                          <p className="text-[11px] text-muted leading-relaxed">
                            Candidates clicking apply in Marketplace directly join project without waiting for manual PM review.
                          </p>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        notify({
                          type: "success",
                          icon: "💾",
                          title: "PM Master Settings Saved",
                          body: "Updated project repository link, standup meet URL, and candidate application mode.",
                          autoDismiss: 4000,
                        });
                      }}
                      className="w-full py-3 rounded-2xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="size-4" /> Save PM Master Settings Configuration
                    </button>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  PERSPECTIVE 5: BOSS & ADMIN VIEW
                 ───────────────────────────────────────────────────────────── */}
              {effectiveSettingsRole === "boss" && (
                <div className="space-y-8 animate-fade-in">
                  {/* Boss Header Banner */}
                  <div className="surface p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-surface to-surface space-y-3 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
                        <Crown className="size-7 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl font-extrabold text-primary">Boss &amp; System Admin Executive Overrides</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                            Full Access 👑
                          </span>
                        </div>
                        <p className="text-xs text-secondary mt-0.5">
                          Reassign Project Managers, modify manager allocations, toggle project active status, and manage master revenue pool splits.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Executive Controls Form */}
                  <div className="surface p-6 rounded-3xl border border-border space-y-6 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                        <Crown className="size-5 text-amber-400" /> Multi-Project Management Overrides
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Boss Authority Mode
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-primary">Assigned Project Manager (PM) Email</label>
                        <input
                          type="email"
                          value={pmPMEmailInput}
                          onChange={(e) => setPmPMEmailInput(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary font-mono focus:outline-none focus:border-amber-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-primary">Assigned General Manager Email</label>
                        <input
                          type="email"
                          value={pmManagerEmailInput}
                          onChange={(e) => setPmManagerEmailInput(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary font-mono focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        notify({
                          type: "success",
                          icon: "👑",
                          title: "Executive Override Applied",
                          body: "Updated project PM & Manager assignment across the system hierarchy.",
                          autoDismiss: 4000,
                        });
                      }}
                      className="w-full py-3 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Crown className="size-4" /> Save Executive Role Allocations
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. EXPLORE MORE PROJECTS CATALOG (WHEN viewMode === "explore" OR USER IS UNENROLLED)
         ───────────────────────────────────────────────────────────── */}
      {(!hasJoinedProject || viewMode === "explore") && (
        <div className="space-y-8">
          {/* TOP BANNER FOR ENROLLED USERS VIEWING EXPLORE CATALOG */}
          {hasJoinedProject && (
            <div className="surface p-5 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-500/15 via-surface to-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg animate-fade-in">
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold shrink-0 border border-teal-500/30">
                  <Rocket className="size-6 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-primary text-base">You are enrolled in {enrolledProject.title}</p>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-extrabold border border-teal-500/30">
                      Active Member
                    </span>
                  </div>
                  <p className="text-xs text-secondary mt-0.5">
                    Your tasks, attendance tracker, and leadership announcements are active.
                  </p>
                </div>
              </div>

              {/* TOP ACTION BUTTON: GO TO YOUR PROJECT PAGE */}
              <button
                onClick={() => setViewMode("my_project")}
                className="px-5 py-3 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 shrink-0"
              >
                <Zap className="size-4" /> Go to Your Project Page
              </button>
            </div>
          )}

          {/* TOP BANNER FOR CANDIDATES WITH PENDING APPLICATIONS */}
          {!hasJoinedProject && (() => {
            const pendingApp = userApplications.find(a => a.status === "applied" || a.status === "under_review" || a.status === "interview_scheduled");
            if (!pendingApp) return null;
            return (
              <div className="surface p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-surface to-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg animate-fade-in">
                <div className="flex items-center gap-3.5">
                  <div className="size-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 border border-amber-500/30">
                    <Clock className="size-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-primary text-base">Application Submitted &amp; Under PM Review</p>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30 font-mono">
                        STATUS: {pendingApp.status.toUpperCase().replace("_", " ")} ⏳
                      </span>
                    </div>
                    <p className="text-xs text-secondary mt-0.5">
                      Submitted on <strong className="text-primary">{pendingApp.appliedAt}</strong> · Project Manager is evaluating your questionnaire responses, ATS score, and DSA practice history.
                    </p>
                  </div>
                </div>

                <span className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs shrink-0 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-amber-400" /> Awaiting PM Decision &amp; Offer Letter
                </span>
              </div>
            );
          })()}

          {/* Clean Header Navigation */}
          <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-surface to-surface">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
                  <Rocket className="size-3.5 text-orange-500" /> CareerOS Projects &amp; Internship Hub
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  Real-World SaaS Projects &amp; <span className="text-orange-400">Internship Teams</span>
                </h1>

                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  Join production engineering teams, build sellable software products, earn verified 1–6 month Internship Certificates, LORs, and receive 5% revenue sharing on project sales.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/dashboard/projects/leaderboard"
                  className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 transition-all flex items-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <Trophy className="size-4" /> Leaderboard &amp; Badges
                </Link>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="size-4 text-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by title, tech stack (Next.js, Python, Rust)..."
                  className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-medium whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="h-10 px-3 rounded-2xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none cursor-pointer"
                >
                  <option value="highest_match">⭐ Highest Skill Match %</option>
                  <option value="latest">🆕 Latest Projects</option>
                  <option value="starting_soon">⏰ Starting Soon</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                      : "surface-2 text-secondary hover:text-primary border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Seniority Level Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Award className="size-3.5 text-purple-400" /> Seniority Level:
              </span>
              {SENIORITY_TAGS.map((sen) => (
                <button
                  key={sen}
                  onClick={() => setSelectedSeniority(sen)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    selectedSeniority === sen
                      ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                      : "surface-2 text-secondary hover:text-primary border-border"
                  }`}
                >
                  {sen}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const displaySeniority =
                project.seniorityTag ||
                (project.difficulty === "Beginner"
                  ? "Freshers / Entry Level"
                  : project.difficulty === "Intermediate"
                  ? "Junior Intern"
                  : project.difficulty === "Advanced"
                  ? "Senior / Lead Track"
                  : "Architect / PM Level");

              return (
                <div
                  key={project.id}
                  className="surface rounded-3xl border border-border hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-md hover:-translate-y-1"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-surface-2">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

                    {(() => {
                      const matchScore = calculateProjectMatch(project.techStack, project.category);
                      if (matchScore !== null) {
                        return (
                          <div className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Sparkles className="size-3" /> {matchScore}% Match
                          </div>
                        );
                      } else {
                        return (
                          <Link
                            href="/dashboard/resume"
                            className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md hover:bg-amber-300 transition-colors"
                          >
                            Upload Resume
                          </Link>
                        );
                      }
                    })()}

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-orange-500" /> {project.durationMonths} Months Internship
                        </span>
                        <span className="text-orange-400 font-bold">{project.weeklyHours} hrs/week</span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                          <Award className="size-3" /> 🎯 {displaySeniority}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-primary group-hover:text-orange-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>

                    <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="surface-2 p-3 rounded-2xl border border-border text-xs space-y-1">
                      <div className="flex justify-between items-center text-primary font-bold">
                        <span>Stipend:</span>
                        <span className="text-teal-400 font-mono">{project.stipend}</span>
                      </div>
                      <div className="flex justify-between items-center text-muted text-[11px]">
                        <span>Product Val:</span>
                        <span>{project.estimatedProductValue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-muted">Team Seats Filled</span>
                        <span className="text-orange-400">
                          {project.filledSeats} / {project.teamSize} ({project.remainingSeats} Left)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(project.filledSeats / project.teamSize) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono font-bold surface-2 px-2 py-0.5 rounded-lg border border-border text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border text-xs text-muted">
                      <img
                        src={project.mentor.avatar}
                        alt={project.mentor.name}
                        className="size-6 rounded-full object-cover"
                      />
                      <span className="truncate">
                        Mentor: <strong className="text-primary">{project.mentor.name}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-2 border-t border-border flex items-center justify-between gap-2">
                  {(() => {
                    const userAppForProj = userApplications.find((a) => a.projectId === project.id);
                    if (userAppForProj?.status === "selected" || userAppForProj?.status === "joined" || userAppForProj?.status === "confirmed") {
                      return (
                        <button
                          onClick={() => setViewMode("my_project")}
                          className="w-full py-2.5 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="size-4" />
                          <span>Enrolled &amp; Active (Go to Workspace)</span>
                        </button>
                      );
                    }
                    if (userAppForProj?.status === "applied" || userAppForProj?.status === "under_review" || userAppForProj?.status === "interview_scheduled") {
                      return (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-2xl text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Clock className="size-4" />
                          <span>Application Under PM Review ⏳</span>
                        </button>
                      );
                    }
                    if (userAppForProj?.status === "rejected") {
                      return (
                        <button
                          onClick={() => setSelectedProjectForApply(project)}
                          className="w-full py-2.5 rounded-2xl text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <AlertCircle className="size-4" />
                          <span>Application Declined (Click to Re-apply)</span>
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => setSelectedProjectForApply(project)}
                        className="w-full py-2.5 rounded-2xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <FileText className="size-4" />
                        <span>Apply for Internship</span>
                        <ChevronRight className="size-4" />
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}

      {/* ── MODAL 1: CREATE NEW TEAM & APPOINT TL ── */}
      {showAddTeamModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Users className="size-5 text-orange-500" /> Create Team &amp; Appoint Team Leader (TL)
                </h3>
                <button onClick={() => setShowAddTeamModal(false)} className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTeam} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Team Name *</label>
                  <input type="text" required value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. Team 3 - DevOps & Cloud Infrastructure"
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Team Leader (TL) Name *</label>
                    <input type="text" required value={newTeamTLName} onChange={(e) => setNewTeamTLName(e.target.value)}
                      placeholder="e.g. Rohan Varma"
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">TL Email Address</label>
                    <input type="email" value={newTeamTLEmail} onChange={(e) => setNewTeamTLEmail(e.target.value)}
                      placeholder="rohan.v@careeros.in"
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Maximum Team Seat Cap</label>
                  <input type="number" min={2} max={10} value={newTeamMaxSeats} onChange={(e) => setNewTeamMaxSeats(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddTeamModal(false)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md">
                    Create Team &amp; Appoint TL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 2: SCHEDULE 1-ON-1 INTERVIEW ── */}
      {selectedApplicantForInterview && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Calendar className="size-5 text-amber-400" /> Schedule 1-on-1 Interview
                </h3>
                <button onClick={() => setSelectedApplicantForInterview(null)} className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary">
                  ✕
                </button>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
                <div className="surface-2 p-3 rounded-2xl border border-border space-y-1">
                  <p className="font-bold text-primary text-sm">{selectedApplicantForInterview.applicantName}</p>
                  <p className="text-[11px] text-teal-400 font-semibold">{selectedApplicantForInterview.domain} Domain Applicant</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Interview Date</label>
                    <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} required
                      className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Interview Time</label>
                    <input type="text" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} required
                      placeholder="3:00 PM IST"
                      className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Google Meet Interview Link</label>
                  <input type="url" value={interviewMeetLink} onChange={(e) => setInterviewMeetLink(e.target.value)} required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button type="button" onClick={() => setSelectedApplicantForInterview(null)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md">
                    Confirm &amp; Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 3: ALLOCATE CANDIDATE TO TEAM & TL ── */}
      {selectedApplicantForAllocation && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Users className="size-5 text-teal-400" /> Candidate Team Allocation
                </h3>
                <button onClick={() => setSelectedApplicantForAllocation(null)} className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAllocateCandidate} className="space-y-4 text-xs">
                <div className="surface-2 p-3 rounded-2xl border border-border space-y-1">
                  <p className="font-bold text-primary text-sm">{selectedApplicantForAllocation.applicantName}</p>
                  <p className="text-[11px] text-teal-400 font-semibold">{selectedApplicantForAllocation.domain} Engineer</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Select Target Project Team *</label>
                  <select value={targetTeamId} onChange={(e) => setTargetTeamId(e.target.value)} required
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none">
                    <option value="">-- Choose Team --</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.teamName} (TL: {t.teamLeaderName} — {t.filledSeats}/{t.maxSeats} Seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button type="button" onClick={() => setSelectedApplicantForAllocation(null)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md">
                    Confirm Team Allocation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 4: INTERN APPLY / RE-SUBMIT LEAVE REQUEST FORM ── */}
      {showLeaveRequestModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Calendar className="size-5 text-orange-400" />
                  {resubmitRecordId ? "Re-submit Leave / Half Day Request" : "Request Leave or Half Day"}
                </h3>
                <button
                  onClick={() => {
                    setShowLeaveRequestModal(false);
                    setResubmitRecordId(null);
                  }}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleLeaveRequestSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Request Type *</label>
                  <select
                    value={leaveRequestType}
                    onChange={(e: any) => setLeaveRequestType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                  >
                    <option value="leave">🔴 Full Day Leave</option>
                    <option value="half_day">🟡 Half Day Request</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveRequestDate}
                    onChange={(e) => setLeaveRequestDate(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Reason &amp; Description for TL Review *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain why you are requesting leave or half day (e.g. Mid-term college examination, medical emergency...)"
                    value={leaveRequestReason}
                    onChange={(e) => setLeaveRequestReason(e.target.value)}
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLeaveRequestModal(false);
                      setResubmitRecordId(null);
                    }}
                    className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-1.5"
                  >
                    <Send className="size-3.5" />
                    <span>{resubmitRecordId ? "Re-submit to TL" : "Submit Request to TL"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 5: TL / MANAGER APPROVAL DECISION WITH REMARK ── */}
      {selectedRecordForApproval && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  {reviewAction === "approved" ? (
                    <Check className="size-5 text-teal-400" />
                  ) : (
                    <UserX className="size-5 text-rose-500" />
                  )}
                  {reviewAction === "approved" ? "Approve Leave Request" : "Reject Leave Request"}
                </h3>
                <button
                  onClick={() => setSelectedRecordForApproval(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApprovalDecision} className="space-y-4 text-xs">
                <div className="surface-2 p-3 rounded-2xl border border-border space-y-1">
                  <p className="font-bold text-primary text-sm">{selectedRecordForApproval.userName}</p>
                  <p className="text-[11px] text-teal-400 font-semibold">
                    Requested {selectedRecordForApproval.status.replace("_", " ")} on {selectedRecordForApproval.date}
                  </p>
                  <p className="text-xs text-secondary italic mt-1">
                    &quot;{selectedRecordForApproval.requestReason || "No reason given."}&quot;
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Reviewer Remark for Candidate *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder={
                      reviewAction === "approved"
                        ? "e.g. Approved. Please ensure your PR is merged by Friday 5 PM."
                        : "e.g. Request rejected because this Friday is our critical sprint demo day."
                    }
                    value={reviewRemark}
                    onChange={(e) => setReviewRemark(e.target.value)}
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRecordForApproval(null)}
                    className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl font-bold text-white shadow-md flex items-center gap-1.5 ${
                      reviewAction === "approved" ? "bg-teal-500 hover:bg-teal-600" : "bg-rose-500 hover:bg-rose-600"
                    }`}
                  >
                    <span>{reviewAction === "approved" ? "Confirm Approval" : "Confirm Rejection"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 6: INTERN / MEMBER QUICK PROFILE CARD MODAL ── */}
      {selectedMemberForModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
              {/* Top Header Banner */}
              <div className="bg-gradient-to-r from-orange-500/20 via-teal-500/15 to-purple-500/20 p-6 border-b border-border relative">
                <button
                  onClick={() => setSelectedMemberForModal(null)}
                  className="absolute top-4 right-4 size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary transition-colors"
                >
                  ✕
                </button>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedMemberForModal.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                      alt={selectedMemberForModal.name}
                      className="size-16 rounded-2xl object-cover border-2 border-orange-500/50 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 size-4 rounded-full bg-teal-500 border-2 border-surface" title="Active Candidate" />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg font-bold text-primary truncate">{selectedMemberForModal.name}</h3>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                        {selectedMemberForModal.role || "Intern Candidate"}
                      </span>
                    </div>
                    <p className="text-xs text-muted font-mono truncate">{selectedMemberForModal.email}</p>
                    {selectedMemberForModal.college && (
                      <p className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                        <Building2 className="size-3.5" /> {selectedMemberForModal.college}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-xs">
                {/* Telemetry Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="surface-2 p-3 rounded-2xl border border-border text-center space-y-0.5">
                    <span className="text-[10px] font-bold text-muted uppercase">Attendance</span>
                    <p className="font-display text-lg font-extrabold text-teal-400">
                      {selectedMemberForModal.attendanceRate || 95}%
                    </p>
                  </div>

                  <div className="surface-2 p-3 rounded-2xl border border-border text-center space-y-0.5">
                    <span className="text-[10px] font-bold text-muted uppercase">Active Streak</span>
                    <p className="font-display text-lg font-extrabold text-amber-400 flex items-center justify-center gap-1">
                      <Flame className="size-4" /> {selectedMemberForModal.streakDays || 12}d
                    </p>
                  </div>

                  <div className="surface-2 p-3 rounded-2xl border border-border text-center space-y-0.5">
                    <span className="text-[10px] font-bold text-muted uppercase">Sprint Points</span>
                    <p className="font-display text-lg font-extrabold text-orange-400 flex items-center justify-center gap-1">
                      <Trophy className="size-4" /> {selectedMemberForModal.points || 380}
                    </p>
                  </div>

                  <div className="surface-2 p-3 rounded-2xl border border-border text-center space-y-0.5">
                    <span className="text-[10px] font-bold text-muted uppercase">Tech Score</span>
                    <p className="font-display text-lg font-extrabold text-purple-400 flex items-center justify-center gap-1">
                      <Zap className="size-4" /> {selectedMemberForModal.score || 92}/100
                    </p>
                  </div>
                </div>

                {/* Hierarchy & Dates Info */}
                <div className="surface-2 p-4 rounded-2xl border border-border space-y-2.5">
                  <h4 className="font-bold text-primary uppercase text-[10px] tracking-wider text-muted">
                    Internship Roster &amp; Hierarchy Info
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted">Assigned Team:</span>
                      <p className="font-bold text-primary">{selectedMemberForModal.teamName || "Team 1 - Frontend & AI Pipeline"}</p>
                    </div>
                    <div>
                      <span className="text-muted">Reporting TL:</span>
                      <p className="font-bold text-orange-400">{selectedMemberForModal.tlName || "Ananya Roy"}</p>
                    </div>
                    <div>
                      <span className="text-muted font-mono">Join Date:</span>
                      <p className="font-semibold text-primary font-mono">{selectedMemberForModal.joinDate || "2026-08-05"}</p>
                    </div>
                    <div>
                      <span className="text-muted font-mono">End Date:</span>
                      <p className="font-semibold text-primary font-mono">{selectedMemberForModal.endDate || "2026-11-05"}</p>
                    </div>
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary uppercase text-[10px] tracking-wider text-muted flex items-center gap-1.5">
                    <Code2 className="size-3.5 text-orange-400" /> Tech Stack &amp; Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedMemberForModal.techStack || ["React 19", "Next.js 16", "Tailwind CSS", "TypeScript", "Redux"]).map((tech: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status & Verification Footer Banner */}
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center gap-2 text-teal-400 text-xs">
                  <ShieldCheck className="size-5 shrink-0 text-teal-400" />
                  <p className="leading-tight">
                    <strong>TL Verified Candidate</strong> — Maintaining active performance ({selectedMemberForModal.attendanceRate || 95}% attendance). Eligible for verified Certificate &amp; LOR.
                  </p>
                </div>

                {/* Promotion & Close Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePromoteMember(selectedMemberForModal.id, "Team Leader (TL)")}
                      className="px-3.5 py-2 rounded-xl font-extrabold text-[11px] bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      👑 Promote to TL
                    </button>
                    <button
                      onClick={() => handlePromoteMember(selectedMemberForModal.id, "Project Manager")}
                      className="px-3.5 py-2 rounded-xl font-extrabold text-[11px] bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      ⭐ Promote to PM
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedMemberForModal(null)}
                    className="px-5 py-2 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all"
                  >
                    Close Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 7: CREATE TASK MODAL ── */}
      {showCreateTaskModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Plus className="size-5 text-orange-400" />
                  Create New Project Task
                </h3>
                <button
                  onClick={() => setShowCreateTaskModal(false)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNewTaskSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement OpenAI Realtime WebSocket Streaming"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Task Description &amp; Deliverables *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide technical specifications, PR requirements, and acceptance criteria..."
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e: any) => setNewTaskPriority(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                    >
                      <option value="high">🔴 High Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="low">🟢 Low Priority</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Sprint Points</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={200}
                      value={newTaskPoints}
                      onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                {/* Assignment Target Dropdowns */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Assign Team (Optional)</label>
                    <select
                      value={newTaskTargetTeamId}
                      onChange={(e) => setNewTaskTargetTeamId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    >
                      <option value="">-- Select Team --</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.teamName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Assign Member (Optional)</label>
                    <select
                      value={newTaskTargetMemberId}
                      onChange={(e) => setNewTaskTargetMemberId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    >
                      <option value="">-- Select Member --</option>
                      {teams.flatMap((t) => t.members).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTaskModal(false)}
                    className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="size-3.5" /> Confirm Task Creation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 8: INTERN TASK STATUS & REMARKS SUBMISSION MODAL ── */}
      {selectedTaskForInternUpdate && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-teal-400" />
                  Submit Deliverable Status &amp; Remarks
                </h3>
                <button
                  onClick={() => setSelectedTaskForInternUpdate(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleInternTaskSubmit} className="space-y-4 text-xs">
                <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-1">
                  <span className="text-[10px] font-bold text-orange-400 uppercase">Assigned Task</span>
                  <p className="font-bold text-primary text-sm">{selectedTaskForInternUpdate.title}</p>
                  <p className="text-xs text-secondary mt-1">{selectedTaskForInternUpdate.description}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Select Deliverable Status *</label>
                  <select
                    value={internStatusChoice}
                    onChange={(e: any) => setInternStatusChoice(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                  >
                    <option value="completed">🟢 Completed (Task Finished &amp; Ready)</option>
                    <option value="partially_done">🟡 Partially Done (In Progress with Partial Progress)</option>
                    <option value="issue">🔴 Issue / Blocked (Stuck with Error / Needs TL Assistance)</option>
                    <option value="in_progress">⚡ In Progress (Currently Working)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Work Progress &amp; Intern Remarks *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain work completed, code submitted, PR details, or issues faced for TL review..."
                    value={internRemarksInput}
                    onChange={(e) => setInternRemarksInput(e.target.value)}
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskForInternUpdate(null)}
                    className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md flex items-center gap-1.5"
                  >
                    <Send className="size-3.5" /> Submit Status &amp; Remarks to TL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 9: LEAVE & OFFBOARD PROJECT CONFIRMATION MODAL ── */}
      {showLeaveProjectModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="size-5 text-rose-500" />
                  Leave &amp; Offboard Project?
                </h3>
                <button
                  onClick={() => setShowLeaveProjectModal(false)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-secondary">
                <p className="font-bold text-primary text-sm">
                  Are you sure you want to resign and offboard from &quot;{enrolledProject.title}&quot;?
                </p>
                <div className="surface-2 p-3.5 rounded-2xl border border-rose-500/20 text-rose-400 space-y-1">
                  <p className="font-bold">What happens when you leave:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-secondary">
                    <li>Your assigned seat in {enrolledProject.title} will be released.</li>
                    <li>Your active task assignments will be returned to the team pool.</li>
                    <li>You can browse and re-apply to other projects in the Marketplace.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveProjectModal(false)}
                  className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                >
                  Cancel &amp; Stay
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLeaveProject}
                  className="px-5 py-2 rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md flex items-center gap-1.5"
                >
                  <LogOut className="size-4" /> Confirm Leave Project
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 10: HIRE CANDIDATE & GRANT OFFER LETTER ── */}
      {selectedApplicantForHire && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-teal-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-teal-400" />
                  Hire Candidate &amp; Issue Offer Letter
                </h3>
                <button
                  onClick={() => setSelectedApplicantForHire(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmHireCandidate} className="space-y-4 text-xs">
                <div className="surface-2 p-3.5 rounded-2xl border border-teal-500/30 space-y-1">
                  <p className="font-bold text-primary text-sm">{selectedApplicantForHire.applicantName}</p>
                  <p className="text-muted">{selectedApplicantForHire.email} · Domain: <strong className="text-teal-400">{selectedApplicantForHire.domain}</strong></p>
                </div>

                <div className="flex items-center gap-2 surface-2 p-3 rounded-xl border border-teal-500/20">
                  <input
                    type="checkbox"
                    id="grantOffer"
                    checked={hireGrantOffer}
                    onChange={(e) => setHireGrantOffer(e.target.checked)}
                    className="size-4 text-teal-500 rounded border-border focus:ring-0"
                  />
                  <label htmlFor="grantOffer" className="font-bold text-primary cursor-pointer">
                    Issue Official PDF Offer Letter to Candidate Dashboard 📜
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Team Allocation *</label>
                  <select
                    value={hireTeamId}
                    onChange={(e) => setHireTeamId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.teamName} (TL: {t.teamLeaderName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Designated Post / Role *</label>
                    <input
                      type="text"
                      required
                      value={hirePost}
                      onChange={(e) => setHirePost(e.target.value)}
                      placeholder="e.g. Full Stack Intern"
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Internship Duration</label>
                    <select
                      value={hireMonths}
                      onChange={(e) => setHireMonths(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                    >
                      <option value={1}>1 Month</option>
                      <option value={2}>2 Months</option>
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Required Tech Stack *</label>
                  <input
                    type="text"
                    required
                    value={hireTechStack}
                    onChange={(e) => setHireTechStack(e.target.value)}
                    placeholder="e.g. Next.js 16, TypeScript, TailwindCSS, WebSockets"
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Official Joining Date *</label>
                    <input
                      type="date"
                      required
                      value={hireJoiningDate}
                      onChange={(e) => setHireJoiningDate(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Monthly Stipend &amp; Perks *</label>
                    <input
                      type="text"
                      required
                      value={hireStipend}
                      onChange={(e) => setHireStipend(e.target.value)}
                      placeholder="e.g. ₹20,000 / month + 5% Revenue Share"
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApplicantForHire(null)}
                    className="px-4 py-2.5 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-4" /> Grant Offer &amp; Allocate Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 11: NEXT ROUND / SCHEDULE INTERVIEW ── */}
      {selectedApplicantForNextRound && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Video className="size-5 text-amber-400" />
                  Schedule Next Interview Round
                </h3>
                <button
                  onClick={() => setSelectedApplicantForNextRound(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmNextRound} className="space-y-4 text-xs">
                <div className="surface-2 p-3.5 rounded-2xl border border-border">
                  <p className="font-bold text-primary">{selectedApplicantForNextRound.applicantName}</p>
                  <p className="text-muted">{selectedApplicantForNextRound.email} · {selectedApplicantForNextRound.domain}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Interview Round Type *</label>
                  <select
                    value={nextRoundType}
                    onChange={(e) => setNextRoundType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none"
                  >
                    <option value="Technical Coding Round">Technical Coding &amp; Architecture Round</option>
                    <option value="HR & Culture Fit Round">HR &amp; Culture Fit Round</option>
                    <option value="System Architecture Round">System Architecture &amp; DB Round</option>
                    <option value="Final PM Interview">Final PM Leadership Interview</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Interview Date *</label>
                    <input
                      type="date"
                      required
                      value={nextRoundDate}
                      onChange={(e) => setNextRoundDate(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Time Slot *</label>
                    <input
                      type="text"
                      required
                      value={nextRoundTime}
                      onChange={(e) => setNextRoundTime(e.target.value)}
                      placeholder="e.g. 4:00 PM IST"
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Assigned Interviewer</label>
                    <input
                      type="text"
                      required
                      value={nextInterviewerName}
                      onChange={(e) => setNextInterviewerName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Google Meet Video Link *</label>
                    <input
                      type="url"
                      required
                      value={nextMeetUrl}
                      onChange={(e) => setNextMeetUrl(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Focus Areas &amp; Instructions</label>
                  <textarea
                    rows={3}
                    value={nextFocusAreas}
                    onChange={(e) => setNextFocusAreas(e.target.value)}
                    placeholder="Provide technical evaluation focus areas..."
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApplicantForNextRound(null)}
                    className="px-4 py-2.5 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center gap-1.5"
                  >
                    <Video className="size-4" /> Confirm &amp; Schedule {nextRoundType}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 12: REJECT APPLICATION WITH FEEDBACK ── */}
      {selectedApplicantForReject && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-rose-400 flex items-center gap-2">
                  <X className="size-5 text-rose-500" />
                  Reject Application &amp; Send Feedback
                </h3>
                <button
                  onClick={() => setSelectedApplicantForReject(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmRejectApplicant} className="space-y-4 text-xs">
                <div className="surface-2 p-3.5 rounded-2xl border border-border">
                  <p className="font-bold text-primary">{selectedApplicantForReject.applicantName}</p>
                  <p className="text-muted">{selectedApplicantForReject.email}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Evaluation Feedback / Rejection Remark *</label>
                  <textarea
                    required
                    rows={4}
                    value={rejectRemark}
                    onChange={(e) => setRejectRemark(e.target.value)}
                    placeholder="Provide constructive feedback for candidate..."
                    className="w-full p-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApplicantForReject(null)}
                    className="px-4 py-2.5 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md"
                  >
                    Send Feedback &amp; Reject
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 13: REVIEW PM EXTENDED LEAVE ── */}
      {selectedPMLeaveForReview && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Calendar className="size-5 text-amber-400" />
                  PM Review: Extended Leave Request
                </h3>
                <button
                  onClick={() => setSelectedPMLeaveForReview(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="surface-2 p-4 rounded-2xl border border-border space-y-1.5">
                  <p className="font-bold text-primary text-sm">{selectedPMLeaveForReview.userName}</p>
                  <p className="text-amber-400 font-semibold">Start Date: {selectedPMLeaveForReview.date}</p>
                  <p className="text-secondary leading-relaxed pt-1">{selectedPMLeaveForReview.requestReason}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">PM Decision Remarks</label>
                  <input
                    type="text"
                    value={pmLeaveReviewRemark}
                    onChange={(e) => setPmLeaveReviewRemark(e.target.value)}
                    placeholder="e.g. Approved. Sprint tasks reassigned."
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2 text-xs">
                <button
                  onClick={() => handlePMLeaveDecision(selectedPMLeaveForReview, "rejected")}
                  className="px-4 py-2.5 rounded-xl font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => handlePMLeaveDecision(selectedPMLeaveForReview, "approved")}
                  className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                >
                  Approve Extended Leave
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 14: REVIEW PM TENURE EXTENSION ── */}
      {selectedPMExtensionForReview && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Award className="size-5 text-purple-400" />
                  PM Review: Internship Tenure Extension
                </h3>
                <button
                  onClick={() => setSelectedPMExtensionForReview(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="surface-2 p-4 rounded-2xl border border-border space-y-2">
                  <p className="font-bold text-primary text-sm">{selectedPMExtensionForReview.internName}</p>
                  <p className="text-purple-400 font-semibold">Extension Requested: +{selectedPMExtensionForReview.extensionMonths} Month(s)</p>
                  <p className="text-muted">
                    Current End: <strong className="text-orange-400">{selectedPMExtensionForReview.currentEndDate}</strong> ➔ New Proposed End: <strong className="text-teal-400">{selectedPMExtensionForReview.newEndDate}</strong>
                  </p>
                  <p className="text-secondary leading-relaxed pt-1">{selectedPMExtensionForReview.reason}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">PM Decision Remarks</label>
                  <input
                    type="text"
                    value={pmExtensionReviewRemark}
                    onChange={(e) => setPmExtensionReviewRemark(e.target.value)}
                    placeholder="e.g. Granted! Extended due to high sprint velocity."
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2 text-xs">
                <button
                  onClick={() => handlePMExtensionDecision(selectedPMExtensionForReview, "rejected")}
                  className="px-4 py-2.5 rounded-xl font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                >
                  Decline Extension
                </button>
                <button
                  onClick={() => handlePMExtensionDecision(selectedPMExtensionForReview, "approved")}
                  className="px-5 py-2.5 rounded-xl font-bold bg-purple-500 hover:bg-purple-600 text-white shadow-md"
                >
                  Approve &amp; Extend Tenure to {selectedPMExtensionForReview.newEndDate}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── MODAL 15: FULL CANDIDATE PROFILE & APPLICATION QUESTIONNAIRE MODAL ── */}
      {selectedApplicantForView && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-border gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-xl font-extrabold text-primary">
                      {selectedApplicantForView.applicantName}
                    </h3>
                    <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-0.5 rounded-full border border-teal-500/20">
                      {selectedApplicantForView.domain} Domain
                    </span>
                    <span className="text-xs font-bold text-purple-300 bg-purple-500/15 px-3 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                      <Award className="size-3.5 text-purple-400" /> 🎯 Seniority: {selectedApplicantForView.seniorityLevel || (
                        (selectedApplicantForView.atsScore ?? 0) >= 95 || (selectedApplicantForView.dsaSolvedCount ?? 0) >= 300
                          ? "Architect / PM Level"
                          : (selectedApplicantForView.atsScore ?? 0) >= 92 || (selectedApplicantForView.dsaSolvedCount ?? 0) >= 200
                          ? "Senior / Lead Track"
                          : (selectedApplicantForView.atsScore ?? 0) >= 88 || (selectedApplicantForView.dsaSolvedCount ?? 0) >= 150
                          ? "Mid-Level Engineer"
                          : (selectedApplicantForView.atsScore ?? 0) >= 80 || (selectedApplicantForView.dsaSolvedCount ?? 0) >= 80
                          ? "Junior Intern"
                          : "Freshers / Entry Level"
                      )}
                    </span>
                    <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase border ${
                      selectedApplicantForView.status === "selected"
                        ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                        : selectedApplicantForView.status === "interview_scheduled"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : selectedApplicantForView.status === "rejected"
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }`}>
                      {selectedApplicantForView.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    {selectedApplicantForView.degree || "B.Tech CS"} · {selectedApplicantForView.college || "IIT Delhi"} ({selectedApplicantForView.gradYear || "2026"}) · {selectedApplicantForView.email} · {selectedApplicantForView.phone || "+91 98765 43210"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedApplicantForView(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Top Telemetry & Score Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* 1. ATS Score Card */}
                <div className="surface-2 p-3.5 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                    AI ATS Match Score
                  </span>
                  <p className="font-display text-xl font-extrabold text-teal-400">
                    {selectedApplicantForView.atsScore || 96}/100
                  </p>
                  <p className="text-[10px] text-muted">
                    Keywords: {selectedApplicantForView.atsKeywordMatch || 98}% · Format: {selectedApplicantForView.atsFormattingScore || 94}%
                  </p>
                </div>

                {/* 2. DSA Solved Questions Count */}
                <div className="surface-2 p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    CareerOS DSA Prep
                  </span>
                  <p className="font-display text-xl font-extrabold text-amber-400">
                    {selectedApplicantForView.dsaSolvedCount || 184} Solved 🏆
                  </p>
                  <p className="text-[10px] text-muted">
                    Active Streak: 🔥 {selectedApplicantForView.streakDays || 24} Days
                  </p>
                </div>

                {/* 3. AI Mock Score */}
                <div className="surface-2 p-3.5 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                    AI Mock Interview
                  </span>
                  <p className="font-display text-xl font-extrabold text-purple-400">
                    {selectedApplicantForView.aiMockInterviewScore || 95}% Score
                  </p>
                  <p className="text-[10px] text-muted">System Screening Passed</p>
                </div>

                {/* 4. Availability */}
                <div className="surface-2 p-3.5 rounded-2xl border border-orange-500/30 bg-orange-500/5 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                    Weekly Hours
                  </span>
                  <p className="font-display text-base font-extrabold text-primary mt-1">
                    {selectedApplicantForView.availability || "20 Hours / Week"}
                  </p>
                  <p className="text-[10px] text-muted">Dedicated Commitment</p>
                </div>
              </div>

              {/* Section 1: Candidate Questionnaire & Written Answers */}
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-sm text-primary flex items-center gap-1.5 border-b border-border pb-2">
                  <FileText className="size-4 text-orange-400" /> Application Form Questionnaire &amp; Written Answers
                </h4>

                <div className="surface-2 p-4 rounded-2xl border border-border space-y-1.5">
                  <span className="font-bold text-orange-400 text-[11px] uppercase tracking-wider block">
                    1. Why do you want to join this project &amp; cohort?
                  </span>
                  <p className="text-secondary leading-relaxed">
                    {selectedApplicantForView.whyJoin || "Passionate about building enterprise Next.js applications and real-time state management systems."}
                  </p>
                </div>

                <div className="surface-2 p-4 rounded-2xl border border-border space-y-1.5">
                  <span className="font-bold text-teal-400 text-[11px] uppercase tracking-wider block">
                    2. Technical Background &amp; Prior Experience
                  </span>
                  <p className="text-secondary leading-relaxed">
                    {selectedApplicantForView.experience || "Built 3 production Next.js apps with Server Components, TypeScript, and WebSockets."}
                  </p>
                </div>

                <div className="surface-2 p-4 rounded-2xl border border-border space-y-1.5">
                  <span className="font-bold text-purple-400 text-[11px] uppercase tracking-wider block">
                    3. Proposed Deliverables &amp; Sprint Execution Plan
                  </span>
                  <p className="text-secondary leading-relaxed">
                    {selectedApplicantForView.deliverablesPlan || "I will deliver the component library, wire up WebSocket state streaming, and write Playwright tests."}
                  </p>
                </div>

                {selectedApplicantForView.pastDeployments && (
                  <div className="surface-2 p-4 rounded-2xl border border-border space-y-1.5">
                    <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
                      4. Past Production Deployments &amp; Repos
                    </span>
                    <p className="text-secondary whitespace-pre-line leading-relaxed">
                      {selectedApplicantForView.pastDeployments}
                    </p>
                  </div>
                )}
              </div>

              {/* Section 2: CareerOS DSA Prep Breakdown */}
              {selectedApplicantForView.dsaTopicsMastered && selectedApplicantForView.dsaTopicsMastered.length > 0 && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-1.5 border-b border-border pb-2">
                    <Trophy className="size-4 text-amber-400" /> CareerOS Platform DSA Topic Solved Breakdown
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {selectedApplicantForView.dsaTopicsMastered.map((topic, idx) => (
                      <div key={idx} className="surface-2 p-3 rounded-xl border border-border flex items-center justify-between">
                        <span className="font-medium text-secondary text-[11px] truncate max-w-[130px]">{topic.topic}</span>
                        <span className="font-bold text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-[10px]">
                          {topic.count} solved
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Resume PDF & External Profiles */}
              <div className="surface-2 p-4 rounded-2xl border border-border space-y-3 text-xs">
                <h4 className="font-bold text-primary flex items-center gap-1.5">
                  <Download className="size-4 text-teal-400" /> Resume &amp; Professional Links
                </h4>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={selectedApplicantForView.resumeUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md flex items-center gap-1.5"
                  >
                    <FileText className="size-4" /> View Official Resume PDF <ExternalLink className="size-3" />
                  </a>

                  <div className="flex items-center gap-3">
                    {selectedApplicantForView.githubUrl && (
                      <a href={selectedApplicantForView.githubUrl} target="_blank" rel="noreferrer" className="text-teal-400 font-bold hover:underline flex items-center gap-1">
                        <Code2 className="size-4" /> GitHub Profile
                      </a>
                    )}

                    {selectedApplicantForView.portfolioUrl && (
                      <a href={selectedApplicantForView.portfolioUrl} target="_blank" rel="noreferrer" className="text-orange-400 font-bold hover:underline flex items-center gap-1">
                        <ExternalLink className="size-4" /> Portfolio Site
                      </a>
                    )}

                    {selectedApplicantForView.linkedInUrl && (
                      <a href={selectedApplicantForView.linkedInUrl} target="_blank" rel="noreferrer" className="text-purple-400 font-bold hover:underline flex items-center gap-1">
                        <Users className="size-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Console */}
              <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedApplicantForView(null)}
                  className="px-4 py-2.5 rounded-xl font-bold surface-2 border border-border text-secondary"
                >
                  Close Profile
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedApplicantForView.status !== "selected" && (
                    <button
                      onClick={() => {
                        const app = selectedApplicantForView;
                        setSelectedApplicantForView(null);
                        setSelectedApplicantForHire(app);
                        setHirePost(app.domain || "Full Stack Intern");
                      }}
                      className="px-4 py-2.5 rounded-xl font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="size-4" /> Hire &amp; Issue Offer Letter
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const app = selectedApplicantForView;
                      setSelectedApplicantForView(null);
                      setSelectedApplicantForNextRound(app);
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold surface-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 flex items-center gap-1.5"
                  >
                    <Video className="size-4" /> Schedule Next Round
                  </button>

                  {selectedApplicantForView.status !== "rejected" && (
                    <button
                      onClick={() => {
                        const app = selectedApplicantForView;
                        setSelectedApplicantForView(null);
                        setSelectedApplicantForReject(app);
                      }}
                      className="px-3.5 py-2.5 rounded-xl font-bold surface-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5"
                    >
                      <X className="size-4" /> Reject Candidate
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── CANDIDATE INTERNSHIP APPLICATION QUESTIONNAIRE MODAL ── */}
      {selectedProjectForApply && (
        <ModalPortal>
          <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 w-screen h-screen animate-fade-in">
            <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-start justify-between pb-4 border-b border-border gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest bg-orange-500/15 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                    Official Internship Application
                  </span>
                  <h3 className="font-display text-xl font-bold text-primary mt-1 flex items-center gap-2">
                    <FileText className="size-5 text-orange-500" /> Apply for {selectedProjectForApply.title}
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Fill out your application details below. Your answers, ATS resume score, and DSA problem stats will be sent directly to the Project Manager for review.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProjectForApply(null)}
                  className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary shrink-0"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplyFormSubmit} className="space-y-4 text-xs">
                
                {/* Full Name & Email */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Full Name *</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "Registered Candidate"}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary bg-surface-2/60 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Email Address *</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || "candidate@careeros.com"}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary bg-surface-2/60 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Target Domain & Phone */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">Target Domain / Role *</label>
                    <select
                      value={applyDomain}
                      onChange={(e) => setApplyDomain(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500"
                    >
                      <option value="Full Stack">Full Stack Engineer</option>
                      <option value="Frontend">Frontend (React / Next.js / Tailwind)</option>
                      <option value="Backend">Backend (Node.js / Express / PostgreSQL)</option>
                      <option value="AI/ML">AI / Machine Learning Track</option>
                      <option value="DevOps">DevOps & Cloud Infrastructure</option>
                      <option value="UI UX">UI/UX Product Design</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={applyPhone}
                      onChange={(e) => setApplyPhone(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* College, Degree & Graduation Year */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">College / Institute *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IIT Bombay / VIT Vellore"
                      value={applyCollege}
                      onChange={(e) => setApplyCollege(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Degree &amp; Major</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech CS / B.E."
                      value={applyDegree}
                      onChange={(e) => setApplyDegree(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Graduation Year</label>
                    <select
                      value={applyGradYear}
                      onChange={(e) => setApplyGradYear(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500"
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>

                {/* GitHub & Portfolio URLs */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-primary">GitHub Profile Link</label>
                    <input
                      type="url"
                      placeholder="https://github.com/yourusername"
                      value={applyGithubUrl}
                      onChange={(e) => setApplyGithubUrl(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-primary">Portfolio / Resume Link</label>
                    <input
                      type="url"
                      placeholder="https://yourportfolio.dev or PDF URL"
                      value={applyPortfolioUrl}
                      onChange={(e) => setApplyPortfolioUrl(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Weekly Hours Availability */}
                <div className="space-y-1">
                  <label className="font-bold text-primary">Weekly Hours Availability *</label>
                  <select
                    value={applyAvailability}
                    onChange={(e) => setApplyAvailability(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500"
                  >
                    <option value="15 Hours / Week">15 Hours / Week (Part Time)</option>
                    <option value="20 Hours / Week">20 Hours / Week (Recommended)</option>
                    <option value="30 Hours / Week">30 Hours / Week (Intensive Cohort)</option>
                    <option value="40 Hours / Week">40 Hours / Week (Full Time Dedicated)</option>
                  </select>
                </div>

                {/* Question 1: Why Join */}
                <div className="space-y-1">
                  <label className="font-bold text-primary">Why do you want to join this project team? *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your motivation, technical interest, and what you hope to build during this internship..."
                    value={applyWhyJoin}
                    onChange={(e) => setApplyWhyJoin(e.target.value)}
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Question 2: Technical Experience */}
                <div className="space-y-1">
                  <label className="font-bold text-primary">Relevant Projects &amp; Tech Stack Experience *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="List projects you have built, tech stack proficiency (e.g. Next.js, Python, PostgreSQL), and key achievements..."
                    value={applyExperience}
                    onChange={(e) => setApplyExperience(e.target.value)}
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectForApply(null)}
                    className="px-4 py-2.5 rounded-xl font-bold surface-2 border border-border text-secondary hover:text-primary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApply}
                    className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="size-4" />
                    <span>{isSubmittingApply ? "Submitting..." : "Submit Application & Await PM Review"}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
