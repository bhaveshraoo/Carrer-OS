"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  X,
  Search,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface CompanyProfile {
  id: string;
  name: string;
  tier: "Product Enterprise" | "High-Growth Startup" | "Global Tech";
  ctcPackage: string;
  roundsCount: number;
  requiredSkills: string[];
}

const INITIAL_COMPANIES: CompanyProfile[] = [
  {
    id: "comp-1",
    name: "Google India",
    tier: "Product Enterprise",
    ctcPackage: "₹34 LPA",
    roundsCount: 4,
    requiredSkills: ["DSA", "System Design", "Go", "C++"],
  },
  {
    id: "comp-2",
    name: "Atlassian",
    tier: "Product Enterprise",
    ctcPackage: "₹52 LPA",
    roundsCount: 5,
    requiredSkills: ["React", "Java", "System Design", "WebSockets"],
  },
  {
    id: "comp-3",
    name: "Razorpay",
    tier: "High-Growth Startup",
    ctcPackage: "₹28 LPA",
    roundsCount: 3,
    requiredSkills: ["Node.js", "PostgreSQL", "React", "Docker"],
  },
];

export default function AdminCompaniesPage() {
  const { notify } = useNotifications();
  const [companies, setCompanies] = useState<CompanyProfile[]>(INITIAL_COMPANIES);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [tier, setTier] = useState<"Product Enterprise" | "High-Growth Startup" | "Global Tech">("Product Enterprise");
  const [ctcPackage, setCtcPackage] = useState("₹30 LPA");
  const [roundsCount, setRoundsCount] = useState(4);
  const [skillsInput, setSkillsInput] = useState("DSA, System Design, React, Node.js");

  function handleCreateCompany(e: React.FormEvent) {
    e.preventDefault();
    const newComp: CompanyProfile = {
      id: `comp-${Date.now()}`,
      name,
      tier,
      ctcPackage,
      roundsCount: Number(roundsCount),
      requiredSkills: skillsInput.split(",").map((s) => s.trim()),
    };

    setCompanies([newComp, ...companies]);
    setShowCreateModal(false);

    notify({
      type: "success",
      icon: "🏢",
      title: "Company Profile Published!",
      body: `Added "${name}" with hiring process map and CTC details.`,
      autoDismiss: 4000,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-blue-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30">
              <Building2 className="size-3.5 text-blue-400" /> Required Tag: Company Curator
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Target Company Intelligence Curator
            </h1>
            <p className="text-xs text-secondary">
              Add new hiring maps for tech companies, verified product vs service tiers, hiring timelines, CTC packages, and interview round criteria.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-blue-600 text-white hover:brightness-110 shadow-md shadow-blue-600/20 shrink-0 flex items-center gap-1.5"
          >
            <Plus className="size-4" /> Add Target Company
          </button>
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider px-2">
          <span>Target Companies ({companies.length})</span>
          <span>CTC & Rounds</span>
        </div>

        <div className="space-y-3">
          {companies.map((c) => (
            <div key={c.id} className="surface rounded-3xl p-5 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-primary">{c.name}</h3>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    {c.tier}
                  </span>
                </div>
                <p className="text-muted">{c.roundsCount} Selection Rounds · Skills: {c.requiredSkills.join(", ")}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-teal-400 font-mono text-sm">{c.ctcPackage}</span>
                <button
                  onClick={() => setCompanies((prev) => prev.filter((x) => x.id !== c.id))}
                  className="p-2 rounded-xl surface-2 text-red-400 hover:bg-red-500/10 border border-red-500/20"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE COMPANY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Building2 className="size-5 text-blue-400" /> Add Target Company Profile
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary">Company Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Swiggy"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Company Tier</label>
                  <select
                    value={tier}
                    onChange={(e: any) => setTier(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  >
                    <option value="Product Enterprise">Product Enterprise</option>
                    <option value="High-Growth Startup">High-Growth Startup</option>
                    <option value="Global Tech">Global Tech</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">CTC Package</label>
                  <input
                    type="text"
                    value={ctcPackage}
                    onChange={(e) => setCtcPackage(e.target.value)}
                    required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Required Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  required
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl font-bold bg-blue-600 text-white hover:brightness-110 shadow-md">
                  Publish Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
