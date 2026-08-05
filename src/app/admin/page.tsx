"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Rocket,
  Users,
  FileCheck,
  Award,
  DollarSign,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  BookOpen,
  Building2,
  FileText,
  Clock,
  RotateCcw,
  Database,
  GraduationCap,
  Percent,
  Tag,
  Key,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface SupabaseStats {
  usersCount: number;
  resumesCount: number;
  avgAtsScore: number;
  companiesCount: number;
  dsaCount: number;
  employeesCount: number;
  activeDailyUsers: number;
  offerConversionRate: number;
  proSubscriberMrr: number;
  activeInterns: number;
  internsAttendance: number;
  avgInternScore: number;
  projectsCount: number;
  applicationsCount: number;
  revenuePayouts: number;
  certsIssued: number;
}

interface RecentUser {
  id: string;
  full_name: string | null;
  username: string | null;
  created_at: string;
}

interface RecentResume {
  id: string;
  file_name: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface RecentDSA {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  created_at: string;
}

export default function AdminOverviewPage() {
  const { notify } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupabaseStats>({
    usersCount: 0,
    resumesCount: 0,
    avgAtsScore: 0,
    companiesCount: 0,
    dsaCount: 0,
    employeesCount: 0,
    activeDailyUsers: 0,
    offerConversionRate: 0,
    proSubscriberMrr: 0,
    activeInterns: 0,
    internsAttendance: 0,
    avgInternScore: 0,
    projectsCount: 0,
    applicationsCount: 0,
    revenuePayouts: 0,
    certsIssued: 0,
  });

  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentResumes, setRecentResumes] = useState<RecentResume[]>([]);
  const [recentDsa, setRecentDsa] = useState<RecentDSA[]>([]);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchSupabaseData = async () => {
    setLoading(true);
    setErrorNotice(null);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setRecentUsers(data.recentUsers || []);
        setRecentResumes(data.recentResumes || []);
        setRecentDsa(data.recentDsa || []);
      }
    } catch (err: any) {
      console.error("Error fetching Supabase admin stats", err);
      setErrorNotice("Could not connect to Supabase database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupabaseData();
  }, []);

  function handleAuthorizePayout() {
    notify({
      type: "success",
      icon: "💰",
      title: "Revenue Payout Authorized!",
      body: `Authorized 5% TL and 5% Intern team payouts. Total: ₹${stats.revenuePayouts.toLocaleString()}`,
      autoDismiss: 4000,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── 1. HERO BANNER ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 size-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <Database className="size-3.5 text-orange-500" /> Supabase Real-Time Database Connection
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Platform Command Center &amp; Live Telemetry
            </h1>
            <p className="text-xs text-secondary max-w-2xl">
              Live statistics queried directly from Supabase. Displaying users, resumes, company hiring maps, DSA questions, intern attendance, ATS averages, MRR, and revenue payouts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchSupabaseData}
              disabled={loading}
              className="px-4 py-2.5 rounded-2xl font-bold text-xs surface-2 border border-border hover:border-orange-500/40 transition-all flex items-center gap-1.5 text-secondary hover:text-primary"
            >
              <RotateCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh DB Stats
            </button>

            <Link
              href="/admin/dsa"
              className="px-4 py-2.5 rounded-2xl font-extrabold text-xs bg-orange-500 hover:bg-orange-600 text-white transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Plus className="size-4" /> Add Question
            </Link>
          </div>
        </div>
      </div>

      {errorNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>Notice: {errorNotice} All metrics default to 0 when table data is empty.</span>
        </div>
      )}

      {/* ── 2. LIVE SUPABASE 16-METRICS TELEMETRY GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* 1. REGISTERED DB USERS */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Registered DB Users</span>
            <Users className="size-4 text-orange-500" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.usersCount || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-teal-400 font-semibold">Live Supabase Users</p>
        </div>

        {/* 2. RESUMES ANALYZED */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Resumes Analyzed</span>
            <FileText className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.resumesCount || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted">ATS AI Reports</p>
        </div>

        {/* 3. TARGET COMPANIES */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Target Companies</span>
            <Building2 className="size-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.companiesCount || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-blue-400 font-semibold">Hiring Maps</p>
        </div>

        {/* 4. DSA QUESTION BANK */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">DSA Question Bank</span>
            <BookOpen className="size-4 text-purple-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.dsaCount || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-400 font-semibold">Interactive Visualizers</p>
        </div>

        {/* 5. ACTIVE DAILY USERS */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Active Daily Users</span>
            <Clock className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-teal-400">
            {loading ? "..." : (stats.activeDailyUsers || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted">Last 24h Activity</p>
        </div>

        {/* 6. AVG ATS RESUME SCORE */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Avg ATS Resume Score</span>
            <Percent className="size-4 text-orange-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-orange-400">
            {loading ? "..." : stats.avgAtsScore ? `${stats.avgAtsScore}%` : "0%"}
          </p>
          <p className="text-[11px] text-muted">Supabase AI Benchmark</p>
        </div>

        {/* 7. OFFER CONVERSION RATE */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Offer Conversion Rate</span>
            <TrendingUp className="size-4 text-emerald-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-emerald-400">
            {loading ? "..." : stats.offerConversionRate ? `${stats.offerConversionRate}%` : "0%"}
          </p>
          <p className="text-[11px] text-muted">Applications to Hired</p>
        </div>

        {/* 8. PRO SUBSCRIBER MRR */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Pro Subscriber MRR</span>
            <DollarSign className="size-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-amber-400">
            {loading ? "..." : `₹${(stats.proSubscriberMrr || 0).toLocaleString()}`}
          </p>
          <p className="text-[11px] text-muted">Monthly Recurring</p>
        </div>

        {/* 9. ACTIVE INTERNS */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Active Interns</span>
            <GraduationCap className="size-4 text-orange-500" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.activeInterns || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted">Cohort Roster</p>
        </div>

        {/* 10. INTERNS ATTENDANCE */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Interns Attendance</span>
            <CheckCircle2 className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-teal-400">
            {loading ? "..." : stats.internsAttendance ? `${stats.internsAttendance}%` : "0%"}
          </p>
          <p className="text-[11px] text-muted">Daily Attendance</p>
        </div>

        {/* 11. AVG INTERN SCORE */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Avg Intern Score</span>
            <Award className="size-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-amber-400">
            {loading ? "..." : stats.avgInternScore ? `${stats.avgInternScore}/100` : "0/100"}
          </p>
          <p className="text-[11px] text-muted">Sprint Evaluation</p>
        </div>

        {/* 12. EMPLOYEE LIST / COUNT */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Staff Employees</span>
            <Key className="size-4 text-purple-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.employeesCount || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-400 font-semibold">Granted Admin IDs</p>
        </div>

        {/* 13. PROJECTS & SEATS */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">SaaS Projects</span>
            <Rocket className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.projectsCount || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted">Seats &amp; Tech Stack</p>
        </div>

        {/* 14. APPLICATIONS */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Submitted Applications</span>
            <FileCheck className="size-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.applicationsCount || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted">Pitches Received</p>
        </div>

        {/* 15. SaaS PROJECT PAYOUTS */}
        <div className="surface p-4 rounded-3xl border border-orange-500/30 space-y-1.5 shadow-sm bg-orange-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider">SaaS Payouts (5%+5%)</span>
            <DollarSign className="size-4 text-orange-500" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : `₹${(stats.revenuePayouts || 0).toLocaleString()}`}
          </p>
          <p className="text-[11px] text-teal-400 font-semibold">TL &amp; Intern Shares</p>
        </div>

        {/* 16. CERTS & LORS ISSUED */}
        <div className="surface p-4 rounded-3xl border border-border space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Certs &amp; LORs Issued</span>
            <Award className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">
            {loading ? "..." : (stats.certsIssued || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted">Verified Badges</p>
        </div>

      </div>

      {/* ── 3. LIVE RECENT SUPABASE ACTIVITY COLUMNS ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECENT REGISTERED SUPABASE USERS */}
        <div className="surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-display text-base font-extrabold text-primary flex items-center gap-2">
              <Users className="size-4 text-orange-500" /> Recent Supabase Registered Users
            </h3>
            <span className="text-[10px] font-mono font-bold text-muted bg-surface-2 px-2.5 py-0.5 rounded-full border border-border">
              Live DB
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {recentUsers.length > 0 ? (
              recentUsers.map((u) => (
                <div key={u.id} className="surface-2 p-3.5 rounded-2xl border border-border flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-bold text-primary">{u.full_name || u.username || "Anonymous Student"}</p>
                    <p className="text-muted text-[11px]">ID: {u.id.slice(0, 18)}...</p>
                  </div>
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted text-xs">No registered users in database (count: 0).</div>
            )}
          </div>
        </div>

        {/* RECENT SUPABASE DSA QUESTIONS */}
        <div className="surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-display text-base font-extrabold text-primary flex items-center gap-2">
              <BookOpen className="size-4 text-purple-400" /> Recent Supabase DSA Questions
            </h3>
            <Link href="/admin/dsa" className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1">
              Manage Bank <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {recentDsa.length > 0 ? (
              recentDsa.map((q) => (
                <div key={q.id} className="surface-2 p-3.5 rounded-2xl border border-border flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-bold text-primary">{q.title}</p>
                    <p className="text-muted text-[11px] capitalize">Topic: {q.topic}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {q.difficulty}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted text-xs">No questions in dsa_questions table (count: 0).</div>
            )}
          </div>
        </div>

      </div>

      {/* ── 4. REVENUE SHARING LEDGER SPOTLIGHT ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 space-y-4 shadow-xl bg-orange-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <DollarSign className="size-5 text-orange-500" /> Commercial Revenue Distribution Ledger
            </h3>
            <p className="text-xs text-muted">5% Team Leader Share · 5% Equal Team Split · 90% CareerOS Platform Share</p>
          </div>

          <button
            onClick={handleAuthorizePayout}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 text-white hover:brightness-110 shadow-md flex items-center gap-1.5 shrink-0"
          >
            <CheckCircle2 className="size-3.5" /> Authorize Batch Bank Payouts
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
            <p className="text-muted font-bold uppercase text-[10px]">Total Product Sales</p>
            <p className="font-display text-2xl font-extrabold text-primary">₹{(stats.proSubscriberMrr || 0).toLocaleString()}</p>
            <p className="text-teal-400 font-semibold">Live Revenue</p>
          </div>

          <div className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
            <p className="text-muted font-bold uppercase text-[10px]">Team Leader Share (5%)</p>
            <p className="font-display text-2xl font-extrabold text-orange-400">₹{(stats.revenuePayouts / 2 || 0).toLocaleString()}</p>
            <p className="text-muted">TL Dispatches</p>
          </div>

          <div className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
            <p className="text-muted font-bold uppercase text-[10px]">Team Member Share (5% Split)</p>
            <p className="font-display text-2xl font-extrabold text-teal-400">₹{(stats.revenuePayouts / 2 || 0).toLocaleString()}</p>
            <p className="text-muted">Intern Team Dispatches</p>
          </div>
        </div>
      </div>

    </div>
  );
}
