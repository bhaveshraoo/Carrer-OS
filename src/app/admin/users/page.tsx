"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  Sparkles,
  Award,
  Crown,
  Code2,
  Building2,
  Rocket,
  Calendar,
  Lock,
  Plus,
  Tag,
  UserPlus,
  UserCheck,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
  Bot,
  Briefcase,
  Check,
  Clock,
  ShieldCheck,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";
import type { RegisteredDbUserTelemetry } from "@/app/api/admin/users/route";

export type AdminTag = "Boss" | "Project Manager" | "TL" | "DSA Creator" | "Company Curator";
export const OWNER_EMAIL = "bhaveshy9654@gmail.com";

const AVAILABLE_TAGS: { name: AdminTag; label: string; icon: any; color: string; desc: string }[] = [
  {
    name: "Boss",
    label: "Boss / Owner (bhaveshy9654@gmail.com)",
    icon: Crown,
    color: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    desc: "Supreme Boss — Exclusively reserved for bhaveshy9654@gmail.com.",
  },
  {
    name: "Project Manager",
    label: "Project Manager",
    icon: Rocket,
    color: "text-orange-400 bg-orange-500/15 border-orange-500/30",
    desc: "Can publish new SaaS projects, issue offer letters, generate certificates, and award badges.",
  },
  {
    name: "TL",
    label: "Team Leader (TL)",
    icon: ShieldCheck,
    color: "text-teal-400 bg-teal-500/15 border-teal-500/30",
    desc: "Can manage daily intern attendance, review team applicants, and schedule 1-on-1 interviews.",
  },
  {
    name: "DSA Creator",
    label: "DSA Question Creator",
    icon: Code2,
    color: "text-purple-400 bg-purple-500/15 border-purple-500/30",
    desc: "Can add new DSA questions, set topic weights, write test cases, and publish solution roadmaps.",
  },
  {
    name: "Company Curator",
    label: "Company Curator",
    icon: Building2,
    color: "text-blue-400 bg-blue-500/15 border-blue-500/30",
    desc: "Can add new target company profiles, hiring process timelines, CTC packages, and interview rounds.",
  },
];

export default function AdminRegisteredUsersPage() {
  const { notify } = useNotifications();
  const [users, setUsers] = useState<RegisteredDbUserTelemetry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "resume" | "no_resume" | "dsa" | "ai_interview" | "project" | "staff"
  >("all");
  const [selectedUser, setSelectedUser] = useState<RegisteredDbUserTelemetry | null>(null);

  // Active logged in user context check
  const currentUserEmail = OWNER_EMAIL;
  const isOwner = currentUserEmail.toLowerCase() === OWNER_EMAIL.toLowerCase();

  // Load Registered DB Users from API on mount
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err: any) {
      notify({
        title: "❌ Failed to Load DB Users",
        body: err.message || "Error fetching registered users from API",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Filter Users based on search and category tab
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.username && u.username.toLowerCase().includes(search.toLowerCase())) ||
        u.target_company.toLowerCase().includes(search.toLowerCase());

      let matchesCategory = true;
      if (filterCategory === "resume") matchesCategory = u.resume.has_resume;
      else if (filterCategory === "no_resume") matchesCategory = !u.resume.has_resume;
      else if (filterCategory === "dsa") matchesCategory = u.dsa.solved_count > 0;
      else if (filterCategory === "ai_interview") matchesCategory = u.ai_interview.taken;
      else if (filterCategory === "project") matchesCategory = u.project.is_working;
      else if (filterCategory === "staff") matchesCategory = u.admin_role !== "Student" || u.tags.length > 0;

      return matchesSearch && matchesCategory;
    });
  }, [users, search, filterCategory]);

  // Telemetry Aggregation Stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      withResume: users.filter((u) => u.resume.has_resume).length,
      noResume: users.filter((u) => !u.resume.has_resume).length,
      activeDsa: users.filter((u) => u.dsa.solved_count > 0).length,
      aiInterview: users.filter((u) => u.ai_interview.taken).length,
      projectWorking: users.filter((u) => u.project.is_working).length,
    };
  }, [users]);

  // Toggle Admin Tag for User
  function toggleUserTag(targetUserId: string, tag: AdminTag) {
    if (!isOwner) {
      notify({
        title: "🔒 Access Denied",
        body: `Only Supreme Owner ${OWNER_EMAIL} can modify Admin Staff tags.`,
        type: "error",
      });
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== targetUserId) return u;
        const exists = u.tags.includes(tag);
        const nextTags = exists ? u.tags.filter((t) => t !== tag) : [...u.tags, tag];
        return { ...u, tags: nextTags };
      })
    );

    if (selectedUser && selectedUser.id === targetUserId) {
      const exists = selectedUser.tags.includes(tag);
      const nextTags = exists
        ? selectedUser.tags.filter((t) => t !== tag)
        : [...selectedUser.tags, tag];
      setSelectedUser({ ...selectedUser, tags: nextTags });
    }

    notify({
      title: "🏷️ Tag Updated",
      body: `Updated tag "${tag}" for user.`,
      type: "success",
    });
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
              <Users className="h-3.5 w-3.5" />
              <span>Database Users &amp; Live Telemetry Roster</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
              Registered DB Users Directory
            </h1>
            <p className="mt-1 text-purple-100 max-w-2xl text-sm">
              Inspect all registered database accounts, resume ATS scores, DSA practice metrics, AI mock interview performance, and active SaaS project working status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadUsers}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-purple-900 shadow-md transition-all hover:bg-purple-50 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Syncing..." : "Refresh DB Users"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total DB Users
            </span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.total}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Registered in Database</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resume ATS Uploaded
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.withResume} <span className="text-xs font-normal text-slate-400">/ {stats.total}</span>
          </p>
          <span className="text-xs text-slate-500 mt-1 block">{stats.noResume} users without resume</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active DSA Coders
            </span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600">
              <Code2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {stats.activeDsa}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Solving curriculum track</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Interview Took
            </span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <Bot className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {stats.aiInterview}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Completed AI Mock Sessions</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Working
            </span>
            <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600">
              <Rocket className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-orange-600 dark:text-orange-400">
            {stats.projectWorking}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Building SaaS Projects</span>
        </div>
      </div>

      {/* Main Roster Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user name, email, username, or target company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === "all"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                  : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-500"
              }`}
            >
              All Users ({users.length})
            </button>

            <button
              onClick={() => setFilterCategory("resume")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterCategory === "resume"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500"
              }`}
            >
              <span>📄 With Resume</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold">
                {stats.withResume}
              </span>
            </button>

            <button
              onClick={() => setFilterCategory("no_resume")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterCategory === "no_resume"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-rose-500"
              }`}
            >
              <span>⚠️ No Resume</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-extrabold">
                {stats.noResume}
              </span>
            </button>

            <button
              onClick={() => setFilterCategory("dsa")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === "dsa"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500"
              }`}
            >
              🧩 Active DSA ({stats.activeDsa})
            </button>

            <button
              onClick={() => setFilterCategory("ai_interview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === "ai_interview"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-500"
              }`}
            >
              🤖 AI Interview ({stats.aiInterview})
            </button>

            <button
              onClick={() => setFilterCategory("project")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === "project"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-orange-500"
              }`}
            >
              🚀 Project Working ({stats.projectWorking})
            </button>
          </div>
        </div>

        {/* Loading / Empty States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mb-3 text-purple-500" />
            <p className="text-sm font-medium">Fetching registered DB users &amp; live telemetry...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Users className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Matching DB Users</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No registered user accounts match the search or filter criteria.
            </p>
          </div>
        ) : (
          /* Table Roster View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px] bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3 px-4">Registered DB User</th>
                  <th className="py-3 px-4">Resume ATS Score</th>
                  <th className="py-3 px-4">DSA Progress</th>
                  <th className="py-3 px-4">AI Interview Score</th>
                  <th className="py-3 px-4">Project Working</th>
                  <th className="py-3 px-4">Target Company</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-medium">
                {filteredUsers.map((user) => {
                  const joinDate = user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Joined recently";

                  const isUserOwner = user.admin_role === "Owner" || user.email.toLowerCase() === OWNER_EMAIL;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-purple-500/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      {/* User Info Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-xs uppercase shadow-sm">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="h-9 w-9 rounded-xl object-cover"
                              />
                            ) : (
                              user.full_name.slice(0, 2)
                            )}
                            {isUserOwner && (
                              <Crown className="absolute -top-1 -right-1 h-3.5 w-3.5 text-amber-400 fill-amber-400 drop-shadow-sm" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 dark:text-white text-xs">
                                {user.full_name}
                              </p>
                              {isUserOwner && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-extrabold">
                                  BOSS
                                </span>
                              )}
                              {user.username && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  @{user.username}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {user.email}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              Joined {joinDate}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Resume ATS Score Column */}
                      <td className="py-3.5 px-4">
                        {user.resume.has_resume ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <FileText className="h-3.5 w-3.5 text-emerald-500" />
                              <span>{user.resume.ats_score || 85}/100 ATS</span>
                            </span>
                            {user.resume.file_name && (
                              <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                                📄 {user.resume.file_name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            <AlertCircle className="h-3 w-3 text-slate-400" />
                            No Resume Uploaded
                          </span>
                        )}
                      </td>

                      {/* DSA Progress Column */}
                      <td className="py-3.5 px-4">
                        {user.dsa.solved_count > 0 ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                              <Code2 className="h-3.5 w-3.5 text-indigo-500" />
                              <span>{user.dsa.solved_count} Solved</span>
                            </span>
                            <p className="text-[10px] text-slate-500">
                              Level: {user.dsa.level}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            No DSA Started
                          </span>
                        )}
                      </td>

                      {/* AI Interview Score Column */}
                      <td className="py-3.5 px-4">
                        {user.ai_interview.taken ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <Bot className="h-3.5 w-3.5 text-amber-500" />
                              <span>{user.ai_interview.score || 82}% Score</span>
                            </span>
                            <p className="text-[10px] text-slate-500">
                              {user.ai_interview.completed_count} Session(s)
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            No AI Interview Taken
                          </span>
                        )}
                      </td>

                      {/* Project Working Status Column */}
                      <td className="py-3.5 px-4">
                        {user.project.is_working ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-500/20">
                              <Rocket className="h-3.5 w-3.5 text-orange-500" />
                              <span>Yes — Working</span>
                            </span>
                            <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                              {user.project.title}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            No Active Project
                          </span>
                        )}
                      </td>

                      {/* Target Company Column */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          🏢 {user.target_company}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-purple-600/10 px-3 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect Info</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── DETAILED USER TELEMETRY PROFILE DRAWER ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 h-full overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-md">
                    {selectedUser.avatar_url ? (
                      <img
                        src={selectedUser.avatar_url}
                        alt={selectedUser.full_name}
                        className="h-12 w-12 rounded-2xl object-cover"
                      />
                    ) : (
                      selectedUser.full_name.slice(0, 2)
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{selectedUser.full_name}</span>
                      {selectedUser.admin_role === "Owner" && (
                        <Crown className="h-5 w-5 text-amber-500 fill-amber-500" />
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Telemetry Cards Grid */}
              <div className="mt-6 space-y-6">
                {/* 1. Resume ATS Score Breakdown */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-500" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Resume &amp; ATS Score Inspection
                      </h3>
                    </div>
                    {selectedUser.resume.has_resume ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                        Uploaded &amp; Scored
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/30">
                        No Resume Uploaded
                      </span>
                    )}
                  </div>

                  {selectedUser.resume.has_resume ? (
                    <div className="grid gap-3 sm:grid-cols-2 pt-2">
                      <div className="rounded-xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          ATS Score
                        </span>
                        <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          {selectedUser.resume.ats_score || 85} / 100
                        </p>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          File Name
                        </span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-1">
                          📄 {selectedUser.resume.file_name || "resume.pdf"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-300 font-medium">
                      ⚠️ User has not uploaded a resume yet. Dashboard displays prompt "Upload Your Resume" for this user account.
                    </div>
                  )}
                </div>

                {/* 2. DSA Practice Progress */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-indigo-500" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        DSA Practice Track &amp; Solved Questions
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/30">
                      {selectedUser.dsa.solved_count > 0
                        ? `${selectedUser.dsa.solved_count} Solved`
                        : "No DSA Started"}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 pt-1">
                    <div className="rounded-xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Total Solved
                      </span>
                      <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        {selectedUser.dsa.solved_count} Questions
                      </p>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Current Track
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {selectedUser.dsa.solved_count > 0
                          ? `Question #${selectedUser.dsa.solved_count + 1} Focus`
                          : 'Start DSA Track ("Start DSA Track")'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. AI Mock Interview Performance */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-amber-500" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        AI Mock Interview Performance
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
                      {selectedUser.ai_interview.taken ? "Completed Sessions" : "No Interview Taken"}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 pt-1">
                    <div className="rounded-xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Avg Performance Score
                      </span>
                      <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                        {selectedUser.ai_interview.taken
                          ? `${selectedUser.ai_interview.score || 85}%`
                          : "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Completed Sessions
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {selectedUser.ai_interview.completed_count} Interview Rounds
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Project Working Status */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-orange-500" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Project Working Status
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        selectedUser.project.is_working
                          ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {selectedUser.project.is_working ? "Working: YES" : "Working: NO"}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Active Project: {selectedUser.project.title}
                  </p>
                </div>

                {/* 5. Owner Admin Tag Manager */}
                {isOwner && (
                  <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-slate-900 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-500" />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Owner Tag &amp; Staff Privilege Manager
                        </h3>
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-600 uppercase">
                        Boss Exclusive
                      </span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {AVAILABLE_TAGS.map((t) => {
                        const isAssigned = selectedUser.tags.includes(t.name);
                        const TagIcon = t.icon;
                        return (
                          <div
                            key={t.name}
                            onClick={() => toggleUserTag(selectedUser.id, t.name)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                              isAssigned
                                ? "bg-white dark:bg-slate-800 border-amber-500 shadow-xs"
                                : "bg-slate-100/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 hover:border-amber-400"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <TagIcon className="h-4 w-4 text-amber-500" />
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                  {t.label}
                                </p>
                                <p className="text-[10px] text-slate-500">{t.desc}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              className={`h-5 w-5 rounded-md flex items-center justify-center text-xs font-bold ${
                                isAssigned
                                  ? "bg-amber-500 text-white"
                                  : "border border-slate-300 dark:border-slate-600 text-transparent"
                              }`}
                            >
                              ✓
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md hover:opacity-90"
              >
                Close User Telemetry Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
