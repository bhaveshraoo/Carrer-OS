"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
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
  MapPin,
  IndianRupee,
  Briefcase,
  Star,
  Award,
  Globe,
  AlertCircle,
} from "lucide-react";
import { TiltCompanyCard } from "./company-card";
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
    type?: string;
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
  // Search & Filter State
  const [query, setQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [onlyTargeted, setOnlyTargeted] = useState<boolean>(false);

  // Top Carousel Index State
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Modal State for AI Company Match Analyzer
  const [selectedMatchCompany, setSelectedMatchCompany] = useState<CompanyData | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [matchData, setMatchData] = useState<CompanyMatchResult | null>(null);

  const targetedCount = Object.keys(targetedSet).length;

  // Filter top featured companies for Top Carousel
  // Uses a broad keyword list; falls back to Tier 1 companies if < 4 matches
  const featuredCompanies = useMemo(() => {
    const priorityKeywords = [
      "google", "microsoft", "amazon", "meta", "apple", "netflix",
      "salesforce", "adobe", "swiggy", "zomato", "flipkart", "razorpay",
      "nvidia", "uber", "ola", "infosys", "tcs", "wipro", "accenture",
      "phonepe", "paytm", "cred", "meesho", "dream11", "moengage",
      "deloitte", "ibm", "oracle", "sap", "capgemini", "cognizant",
    ];
    const byKeyword = companies.filter((c) =>
      priorityKeywords.some((k) => c.name.toLowerCase().includes(k))
    );
    // If not enough, supplement with verified companies that have hiring rounds
    if (byKeyword.length < 4) {
      const extras = companies
        .filter((c) => c.metadata.verified && (c.hiring_rounds_count ?? 0) > 0 && !byKeyword.includes(c))
        .slice(0, 8 - byKeyword.length);
      return [...byKeyword, ...extras].slice(0, 8);
    }
    return byKeyword.slice(0, 8);
  }, [companies]);

  // Next / Prev Carousel Controls
  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, featuredCompanies.length));
  };
  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredCompanies.length) % Math.max(1, featuredCompanies.length));
  };

  // Main Filter Engine
  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const q = query.toLowerCase().trim();
      const cName = c.name.toLowerCase();
      const cTier = (c.metadata.tier ?? "").toLowerCase();
      const cType = (c.metadata.type ?? c.metadata.category ?? "").toLowerCase();
      const cCity = (c.metadata.city ?? "").toLowerCase();
      const cSkills = (c.required_skills ?? []).join(" ").toLowerCase();

      // Search Query Match
      if (q && !cName.includes(q) && !cTier.includes(q) && !cCity.includes(q) && !cSkills.includes(q)) {
        return false;
      }

      // Targeted Filter
      if (onlyTargeted && !targetedSet[c.id]) {
        return false;
      }

      // Tier Filter Dropdown
      // DB stores tiers like: "Tier 1A (FAANG...)", "Tier 2 / Tier 1B", "Tier 3", "Tech Company"
      if (selectedTier !== "all") {
        if (selectedTier === "tier1") {
          const isTier1 = cTier.includes("tier 1a") || cTier.includes("tier 1b") ||
            cTier.includes("faang") || cTier.includes("big tech") || cTier.includes("maang") ||
            (cTier.includes("tier 1") && !cTier.includes("tier 1b"));
          if (!isTier1) return false;
        }
        if (selectedTier === "tier2") {
          const isTier2 = cTier.includes("tier 2") || cTier.includes("tier 1b") ||
            cTier.includes("gcc") || cTier.includes("mid-product") || cTier.includes("mid product");
          if (!isTier2) return false;
        }
        if (selectedTier === "tier3") {
          const isTier3 = cTier.includes("tier 3") || cTier.includes("mass recruit") ||
            cTier.includes("it services") || cTier.includes("service company");
          if (!isTier3) return false;
        }
      }

      // Type Filter Dropdown
      // DB stores types like: "Enterprise IT Consulting...", "Product & Tech", "IT Services..."
      if (selectedType !== "all") {
        const combined = cType + " " + cTier + " " + (c.metadata.category ?? "").toLowerCase();
        if (selectedType === "bigtech") {
          if (!combined.includes("big tech") && !combined.includes("faang") &&
              !combined.includes("maang") && !combined.includes("big tech / maang")) return false;
        }
        if (selectedType === "product") {
          if (!combined.includes("product") && !combined.includes("saas") && !combined.includes("cloud")) return false;
        }
        if (selectedType === "startup") {
          if (!combined.includes("unicorn") && !combined.includes("startup") && !combined.includes("high-growth") && !combined.includes("high growth")) return false;
        }
        if (selectedType === "services") {
          if (!combined.includes("services") && !combined.includes("consulting") &&
              !combined.includes("bpo") && !combined.includes("outsourc")) return false;
        }
        if (selectedType === "ai") {
          if (!combined.includes("ai") && !combined.includes("deeptech") && !combined.includes("deep tech") &&
              !combined.includes("semiconductor") && !combined.includes("chip") && !combined.includes("machine learning")) return false;
        }
      }

      // City Filter Dropdown & Pills
      if (selectedCity !== "all") {
        if (selectedCity === "bangalore" && !cCity.includes("bengaluru") && !cCity.includes("bangalore")) {
          return false;
        }
        if (selectedCity === "pune" && !cCity.includes("pune")) {
          return false;
        }
        if (selectedCity === "delhi" && !cCity.includes("delhi") && !cCity.includes("ncr")) {
          return false;
        }
        if (selectedCity === "gurugram" && !cCity.includes("gurugram") && !cCity.includes("gurgaon")) {
          return false;
        }
        if (selectedCity === "hyderabad" && !cCity.includes("hyderabad")) {
          return false;
        }
        if (selectedCity === "chennai" && !cCity.includes("chennai")) {
          return false;
        }
        if (selectedCity === "jaipur" && !cCity.includes("jaipur")) {
          return false;
        }
      }

      return true;
    });
  }, [companies, query, selectedTier, selectedType, selectedCity, onlyTargeted, targetedSet]);

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
      if (res.status === 400) {
        // No resume uploaded yet
        setMatchError(json.error ?? "Please upload and analyze your resume first.");
      } else if (!res.ok) {
        throw new Error(json.error ?? "Match analysis failed. Please try again.");
      } else {
        setMatchData(json.result as CompanyMatchResult);
      }
    } catch (err) {
      setMatchError((err as Error).message);
    } finally {
      setMatchLoading(false);
    }
  }

  const activeFeatured = featuredCompanies[carouselIndex] || featuredCompanies[0];

  return (
    <div className="space-y-8">
      {/* ── TASK 1: PREMIUM FEATURED TOP COMPANIES SHOWCASE SLIDER ── */}
      {featuredCompanies.length > 0 && (
        <div className="relative rounded-3xl p-6 sm:p-8 surface border border-orange-500/30 overflow-hidden shadow-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-0 right-0 size-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Top Carousel Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-extrabold tracking-wide uppercase flex items-center gap-1.5 border border-orange-500/30">
                  <Star className="size-3.5 fill-orange-400" /> Featured Top Target
                </span>
                <p className="text-xs text-muted font-medium hidden sm:block">
                  Top hiring choices for tech freshers &amp; developers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="size-9 rounded-xl surface-2 border border-border flex items-center justify-center text-secondary hover:text-primary hover:border-orange-500/50 transition-all active:scale-95"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="size-9 rounded-xl surface-2 border border-border flex items-center justify-center text-secondary hover:text-primary hover:border-orange-500/50 transition-all active:scale-95"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>

            {/* Active Featured Slide Card */}
            {activeFeatured && (
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="size-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl"
                      style={{
                        background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
                        color: "#fff",
                        boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
                      }}
                    >
                      {activeFeatured.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-display text-2xl sm:text-3xl font-black text-primary">
                          {activeFeatured.name}
                        </h2>
                        {activeFeatured.metadata.verified && (
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/25 flex items-center gap-1">
                            <CheckCircle2 className="size-3.5" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary mt-1 font-semibold">
                        {activeFeatured.metadata.tier || "Tier 1A Big Tech"} • {activeFeatured.metadata.city || "Bengaluru / National"}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="flex items-center gap-3 flex-wrap pt-1">
                    {activeFeatured.metadata.ctc_range && (
                      <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                        <IndianRupee className="size-3.5" /> CTC Package: {activeFeatured.metadata.ctc_range}
                      </span>
                    )}
                    <span className="text-xs font-bold px-3 py-1 rounded-xl surface-2 border border-border text-secondary flex items-center gap-1">
                      <Layers className="size-3.5 text-orange-400" /> {activeFeatured.hiring_rounds_count || 4} Evaluation Rounds
                    </span>
                  </div>

                  {/* Required Skills */}
                  {(activeFeatured.required_skills ?? []).length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-bold text-muted uppercase tracking-wider mr-1">Key Focus:</span>
                      {(activeFeatured.required_skills ?? []).slice(0, 4).map((sk) => (
                        <span key={sk} className="text-xs font-bold px-2.5 py-1 rounded-lg surface-2 border border-border text-primary">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Callout in Featured Card */}
                <div className="surface-2 border border-orange-500/30 rounded-2xl p-5 space-y-3 text-center sm:text-left flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-orange-400 flex items-center gap-1 justify-center sm:justify-start">
                      <Sparkles className="size-4" /> AI Resume Readiness
                    </p>
                    <p className="text-xs text-secondary mt-1 leading-relaxed font-medium">
                      Analyze how your active resume matches {activeFeatured.name}&apos;s hiring standards.
                    </p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleOpenMatchModal(activeFeatured)}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Bot className="size-4" /> Check AI Match Score
                    </button>
                    <Link
                      href={`/dashboard/companies/${activeFeatured.slug}`}
                      className="w-full py-2 rounded-xl font-bold text-xs surface border border-border text-secondary hover:text-primary flex items-center justify-center gap-1 transition-all"
                    >
                      Explore Interview Process →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {featuredCompanies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === carouselIndex
                      ? "w-8 bg-orange-500"
                      : "w-2 bg-border hover:bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TASK 2: ENHANCED MULTI-DROPDOWN & LOCATION PILL FILTER SECTION ── */}
      <div className="surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <p className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
            <Filter className="size-4 text-orange-500" /> Filter Companies ({filtered.length} Results)
          </p>
          {(selectedTier !== "all" || selectedType !== "all" || selectedCity !== "all" || onlyTargeted || query) && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedTier("all");
                setSelectedType("all");
                setSelectedCity("all");
                setOnlyTargeted(false);
              }}
              className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Top Controls: Search Bar + Tier Dropdown + Type Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by company name or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs surface-2 border border-border focus:outline-none focus:border-orange-500 transition-all text-primary placeholder:text-muted font-medium"
            />
          </div>

          {/* Tier Dropdown */}
          <div className="relative">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl text-xs surface-2 border border-border focus:outline-none focus:border-orange-500 transition-all text-primary font-bold appearance-none cursor-pointer"
            >
              <option value="all">🏆 All Tiers</option>
              <option value="tier1">🥇 Tier 1 (FAANG / MAANG &amp; Top Product &gt; 25 LPA)</option>
              <option value="tier2">🥈 Tier 2 (Mid-Product &amp; GCCs 10 - 25 LPA)</option>
              <option value="tier3">🥉 Tier 3 (IT Services &amp; Mass Recruiters &lt; 10 LPA)</option>
            </select>
          </div>

          {/* Company Type Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl text-xs surface-2 border border-border focus:outline-none focus:border-orange-500 transition-all text-primary font-bold appearance-none cursor-pointer"
            >
              <option value="all">🏢 All Company Types</option>
              <option value="bigtech">🚀 Big Tech / MAANG</option>
              <option value="product">⚡ Product Based &amp; Cloud SaaS</option>
              <option value="startup">🦄 Startup Based / High Growth</option>
              <option value="services">🏢 IT Services &amp; Mass Recruiters</option>
              <option value="ai">🤖 AI, DeepTech &amp; Semiconductors</option>
            </select>
          </div>
        </div>

        {/* Clean Location Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Select Location Hub:</p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all font-bold",      label: "All Locations",      val: "all" },
              { id: "bangalore", label: "Bangalore",          val: "bangalore" },
              { id: "pune",      label: "Pune",               val: "pune" },
              { id: "delhi",     label: "Delhi / NCR",        val: "delhi" },
              { id: "gurugram",  label: "Gurugram",           val: "gurugram" },
              { id: "hyderabad", label: "Hyderabad",          val: "hyderabad" },
              { id: "chennai",   label: "Chennai",            val: "chennai" },
              { id: "jaipur",    label: "Jaipur",             val: "jaipur" },
            ].map((loc) => {
              const isActive = selectedCity === loc.val;
              return (
                <button
                  key={loc.val}
                  onClick={() => setSelectedCity(loc.val)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "surface-2 text-secondary hover:text-primary border border-border"
                  }`}
                >
                  <MapPin className="size-3 inline-block mr-1 opacity-70" />
                  {loc.label}
                </button>
              );
            })}

            {/* Targeted Filter Toggle Pill */}
            <button
              onClick={() => setOnlyTargeted(!onlyTargeted)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ml-auto ${
                onlyTargeted
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "surface-2 text-amber-400 hover:text-amber-300 border border-amber-500/30"
              }`}
            >
              🎯 Targeted ({targetedCount})
            </button>
          </div>
        </div>
      </div>

      {/* ── TASK 3: INTERACTIVE 3D CURSOR TILT COMPANY CARDS GRID ── */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl p-12 text-center surface border border-border space-y-3">
          <Building2 className="size-10 text-muted mx-auto opacity-40" />
          <p className="text-sm font-semibold text-primary">No matching companies found</p>
          <p className="text-xs text-muted">Try adjusting your search query, tier, or city filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {filtered.map((c) => {
            const isTargeted = !!targetedSet[c.id];
            return (
              <TiltCompanyCard
                key={c.id}
                company={c}
                isTargeted={isTargeted}
                onOpenMatchModal={handleOpenMatchModal}
              />
            );
          })}
        </div>
      )}

      {/* ── AI COMPANY MATCH & GAP ANALYZER MODAL ── */}
      {selectedMatchCompany && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="surface border border-orange-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
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
              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                <AlertCircle className="size-5 shrink-0 text-red-400" />
                <div>
                  <p className="font-bold text-red-400">No Resume Found</p>
                  <p className="text-muted mt-0.5">{matchError}</p>
                </div>
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
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-orange-500/15 border border-orange-500/30 min-w-[120px]">
                    <span className="text-3xl font-black text-orange-400">{matchData.match_score}%</span>
                    <span className="text-[10px] font-bold uppercase text-orange-400 tracking-wider mt-0.5">Match Score</span>
                  </div>
                </div>

                {/* Key Gaps & Strengths */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl surface-2 border border-border space-y-2">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-4" /> Strong Competencies
                    </p>
                    <ul className="text-xs text-secondary space-y-1">
                      {matchData.matched_skills.map((str: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl surface-2 border border-border space-y-2">
                    <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="size-4" /> Recommended Gaps to Bridge
                    </p>
                    <ul className="text-xs text-secondary space-y-1">
                      {matchData.missing_skills.map((skill, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Priority DSA Focus Topics */}
                {matchData.top_dsa_focus && matchData.top_dsa_focus.length > 0 && (
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

                {/* Target Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/dashboard/resume/rewrite"
                    className="flex-1 px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all text-center"
                  >
                    <Sparkles className="size-4" /> Optimize Resume for {selectedMatchCompany.name}
                  </Link>
                  <Link
                    href={`/dashboard/companies/${selectedMatchCompany.slug}`}
                    className="px-5 py-3 rounded-2xl font-bold text-xs surface-2 border border-border text-secondary hover:text-primary flex items-center justify-center gap-1.5 text-center"
                  >
                    View Interview Process →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
