"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Search,
  Database,
  RotateCcw,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface CompanyProfile {
  id: string;
  name: string;
  slug: string;
  tier: "Product Enterprise" | "High-Growth Startup" | "Global Tech";
  ctcPackage: string;
  roundsCount: number;
  requiredSkills: string[];
}

export default function AdminCompaniesPage() {
  const { notify } = useNotifications();
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyProfile | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [tier, setTier] = useState<"Product Enterprise" | "High-Growth Startup" | "Global Tech">("Product Enterprise");
  const [ctcPackage, setCtcPackage] = useState("₹30 LPA");
  const [roundsCount, setRoundsCount] = useState(4);
  const [skillsInput, setSkillsInput] = useState("DSA, System Design, React, Node.js");

  // 2-Step Confirmation Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<CompanyProfile | null>(null);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState<1 | 2>(1);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/companies");
      const data = await res.json();
      if (data.success && Array.isArray(data.companies)) {
        const mapped: CompanyProfile[] = data.companies.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          tier: (c.metadata?.tier as any) || "Product Enterprise",
          ctcPackage: (c.metadata?.ctc as any) || "₹30 LPA",
          roundsCount: 4,
          requiredSkills: Array.isArray(c.metadata?.skills)
            ? c.metadata.skills
            : ["DSA", "System Design"],
        }));
        setCompanies(mapped);
      }
    } catch (e) {
      console.error("Error loading companies from API", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const openCreateModal = () => {
    setEditingCompany(null);
    setName("");
    setTier("Product Enterprise");
    setCtcPackage("₹30 LPA");
    setRoundsCount(4);
    setSkillsInput("DSA, System Design, React, Node.js");
    setShowModal(true);
  };

  const openEditModal = (comp: CompanyProfile) => {
    setEditingCompany(comp);
    setName(comp.name);
    setTier(comp.tier);
    setCtcPackage(comp.ctcPackage);
    setRoundsCount(comp.roundsCount);
    setSkillsInput(comp.requiredSkills.join(", "));
    setShowModal(true);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      if (editingCompany) {
        // PUT update
        const res = await fetch("/api/admin/companies", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCompany.id,
            name,
            tier,
            ctcPackage,
            requiredSkills: cleanSkills,
          }),
        });
        const data = await res.json();
        if (data.success) {
          notify({
            type: "success",
            icon: "✏️",
            title: "Company Updated!",
            body: `Updated "${name}" details in DB.`,
            autoDismiss: 3500,
          });
        }
      } else {
        // POST create
        const res = await fetch("/api/admin/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            tier,
            ctcPackage,
            requiredSkills: cleanSkills,
          }),
        });
        const data = await res.json();
        if (data.success) {
          notify({
            type: "success",
            icon: "🏢",
            title: "Target Company Added!",
            body: `Added "${name}" to DB.`,
            autoDismiss: 3500,
          });
        }
      }
      setShowModal(false);
      loadCompanies();
    } catch (err) {
      console.error(err);
      notify({
        type: "error",
        icon: "⚠️",
        title: "Operation Failed",
        body: "Failed to save company profile.",
        autoDismiss: 4000,
      });
    }
  };

  // Initiate 2-step delete flow
  const initiateDelete = (comp: CompanyProfile) => {
    setDeleteTarget(comp);
    setDeleteConfirmStep(1);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/admin/companies?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCompanies((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        notify({
          type: "success",
          icon: "🗑️",
          title: "Company Deleted",
          body: `Permanently deleted "${deleteTarget.name}".`,
          autoDismiss: 3500,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
      setDeleteConfirmStep(1);
    }
  };

  // Audit and purge incomplete companies
  const handlePurgeIncomplete = async () => {
    const incomplete = companies.filter((c) => !c.name || c.name.trim().length === 0);
    if (incomplete.length === 0) {
      notify({
        type: "info",
        icon: "✨",
        title: "All Companies Clean!",
        body: "No incomplete or broken company entries found.",
        autoDismiss: 3500,
      });
      return;
    }

    for (const comp of incomplete) {
      await fetch(`/api/admin/companies?id=${comp.id}`, { method: "DELETE" });
    }
    notify({
      type: "success",
      icon: "🧹",
      title: "Purge Complete!",
      body: `Purged ${incomplete.length} broken/incomplete entries from DB.`,
      autoDismiss: 4000,
    });
    loadCompanies();
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-up pb-16">

      {/* Header Banner */}
      <div className="surface border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-blue-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30">
              <Database className="size-3.5 text-blue-400" /> Supabase DB: Target Companies Curator
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Target Companies Manager
            </h1>
            <p className="text-xs text-secondary">
              Curate and audit real tech hiring maps, product vs service tiers, hiring rounds, and candidate skill requirements.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handlePurgeIncomplete}
              className="px-3.5 py-2.5 rounded-2xl surface-2 text-amber-400 hover:text-amber-300 border border-amber-500/20 text-xs font-bold flex items-center gap-1.5"
              title="Audit & purge empty records"
            >
              <Sparkles className="size-4" /> Purge Incomplete
            </button>

            <button
              onClick={loadCompanies}
              className="p-2.5 rounded-2xl surface-2 text-secondary hover:text-primary border border-border"
              title="Refresh DB"
            >
              <RotateCcw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-2xl font-bold text-xs bg-blue-600 text-white hover:brightness-110 shadow-md shadow-blue-600/20 shrink-0 flex items-center gap-1.5"
            >
              <Plus className="size-4" /> Add Target Company
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md pt-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            type="text"
            placeholder="Search companies by name, tier, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider px-2">
          <span>Target Companies Roster ({filteredCompanies.length})</span>
          <span>CTC &amp; Actions</span>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="p-8 text-center surface border border-border rounded-3xl text-xs text-muted">
            No companies found. Click "Add Target Company" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCompanies.map((c) => (
              <div
                key={c.id}
                className="surface rounded-3xl p-5 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm hover:border-blue-500/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-primary">{c.name}</h3>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                      {c.tier}
                    </span>
                  </div>
                  <p className="text-muted">
                    {c.roundsCount} Selection Rounds · Skills: {c.requiredSkills.join(", ")}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-teal-400 font-mono text-sm">{c.ctcPackage}</span>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-2 rounded-xl surface-2 text-secondary hover:text-primary border border-border hover:border-blue-500/40 transition-colors"
                    title="Edit Company"
                  >
                    <Edit className="size-4" />
                  </button>

                  {/* Delete Button (Triggers 2-Step Confirmation) */}
                  <button
                    onClick={() => initiateDelete(c)}
                    className="p-2 rounded-xl surface-2 text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                    title="Delete Company (2-Step)"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT COMPANY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Building2 className="size-5 text-blue-400" />
                {editingCompany ? "Edit Target Company" : "Add Target Company"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary">Company Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Swiggy"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Company Tier</label>
                  <select
                    value={tier}
                    onChange={(e: any) => setTier(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-blue-500"
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
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-blue-500"
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
                  placeholder="DSA, System Design, React..."
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-blue-600 text-white hover:brightness-110 shadow-md"
                >
                  {editingCompany ? "Update Profile" : "Publish Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2-STEP CONFIRMATION DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="size-7 shrink-0" />
              <div>
                <h3 className="font-display text-lg font-bold text-primary">
                  {deleteConfirmStep === 1 ? "Step 1: Confirm Deletion" : "Step 2: Permanent Deletion Warning"}
                </h3>
                <p className="text-xs text-muted">Action cannot be undone.</p>
              </div>
            </div>

            {deleteConfirmStep === 1 ? (
              <div className="space-y-4 text-xs">
                <p className="text-secondary leading-relaxed">
                  Are you sure you want to delete <strong className="text-primary">{deleteTarget.name}</strong> from the DB? This will remove hiring roadmap intelligence for this target.
                </p>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setDeleteConfirmStep(2)}
                    className="px-5 py-2 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-md"
                  >
                    Proceed to Step 2 →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                  <p className="font-bold">⚠️ FINAL CONFIRMATION REQUIRED</p>
                  <p className="text-[11px] text-secondary mt-1">
                    Click "Permanently Delete" below to finalize removing "{deleteTarget.name}".
                  </p>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeDelete}
                    className="px-6 py-2 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/30"
                  >
                    Permanently Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
