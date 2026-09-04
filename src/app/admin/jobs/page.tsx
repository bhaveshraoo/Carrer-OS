"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Building2,
  Zap,
  Filter,
  Search,
  Sparkles,
  Settings,
  ShieldCheck,
  Globe,
  Sliders,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";
import { createClient } from "@/lib/supabase/client";

interface JobRecord {
  id: string;
  company_id: string;
  company_name: string;
  company_slug: string;
  role: string;
  domain: string;
  location: string;
  ctc_range: string;
  tech_stack: string[];
  interview_types: string[];
  application_url: string;
  last_date: string;
  status: string;
  created_at: string;
}

export default function AdminJobsManagementPage() {
  const { notify } = useNotifications();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNow, setIsFetchingNow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");

  // Auto-Fetch Settings State
  const [autoFetchEnabled, setAutoFetchEnabled] = useState(true);
  const [dailyFetchTime, setDailyFetchTime] = useState("00:00");
  const [maxJobsPerFetch, setMaxJobsPerFetch] = useState(30);
  const [maxRolesPerCompany, setMaxRolesPerCompany] = useState(2);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Add Job Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formDomain, setFormDomain] = useState("Software Engineering");
  const [formLocation, setFormLocation] = useState("Bangalore, Karnataka");
  const [formCtc, setFormCtc] = useState("₹18L - ₹30L PA");
  const [formTechStack, setFormTechStack] = useState("React, Node.js, TypeScript, PostgreSQL");
  const [formRounds, setFormRounds] = useState("Online Assessment, Technical Round 1, System Design, HR");
  const [formUrl, setFormUrl] = useState("https://careers.google.com");
  const [formLastDate, setFormLastDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );

  // Load active jobs & auto-fetch settings on mount
  useEffect(() => {
    loadJobsFromDb();
    loadSavedSettings();
  }, []);

  function loadSavedSettings() {
    try {
      const savedAuto = localStorage.getItem("careeros_auto_fetch_enabled");
      const savedTime = localStorage.getItem("careeros_daily_fetch_time");
      const savedLimit = localStorage.getItem("careeros_max_jobs_per_fetch");
      const savedCap = localStorage.getItem("careeros_max_roles_per_company");

      if (savedAuto !== null) setAutoFetchEnabled(savedAuto === "true");
      if (savedTime) setDailyFetchTime(savedTime);
      if (savedLimit) setMaxJobsPerFetch(Number(savedLimit));
      if (savedCap) setMaxRolesPerCompany(Number(savedCap));
    } catch {
      // Ignore localStorage errors
    }
  }

  async function loadJobsFromDb() {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          company:companies(name, slug)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formatted: JobRecord[] = data.map((j: any) => ({
          id: String(j.id),
          company_id: j.company_id || "comp-unknown",
          company_name: j.company?.name || j.company_name || "Company",
          company_slug: j.company?.slug || j.company_slug || "company",
          role: j.role,
          domain: j.domain || "Software Engineering",
          location: j.location || "India",
          ctc_range: j.ctc_range || "₹18L - ₹30L PA",
          tech_stack: j.tech_stack || [],
          interview_types: j.interview_types || [],
          application_url: j.application_url || "",
          last_date: j.last_date || new Date().toISOString(),
          status: j.status || "active",
          created_at: j.created_at || new Date().toISOString(),
        }));
        setJobs(formatted);
      }
    } catch (err) {
      console.error("Error loading jobs from DB:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle "Fetch Now" Trigger
  async function handleFetchNow() {
    setIsFetchingNow(true);
    notify({
      title: "🚀 Triggering Live Harvesters",
      body: "Aggregating 30+ fresh jobs across Greenhouse, Jobicy, Remotive & Lever...",
      type: "info",
    });

    try {
      const res = await fetch("/api/jobs/sync", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        notify({
          title: "✅ Auto-Fetch Complete!",
          body: `Ingested ${data.dbSyncCount || 30} fresh live tech jobs into the marketplace!`,
          type: "success",
        });
        await loadJobsFromDb();
      } else {
        notify({
          title: "❌ Ingestion Failed",
          body: data.error || "Unable to trigger live harvesters.",
          type: "error",
        });
      }
    } catch (err: any) {
      notify({
        title: "❌ Network Error",
        body: err.message || "Failed to connect to /api/jobs/sync",
        type: "error",
      });
    } finally {
      setIsFetchingNow(false);
    }
  }

  // Handle Save Auto-Fetch Settings
  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingSettings(true);

    try {
      localStorage.setItem("careeros_auto_fetch_enabled", String(autoFetchEnabled));
      localStorage.setItem("careeros_daily_fetch_time", dailyFetchTime);
      localStorage.setItem("careeros_max_jobs_per_fetch", String(maxJobsPerFetch));
      localStorage.setItem("careeros_max_roles_per_company", String(maxRolesPerCompany));

      notify({
        title: "⚡ Auto-Fetch Schedule Saved!",
        body: `Daily auto-ingestion set to ${dailyFetchTime} UTC with limit of ${maxJobsPerFetch} jobs (${maxRolesPerCompany} max roles/company).`,
        type: "success",
      });
    } catch (err: any) {
      notify({
        title: "❌ Save Failed",
        body: err.message || "Could not save settings.",
        type: "error",
      });
    } finally {
      setIsSavingSettings(false);
    }
  }

  // Handle Manual Add Job Form Submit
  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    if (!formCompany || !formRole) {
      notify({
        title: "⚠️ Required Fields Missing",
        body: "Please enter both Company Name and Job Role.",
        type: "error",
      });
      return;
    }

    setIsPublishing(true);
    try {
      const supabase = createClient();
      const compSlug = formCompany.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const compId = `comp-${compSlug}`;

      // 1. Upsert Company
      await (supabase as any).from("companies").upsert(
        {
          id: compId,
          name: formCompany,
          slug: compSlug,
          metadata: { tier: "Product Tier 1", verified: true, manual_added: true },
        },
        { onConflict: "slug" }
      );

      // 2. Insert Job
      const newJobId = `job-manual-${Date.now()}`;
      const techStackArr = formTechStack.split(",").map((s) => s.trim()).filter(Boolean);
      const roundsArr = formRounds.split(",").map((s) => s.trim()).filter(Boolean);

      const { error: jobErr } = await (supabase as any).from("jobs").insert({
        id: newJobId,
        company_id: compId,
        role: formRole,
        description: `📌 JOB OVERVIEW\n${formCompany} is hiring a ${formRole} (${formDomain}) to join their engineering team in ${formLocation}.\n\n🎯 LOCATION: ${formLocation}\n💼 CTC PACKAGE: ${formCtc}`,
        domain: formDomain,
        location: formLocation,
        ctc_range: formCtc,
        tech_stack: techStackArr,
        interview_types: roundsArr,
        application_url: formUrl,
        last_date: new Date(formLastDate).toISOString(),
        status: "active",
        created_at: new Date().toISOString(),
      });

      if (jobErr) {
        throw new Error(jobErr.message);
      }

      notify({
        title: "🎉 Job Published!",
        body: `Successfully added ${formRole} at ${formCompany} to the live job marketplace.`,
        type: "success",
      });

      // Reset Form & Reload DB
      setFormCompany("");
      setFormRole("");
      setShowAddForm(false);
      await loadJobsFromDb();
    } catch (err: any) {
      notify({
        title: "❌ Failed to Add Job",
        body: err.message || "Error inserting job into database.",
        type: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  // Delete Job from DB
  async function handleDeleteJob(jobId: string, roleName: string) {
    if (!confirm(`Are you sure you want to purge job "${roleName}"?`)) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);

      if (error) {
        notify({ title: "❌ Delete Failed", body: error.message, type: "error" });
        return;
      }

      notify({
        title: "🗑️ Job Purged",
        body: `Successfully removed "${roleName}" from database.`,
        type: "info",
      });

      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      notify({ title: "❌ Delete Error", body: err.message, type: "error" });
    }
  }

  // Filter Jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "all" || j.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 flex-wrap py-1 text-xs font-semibold backdrop-blur-md">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Admin Job Pipeline & Harvester Engine</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
              Job Ingestion & Auto-Fetch Controller
            </h1>
            <p className="mt-1 text-amber-100 max-w-2xl text-sm">
              Trigger live 30-job multi-agent harvester fetches, configure daily cron execution schedules, set company capping limits, or manually publish custom roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleFetchNow}
              disabled={isFetchingNow}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-amber-800 shadow-lg transition-all hover:bg-amber-50 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isFetchingNow ? "animate-spin" : ""}`} />
              <span>{isFetchingNow ? "Fetching 30 Jobs..." : "Fetch 30 Jobs Now"}</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-950/40 border border-white/30 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-900/60"
            >
              <Plus className="h-4 w-4" />
              <span>{showAddForm ? "Close Form" : "Add Job Manually"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active DB Jobs
            </span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {jobs.length}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Live in Marketplace</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daily Auto-Fetch
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {autoFetchEnabled ? "ACTIVE" : "PAUSED"}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Schedule: {dailyFetchTime} UTC</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Per-Fetch Limit
            </span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Sliders className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {maxJobsPerFetch} Jobs
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Max {maxRolesPerCompany} roles / company</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Harvester Status
            </span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600">
              <Globe className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              4 Agents Online
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Greenhouse, Jobicy, Remotive, Lever</span>
        </div>
      </div>

      {/* Form: Add Custom Job Manually */}
      {showAddForm && (
        <form
          onSubmit={handleAddJob}
          className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-slate-900/80 p-6 shadow-md transition-all space-y-6"
        >
          <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Custom Job Manually
              </h2>
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Instant Supabase DB Ingestion
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Databricks, Stripe"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Job Role / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Backend Engineer"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Domain / Category
              </label>
              <select
                value={formDomain}
                onChange={(e) => setFormDomain(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="AI/ML">AI / Machine Learning</option>
                <option value="Frontend">Frontend Development</option>
                <option value="Backend">Backend Development</option>
                <option value="Full Stack">Full Stack</option>
                <option value="DevOps">DevOps & Cloud</option>
                <option value="Product Management">Product Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                CTC Range
              </label>
              <input
                type="text"
                value={formCtc}
                onChange={(e) => setFormCtc(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={formLastDate}
                onChange={(e) => setFormLastDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Tech Stack Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={formTechStack}
                onChange={(e) => setFormTechStack(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Application Link / URL
              </label>
              <input
                type="url"
                required
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPublishing}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isPublishing ? "Publishing to DB..." : "Publish Job Immediately"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Auto-Fetch Settings Configurator */}
      <form
        onSubmit={handleSaveSettings}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Settings className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Daily Auto-Fetch & Ingestion Settings
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            Vercel Cron Synced
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Toggle Auto Fetch */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Auto-Fetch Daily Status
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {autoFetchEnabled ? "Enabled (ON)" : "Disabled (OFF)"}
              </span>
              <button
                type="button"
                onClick={() => setAutoFetchEnabled(!autoFetchEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoFetchEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoFetchEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Daily Schedule Time */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Daily Fetch Time (UTC)
            </label>
            <select
              value={dailyFetchTime}
              onChange={(e) => setDailyFetchTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white"
            >
              <option value="00:00">00:00 UTC (05:30 AM IST)</option>
              <option value="06:00">06:00 UTC (11:30 AM IST)</option>
              <option value="12:00">12:00 UTC (05:30 PM IST)</option>
              <option value="18:00">18:00 UTC (11:30 PM IST)</option>
            </select>
          </div>

          {/* Max Jobs Limit */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Max Jobs Limit Per Fetch
            </label>
            <select
              value={maxJobsPerFetch}
              onChange={(e) => setMaxJobsPerFetch(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white"
            >
              <option value={30}>30 Jobs (Recommended)</option>
              <option value={50}>50 Jobs</option>
              <option value={100}>100 Jobs</option>
            </select>
          </div>

          {/* Max Roles Per Company */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Max Roles Per Company
            </label>
            <select
              value={maxRolesPerCompany}
              onChange={(e) => setMaxRolesPerCompany(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white"
            >
              <option value={2}>2 Roles (Prevents Monopoly)</option>
              <option value={3}>3 Roles</option>
              <option value={5}>5 Roles</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSavingSettings}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-2.5 text-sm font-bold text-white dark:text-slate-900 shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{isSavingSettings ? "Saving Settings..." : "Save Auto-Fetch Configuration"}</span>
          </button>
        </div>
      </form>

      {/* Live Ingested Jobs Table Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Active Marketplace Jobs</span>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                {filteredJobs.length} Jobs
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live roles currently available to candidates in the job portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search company, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="all">All Domains</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Systems & Infrastructure">Systems</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mb-3 text-amber-500" />
            <p className="text-sm font-medium">Loading active database jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Jobs Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No matching jobs found in the database. Click "Fetch 30 Jobs Now" above to aggregate fresh live postings!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">CTC Package</th>
                  <th className="py-3 px-4">Apply URL</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold text-xs uppercase">
                          {job.company_name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {job.role}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {job.company_name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {job.domain}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {job.location}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {job.ctc_range}
                    </td>

                    <td className="py-3.5 px-4">
                      <a
                        href={job.application_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-amber-600 hover:underline font-semibold text-xs"
                      >
                        <span>Apply</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteJob(job.id, job.role)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                        title="Purge Job"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
