"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";
import { useNotifications } from "@/components/notifications/notification-provider";
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Code2,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Save,
  Tag,
  Building2,
  DollarSign,
  MapPin,
  Check,
  Zap,
} from "lucide-react";

interface ProfileFormProps {
  initialFullName: string;
  initialUsername: string;
  email: string;
  provider: string;
}

export function UpgradedProfileView({
  initialFullName,
  initialUsername,
  email,
  provider,
}: ProfileFormProps) {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<"personal" | "career" | "notifications" | "security">("personal");

  // Form State
  const [fullName, setFullName] = useState(initialFullName);
  const [username, setUsername] = useState(initialUsername);
  const [targetRole, setTargetRole] = useState("SDE / Full-Stack Engineer");
  const [degree, setDegree] = useState("B.Tech Computer Science");
  const [gradYear, setGradYear] = useState("2026");
  const [salaryTarget, setSalaryTarget] = useState("₹14 - ₹30 LPA");
  const [relocation, setRelocation] = useState("Bangalore, Hyderabad, Remote");
  const [selectedStack, setSelectedStack] = useState<string[]>([
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Data Structures"
  ]);

  // Notifications toggle state
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyCompanyReminders, setNotifyCompanyReminders] = useState(true);
  const [notifyResumeUpdates, setNotifyResumeUpdates] = useState(true);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const userInitials = (fullName || username || email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const formData = new FormData();
    formData.set("fullName", fullName);
    formData.set("username", username);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        notify({
          type: "warning",
          icon: "⚠️",
          title: "Update Failed",
          body: result.error ?? "Could not save profile changes.",
          autoDismiss: 4000,
        });
      } else {
        setSaved(true);
        notify({
          type: "success",
          icon: "✨",
          title: "Profile Saved!",
          body: "Your profile details have been successfully updated.",
          autoDismiss: 3000,
        });
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  function toggleStackSkill(skill: string) {
    setSelectedStack((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">

      {/* ── 1. HERO PROFILE BANNER ── */}
      <div className="surface border border-border rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">

          {/* Left Avatar & User Meta */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
            <div className="size-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-display text-2xl font-extrabold flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0 border-2 border-surface">
              {userInitials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary">
                  {fullName || "Candidate Profile"}
                </h1>
                <span className="text-[11px] font-bold text-teal-400 bg-teal-500/10 px-3 py-0.5 rounded-full border border-teal-500/20 flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> Verified Candidate
                </span>
              </div>

              <p className="text-xs text-secondary flex items-center justify-center sm:justify-start gap-2">
                <Mail className="size-3.5 text-muted" /> {email}
                <span className="text-muted">•</span>
                <span className="text-orange-400 font-semibold">{targetRole}</span>
              </p>

              <p className="text-[11px] text-muted pt-1">
                Account Provider: <strong className="text-primary uppercase">{provider}</strong>
              </p>
            </div>
          </div>

          {/* Right Placement Status Badge */}
          <div className="surface-2 p-4 rounded-2xl border border-border flex items-center gap-4 shrink-0 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="size-3" /> Placement Readiness
              </span>
              <p className="font-display text-lg font-bold text-primary">Target 2026 Batch</p>
              <p className="text-xs text-muted">3 Companies Mapped</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. TABBED NAVIGATION BAR ── */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
        {[
          { id: "personal", label: "Personal & Academic", icon: User },
          { id: "career", label: "Target Career & Salary", icon: Briefcase },
          { id: "notifications", label: "Notifications & Alerts", icon: Bell },
          { id: "security", label: "Security & Account", icon: ShieldCheck },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                  : "text-secondary hover:text-primary surface-2 border border-transparent"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: PERSONAL & ACADEMIC PROFILE ── */}
      {activeTab === "personal" && (
        <form onSubmit={handleSubmit} className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <User className="size-5 text-orange-500" /> Personal & Academic Information
            </h3>
            <p className="text-xs text-secondary">
              Your name and username appear on your placement reports and interview evaluations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs font-bold text-primary">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="surface-2 border-border text-sm"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold text-primary">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. bhavesh_rao"
                className="surface-2 border-border text-sm font-mono"
              />
              <p className="text-[11px] text-muted">3-20 characters: letters, numbers, underscores.</p>
            </div>

            {/* Degree Program */}
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-xs font-bold text-primary">Degree & Specialization</Label>
              <div className="relative">
                <Input
                  id="degree"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="surface-2 border-border text-sm pl-9"
                />
                <GraduationCap className="size-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

            {/* Graduation Year */}
            <div className="space-y-2">
              <Label htmlFor="gradYear" className="text-xs font-bold text-primary">Graduation Year</Label>
              <select
                id="gradYear"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-sm text-primary focus:outline-none"
              >
                {["2024", "2025", "2026", "2027", "2028"].map((y) => (
                  <option key={y} value={y}>{y} Batch</option>
                ))}
              </select>
            </div>

          </div>

          {/* Primary Skills Tag Cloud Selection */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Label className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Code2 className="size-4 text-teal-400" /> Primary Tech Stack Competencies
            </Label>
            <div className="flex flex-wrap gap-2">
              {[
                "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python",
                "C++", "Java", "SQL", "PostgreSQL", "System Design", "AWS", "Docker", "Git"
              ].map((skill) => {
                const isSelected = selectedStack.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleStackSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-orange-500/15 text-orange-400 border-orange-500/40"
                        : "surface-2 text-muted border-border hover:text-primary"
                    }`}
                  >
                    {isSelected && <Check className="size-3 text-orange-400" />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          {error && <p className="text-xs font-bold text-red-500">{error}</p>}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            {saved ? (
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                <CheckCircle2 className="size-4" /> Profile Updated
              </span>
            ) : <span />}

            <Button type="submit" variant="primary" disabled={isPending} className="flex items-center gap-2">
              {isPending ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="size-4" />}
              {isPending ? "Saving Changes..." : "Save Profile Details"}
            </Button>
          </div>
        </form>
      )}

      {/* ── TAB 2: CAREER TARGETS & SALARY PREFERENCES ── */}
      {activeTab === "career" && (
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <Briefcase className="size-5 text-orange-500" /> Career Track & Placement Preferences
            </h3>
            <p className="text-xs text-secondary">
              Tune your target role requirements for company hiring maps and recommendation algorithms.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">

            {/* Target Role */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-primary">Target Placement Role</Label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-sm text-primary focus:outline-none"
              >
                <option value="SDE / Full-Stack Engineer">SDE / Full-Stack Engineer</option>
                <option value="Backend & Distributed Systems">Backend & Systems Engineer</option>
                <option value="Frontend / Mobile Developer">Frontend / Mobile Specialist</option>
                <option value="AI / ML & Data Engineer">AI / ML & Data Engineer</option>
                <option value="DevOps & Cloud Systems">DevOps & Cloud Systems</option>
              </select>
            </div>

            {/* Target Salary Band */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-primary">Preferred Salary Range (CTC)</Label>
              <div className="relative">
                <Input
                  value={salaryTarget}
                  onChange={(e) => setSalaryTarget(e.target.value)}
                  placeholder="e.g. ₹12 - ₹30 LPA"
                  className="surface-2 border-border text-sm pl-9"
                />
                <DollarSign className="size-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

            {/* Relocation Locations */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-bold text-primary">Preferred Location Hubs</Label>
              <div className="relative">
                <Input
                  value={relocation}
                  onChange={(e) => setRelocation(e.target.value)}
                  placeholder="e.g. Bangalore, Hyderabad, Gurgaon, Remote"
                  className="surface-2 border-border text-sm pl-9"
                />
                <MapPin className="size-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button
              onClick={() => {
                notify({
                  type: "success",
                  icon: "🎯",
                  title: "Preferences Saved!",
                  body: "Target career track preferences updated.",
                  autoDismiss: 3000,
                });
              }}
              variant="primary"
            >
              Save Placement Preferences
            </Button>
          </div>
        </div>
      )}

      {/* ── TAB 3: NOTIFICATION PREFERENCES ── */}
      {activeTab === "notifications" && (
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <Bell className="size-5 text-orange-500" /> Notifications & Reminders
            </h3>
            <p className="text-xs text-secondary">
              Configure daily DSA practice goals and company application deadline alerts.
            </p>
          </div>

          <div className="space-y-4">

            {/* Toggle 1 */}
            <div className="p-4 rounded-2xl surface-2 border border-border flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-primary">Daily DSA Streak Reminders</p>
                <p className="text-xs text-muted">Receive a quick reminder to solve 1 DSA question daily.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyDaily(!notifyDaily)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifyDaily ? "bg-orange-500" : "bg-border"}`}
              >
                <span className={`size-5 rounded-full bg-white absolute top-0.5 transition-transform ${notifyDaily ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="p-4 rounded-2xl surface-2 border border-border flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-primary">Target Company Application Deadlines</p>
                <p className="text-xs text-muted">Alerts when target company hiring drives go live.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyCompanyReminders(!notifyCompanyReminders)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifyCompanyReminders ? "bg-orange-500" : "bg-border"}`}
              >
                <span className={`size-5 rounded-full bg-white absolute top-0.5 transition-transform ${notifyCompanyReminders ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="p-4 rounded-2xl surface-2 border border-border flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-primary">ATS Resume Improvement Tips</p>
                <p className="text-xs text-muted">Periodic AI suggestions to boost your resume score above 90.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyResumeUpdates(!notifyResumeUpdates)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifyResumeUpdates ? "bg-orange-500" : "bg-border"}`}
              >
                <span className={`size-5 rounded-full bg-white absolute top-0.5 transition-transform ${notifyResumeUpdates ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 4: SECURITY & ACCOUNT DETAILS ── */}
      {activeTab === "security" && (
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <ShieldCheck className="size-5 text-orange-500" /> Account & Security
            </h3>
            <p className="text-xs text-secondary">
              View your sign-in provider and account authentication status.
            </p>
          </div>

          <div className="surface-2 p-5 rounded-2xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Signed In Email</span>
              <span className="text-xs font-mono font-bold text-primary">{email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Authentication Provider</span>
              <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-0.5 rounded-full border border-orange-500/20 uppercase">
                {provider}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Session Security Status</span>
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Encrypted & Active
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
