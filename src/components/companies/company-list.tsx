"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Building2,
  Sparkles,
  Target,
  Bot,
  Zap,
  Layers,
  Brain,
  Code2,
  X,
  Loader2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck,
  Briefcase,
  MapPin,
  IndianRupee,
} from "lucide-react";
import { TargetButton } from "@/app/dashboard/companies/target-button";
import type { CompanyMatchResult } from "@/app/api/companies/match/route";

export interface CompanyData {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  career_page_url: string | null;
  metadata: {
    tier?: string;
    verified?: boolean;
    category?: string;
    city?: string;
    ctc_range?: string;
    wlb?: string;
    work_policy?: string;
    networth?: string;
  };
  hiring_rounds_count?: number;
  required_skills?: string[];
  top_topics?: string[];
}

export function CompanyList({
  companies,
  targetedSet,
}: {
  companies: CompanyData[];
  targetedSet: Record<string, boolean>;
}) {
  const [query, setQuery] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");

  // Modal State for AI Company Match Analyzer
  const [selectedMatchCompany, setSelectedMatchCompany] = useState<CompanyData | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [matchData, setMatchData] = useState<CompanyMatchResult | null>(null);

  const targetedCount = Object.keys(targetedSet).length;

  const filtered = companies.filter((c) => {
    const q = query.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(q);
    const tierMatch = (c.metadata.tier ?? "").toLowerCase().includes(q);
    const cityMatch = (c.metadata.city ?? "").toLowerCase().includes(q);
    const skillMatch = (c.required_skills ?? []).some((s) =>
      s.toLowerCase().includes(q)
    );

    if (!nameMatch && !tierMatch && !skillMatch && !cityMatch) return false;

    if (filterTier === "targeted") return !!targetedSet[c.id];
    if (filterTier === "jaipur") return (c.metadata.city ?? "").toLowerCase().includes("jaipur");
    if (filterTier === "bengaluru") return (c.metadata.city ?? "").toLowerCase().includes("bengaluru");
    if (filterTier === "pune") return (c.metadata.city ?? "").toLowerCase().includes("pune");
    if (filterTier === "metro_hubs") {
      const city = (c.metadata.city ?? "").toLowerCase();
      return city.includes("delhi") || city.includes("hyderabad") || city.includes("chennai");
    }
    if (filterTier === "verified") return !!c.metadata.verified;
    if (filterTier === "product") {
      const t = (c.metadata.tier ?? "").toLowerCase();
      return t.includes("product") || t.includes("big tech");
    }
    if (filterTier === "unicorns") {
      const t = (c.metadata.tier ?? "").toLowerCase();
      return t.includes("indian product") || t.includes("unicorn");
    }
    if (filterTier === "hardware") {
      const t = (c.metadata.tier ?? "").toLowerCase();
      return t.includes("semiconductor") || t.includes("engineering");
    }
    if (filterTier === "services") {
      const t = (c.metadata.tier ?? "").toLowerCase();
      return t.includes("services") || t.includes("consulting") || t.includes("bpo");
    }

    return true;
  });

  async function handleOpenMatchModal(company: CompanyData) {
    setSelectedMatchCompany(company);
    setMatchLoading(true);
    setMatchError("");
    setMatchData(null);

    try {
      const res = await fetch("/api/companies/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: company.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Match analysis failed");
      setMatchData(json.result as CompanyMatchResult);
    } catch (err) {
      setMatchError((err as Error).message);
    } finally {
      setMatchLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Targeted Companies Quick Focus Bar (If targeted > 0) ── */}
      {targetedCount > 0 && (
        <div className="surface border border-orange-500/30 bg-orange-500/5 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Target className="size-4" /> My Targeted Companies ({targetedCount})
            </p>
            <button
              onClick={() => setFilterTier(filterTier === "targeted" ? "all" : "targeted")}
              className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1"
            >
              {filterTier === "targeted" ? "Show All Companies" : "View My Target List →"}
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {companies
              .filter((c) => targetedSet[c.id])
              .map((c) => (
                <div
                  key={c.id}
                  className="surface-2 border border-border rounded-2xl px-3.5 py-2 flex items-center gap-2 shrink-0 group hover:border-orange-500/50 transition-all"
                >
                  <div className="size-6 rounded-lg bg-orange-500/15 text-orange-400 font-bold text-xs flex items-center justify-center">
                    {c.name.charAt(0)}
                  </div>
                  <Link href={`/dashboard/companies/${c.slug}`} className="text-xs font-bold text-primary group-hover:text-orange-400 transition-colors">
                    {c.name}
                  </Link>
                  <button
                    onClick={() => handleOpenMatchModal(c)}
                    title="Check AI Match Score"
                    className="size-6 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/30 flex items-center justify-center transition-colors"
                  >
                    <Bot className="size-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Search & Filter Controls ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city (e.g. Jaipur, Pune), skills (React, Python), or tier..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm surface border border-border focus:outline-none focus:border-orange-500 transition-all text-primary placeholder:text-muted"
            />
          </div>
        </div>

        {/* Category & City Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all",           label: `All Companies (${companies.length})` },
            { id: "targeted",      label: `🎯 Targeted (${targetedCount})` },
            { id: "jaipur",        label: "🏰 Jaipur Hub" },
            { id: "bengaluru",     label: "🌳 Bengaluru (Silicon Valley)" },
            { id: "pune",          label: "🏰 Pune Tech Hub" },
            { id: "metro_hubs",    label: "🏙️ Delhi / Hyd / Chennai" },
            { id: "product",       label: "🚀 Product & Big Tech" },
            { id: "unicorns",      label: "🦄 Indian Unicorns" },
            { id: "services",      label: "🏢 IT Services" },
            { id: "verified",      label: "✓ Verified Intel" },
          ].map((tab) => {
            const isActive = filterTier === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTier(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "surface-2 text-secondary hover:text-primary border border-border"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Company Grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl p-12 text-center surface border border-border space-y-3">
          <Building2 className="size-10 text-muted mx-auto opacity-40" />
          <p className="text-sm font-semibold text-primary">No matching companies found</p>
          <p className="text-xs text-muted">Try adjusting your search query or city/tier filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const isTargeted = !!targetedSet[c.id];
            const verified = !!c.metadata.verified;
            const rounds = c.hiring_rounds_count || 3;
            const topSkills = (c.required_skills || []).slice(0, 3);
            const city = c.metadata.city || "India Tech Hub";
            const ctc = c.metadata.ctc_range;

            return (
              <div
                key={c.id}
                className="group rounded-3xl p-5 surface border border-border hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {/* Top bar: Logo + Name + Tier */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-12 rounded-2xl flex items-center justify-center font-extrabold text-lg transition-transform duration-300 group-hover:scale-105"
                        style={{
                          background: "var(--orange-glow)",
                          border: "1px solid rgba(249,115,22,0.25)",
                          color: "var(--orange)",
                        }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-primary group-hover:text-orange-400 transition-colors">
                            {c.name}
                          </h3>
                          {verified && (
                            <span title="Verified Placement Intel">
                              <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted font-medium">
                          <span className="flex items-center gap-1 text-teal-400">
                            <MapPin className="size-3" /> {city}
                          </span>
                          {c.metadata.tier && (
                            <span className="truncate max-w-[140px]">• {c.metadata.tier}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI Match Button */}
                    <button
                      onClick={() => handleOpenMatchModal(c)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Bot className="size-3.5" /> AI Match
                    </button>
                  </div>

                  {/* Hiring Stats Badges & CTC */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full surface-2 border border-border text-secondary flex items-center gap-1">
                      <Layers className="size-3 text-orange-400" /> {rounds} Interview Rounds
                    </span>
                    {ctc && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <IndianRupee className="size-3" /> {ctc}
                      </span>
                    )}
                    {verified ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                        <Sparkles className="size-3" /> Verified Research
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        General Pattern
                      </span>
                    )}
                  </div>

                  {/* Skills Tags */}
                  {topSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topSkills.map((sk) => (
                        <span key={sk} className="text-[10px] font-semibold px-2 py-0.5 rounded-md surface-2 text-muted border border-border">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <TargetButton companyId={c.id} companyName={c.name} initiallyTargeted={isTargeted} />
                  <Link
                    href={`/dashboard/companies/${c.slug}`}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 transition-all group-hover:translate-x-0.5"
                  >
                    View Process <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── AI Company Match & Gap Analyzer Modal ── */}
      {selectedMatchCompany && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="surface border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMatchCompany(null)}
              className="absolute top-5 right-5 size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="size-12 rounded-2xl bg-orange-500/15 border border-orange-500/25 text-orange-400 font-bold text-xl flex items-center justify-center">
                {selectedMatchCompany.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-extrabold text-primary">
                    AI Resume Match: {selectedMatchCompany.name}
                  </h2>
                </div>
                <p className="text-xs text-secondary">
                  Gemini analyzes your active resume against {selectedMatchCompany.name}&apos;s hiring standards
                </p>
              </div>
            </div>

            {/* Loading State */}
            {matchLoading && (
              <div className="py-12 text-center space-y-4">
                <Loader2 className="size-10 text-orange-400 animate-spin mx-auto" />
                <p className="font-display text-base font-bold text-primary">
                  Evaluating candidate resume against {selectedMatchCompany.name} hiring requirements…
                </p>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Comparing technical competencies, DSA topic priorities, and experience alignment.
                </p>
              </div>
            )}

            {/* Error State */}
            {matchError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                {matchError}
              </div>
            )}

            {/* Analysis Result */}
            {matchData && (
              <div className="space-y-6">
                {/* Score & Verdict Card */}
                <div className="surface-2 border border-orange-500/30 bg-orange-500/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Match Assessment</span>
                    <h3 className="font-display text-xl font-extrabold text-primary mt-0.5">
                      {matchData.verdict}
                    </h3>
                    <p className="text-xs text-secondary mt-1 max-w-sm leading-relaxed">
                      {matchData.tailored_advice}
                    </p>
                  </div>
                  <div className="surface border border-border px-5 py-3 rounded-2xl text-center shrink-0">
                    <p className="text-[10px] font-bold uppercase text-muted">Readiness Score</p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className="text-3xl font-extrabold font-mono text-orange-400">{matchData.match_score}</span>
                      <span className="text-xs font-bold text-muted">/100</span>
                    </div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Matched Skills */}
                  <div className="surface-2 border border-green-500/25 rounded-2xl p-4 space-y-2">
                    <p className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-4" /> Matched Skills ({matchData.matched_skills.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {matchData.matched_skills.map((s) => (
                        <span key={s} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  <div className="surface-2 border border-amber-500/25 rounded-2xl p-4 space-y-2">
                    <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Brain className="size-4" /> Skills to Bridge ({matchData.missing_skills.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {matchData.missing_skills.map((s) => (
                        <span key={s} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Priority DSA Focus Topics */}
                {matchData.top_dsa_focus.length > 0 && (
                  <div className="surface-2 border border-border rounded-2xl p-4 space-y-2">
                    <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Code2 className="size-4 text-orange-400" /> Priority DSA Topics to Practice for {selectedMatchCompany.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchData.top_dsa_focus.map((t) => (
                        <Link
                          key={t}
                          href="/dashboard/prep"
                          className="text-xs font-bold px-3 py-1.5 rounded-xl surface border border-border text-orange-400 hover:border-orange-500/50 flex items-center gap-1 transition-all"
                        >
                          ⚡ Practice {t} <ArrowRight className="size-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 14-Day Sprint Roadmap */}
                {matchData.sprint_plan && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">Tailored 14-Day Interview Sprint:</p>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      {matchData.sprint_plan.map((sp, i) => (
                        <div key={i} className="surface-2 border border-border rounded-2xl p-4 space-y-2">
                          <p className="font-bold text-orange-400">{sp.week}</p>
                          <p className="text-secondary font-medium">{sp.focus}</p>
                          <ul className="space-y-1 text-muted pl-1">
                            {sp.action_items.map((act, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-[11px]">
                                <span className="text-orange-400 font-bold">•</span> {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Action Footer */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="/dashboard/resume/rewrite"
                    className="flex-1 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-center"
                  >
                    <Sparkles className="size-4" /> Optimize Resume for {selectedMatchCompany.name}
                  </Link>
                  <Link
                    href={`/dashboard/companies/${selectedMatchCompany.slug}`}
                    className="px-5 py-3 rounded-2xl font-bold text-xs surface-2 border border-border text-secondary hover:text-primary flex items-center justify-center gap-1.5"
                  >
                    View Interview Process →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
