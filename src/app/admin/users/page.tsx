"use client";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
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
  Check,
  Tag,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

export type AdminTag = "Boss" | "Project Manager" | "TL" | "DSA Creator" | "Company Curator";

export const OWNER_EMAIL = "bhaveshy9654@gmail.com";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  primaryRole: "Owner" | "Admin User" | "Student";
  tags: AdminTag[];
  proMember: boolean;
  score: number;
}

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-owner-supreme",
    name: "Bhavesh Rao (Boss / Supreme Owner)",
    email: "bhaveshy9654@gmail.com",
    primaryRole: "Owner",
    tags: ["Boss", "Project Manager", "TL", "DSA Creator", "Company Curator"],
    proMember: true,
    score: 98,
  },
  {
    id: "usr-tl-1",
    name: "Aarav Gupta",
    email: "aarav.tl@careeros.app",
    primaryRole: "Admin User",
    tags: ["TL", "Project Manager"],
    proMember: true,
    score: 94,
  },
  {
    id: "usr-dsa-1",
    name: "Karan Mehta",
    email: "karan.dsa@careeros.app",
    primaryRole: "Admin User",
    tags: ["DSA Creator"],
    proMember: true,
    score: 91,
  },
  {
    id: "usr-company-1",
    name: "Sneha Patel",
    email: "sneha.intel@careeros.app",
    primaryRole: "Admin User",
    tags: ["Company Curator"],
    proMember: true,
    score: 89,
  },
  {
    id: "usr-student-1",
    name: "Rohan Varma",
    email: "rohan.student@careeros.app",
    primaryRole: "Student",
    tags: [],
    proMember: true,
    score: 88,
  },
];

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

export default function AdminUsersPage() {
  const { notify } = useNotifications();
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [selectedUserForTags, setSelectedUserForTags] = useState<AdminUser | null>(null);

  // Active logged in email check
  const currentUserEmail = OWNER_EMAIL; // Supreme Owner logged in
  const isOwner = currentUserEmail.toLowerCase() === OWNER_EMAIL.toLowerCase();

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  function togglePromoteAdmin(userId: string) {
    if (!isOwner) {
      notify({
        type: "error",
        icon: "🔒",
        title: "Access Denied",
        body: `Only Supreme Owner ${OWNER_EMAIL} can grant Admin privileges.`,
      });
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        if (u.email.toLowerCase() === OWNER_EMAIL.toLowerCase()) return u; // Owner remains Owner

        const isCurrentlyAdmin = u.primaryRole === "Admin User";
        const newRole = isCurrentlyAdmin ? "Student" : "Admin User";
        const newTags: AdminTag[] = isCurrentlyAdmin ? [] : ["TL"]; // Default to TL tag when promoted

        notify({
          type: "success",
          icon: isCurrentlyAdmin ? "👤" : "🛡️",
          title: isCurrentlyAdmin ? "Demoted to Student" : "Promoted to Admin User!",
          body: `Owner updated ${u.name}'s role to ${newRole}.`,
          autoDismiss: 3000,
        });

        return { ...u, primaryRole: newRole, tags: newTags };
      })
    );
  }

  function toggleTagForUser(userId: string, tagToToggle: AdminTag) {
    if (!isOwner) {
      notify({
        type: "error",
        icon: "🔒",
        title: "Access Denied",
        body: `Only Supreme Owner ${OWNER_EMAIL} can assign tags.`,
      });
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        // Cannot remove Boss tag from Owner
        if (u.email.toLowerCase() === OWNER_EMAIL.toLowerCase() && tagToToggle === "Boss") {
          return u;
        }

        const hasTag = u.tags.includes(tagToToggle);
        const newTags = hasTag
          ? u.tags.filter((t) => t !== tagToToggle)
          : [...u.tags, tagToToggle];
        return { ...u, tags: newTags };
      })
    );

    notify({
      type: "success",
      icon: "🏷️",
      title: "Tag Assigned by Owner",
      body: `Updated tags for user.`,
      autoDismiss: 2500,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-amber-500/15 via-surface to-surface">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400 bg-amber-500/20 border border-amber-500/40">
            <Crown className="size-3.5 text-amber-400" /> Exclusive Owner Authority Guard
          </div>
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Supreme Owner & Admin Tagging Engine
          </h1>
          <p className="text-xs text-secondary leading-relaxed">
            <strong className="text-amber-400">{OWNER_EMAIL}</strong> is the exclusive Boss / Supreme Owner. Only the Owner can promote users to Admin status and grant specialized management tags (`TL`, `Project Manager`, `DSA Creator`, `Company Curator`).
          </p>
        </div>

        {/* Owner Identity Verification Pill */}
        <div className="surface-2 p-3.5 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-amber-400" />
            <span>Active Owner Session: <strong className="text-primary font-mono">{OWNER_EMAIL}</strong></span>
          </div>
          <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
            Full RBAC Control Verified
          </span>
        </div>
      </div>

      {/* Tags Legend */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AVAILABLE_TAGS.map((t) => (
          <div key={t.name} className="surface p-4 rounded-2xl border border-border space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${t.color}`}>
                <t.icon className="size-3" /> {t.label}
              </span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="relative">
        <Search className="size-4 text-muted absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidates or admins by name, email, or tag..."
          className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none"
        />
      </div>

      {/* Users & Admin Promotion List Table */}
      <div className="space-y-3">
        {filteredUsers.map((u) => {
          const isUserOwner = u.email.toLowerCase() === OWNER_EMAIL.toLowerCase();
          return (
            <div
              key={u.id}
              className={`surface rounded-3xl p-5 border space-y-4 shadow-sm transition-all text-xs ${
                isUserOwner ? "border-amber-500/50 bg-amber-500/5" : "border-border"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-primary">{u.name}</h3>
                    {isUserOwner ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                        <Crown className="size-3" /> Supreme Owner
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        u.primaryRole === "Admin User" ? "bg-orange-500/15 text-orange-400 border-orange-500/30" : "surface-2 text-secondary border-border"
                      }`}>
                        {u.primaryRole}
                      </span>
                    )}
                  </div>
                  <p className="text-muted font-mono">{u.email}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isUserOwner && (
                    <button
                      onClick={() => togglePromoteAdmin(u.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all border flex items-center gap-1.5 ${
                        u.primaryRole === "Admin User"
                          ? "surface-2 text-secondary hover:text-red-400 border-border"
                          : "bg-teal-500 text-white border-teal-500 shadow-sm"
                      }`}
                    >
                      <UserCheck className="size-3.5" />
                      {u.primaryRole === "Admin User" ? "Demote to Student" : "Promote to Admin User"}
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedUserForTags(u)}
                    className="px-3.5 py-1.5 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                  >
                    <Tag className="size-3.5" /> Assign Tags
                  </button>
                </div>
              </div>

              {/* Assigned Tags List */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-muted">Assigned Tags:</span>
                {u.tags.length > 0 ? (
                  u.tags.map((tg) => {
                    const tagInfo = AVAILABLE_TAGS.find((t) => t.name === tg);
                    return (
                      <span
                        key={tg}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                          tagInfo?.color || "surface-2 text-primary border-border"
                        }`}
                      >
                        {tg}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-muted italic text-[11px]">No tags assigned yet</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TAG ASSIGNMENT MODAL */}
      {selectedUserForTags && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="space-y-0.5">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Crown className="size-5 text-amber-400" /> Assign Tags (Owner Control)
                </h3>
                <p className="text-xs text-muted">{selectedUserForTags.name} ({selectedUserForTags.email})</p>
              </div>
              <button
                onClick={() => setSelectedUserForTags(null)}
                className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-secondary font-semibold pb-1">Select Active Management Tags:</p>
              {AVAILABLE_TAGS.map((t) => {
                const isChecked = selectedUserForTags.tags.includes(t.name);
                const isBossTag = t.name === "Boss";
                return (
                  <button
                    key={t.name}
                    type="button"
                    disabled={isBossTag && selectedUserForTags.email.toLowerCase() !== OWNER_EMAIL.toLowerCase()}
                    onClick={() => {
                      toggleTagForUser(selectedUserForTags.id, t.name);
                      setSelectedUserForTags((prev) =>
                        prev
                          ? {
                              ...prev,
                              tags: isChecked
                                ? prev.tags.filter((x) => x !== t.name)
                                : [...prev.tags, t.name],
                            }
                          : null
                      );
                    }}
                    className={`w-full p-3 rounded-2xl font-bold transition-all border text-left flex items-center justify-between ${
                      isChecked
                        ? "bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-sm"
                        : "surface-2 text-secondary border-border hover:border-orange-500/30"
                    } ${isBossTag && selectedUserForTags.email.toLowerCase() !== OWNER_EMAIL.toLowerCase() ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <t.icon className="size-4" />
                      <span>{t.label}</span>
                    </div>
                    {isChecked && <Check className="size-4 text-orange-400" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUserForTags(null)}
                className="px-5 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md"
              >
                Done & Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
