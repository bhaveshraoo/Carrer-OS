"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, CheckCircle2, ChevronRight, Building2, Sparkles } from "lucide-react";
import { TargetButton } from "@/app/dashboard/companies/target-button";

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
  };
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

  const filtered = companies.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(query.toLowerCase());
    const tierMatch = (c.metadata.tier ?? "").toLowerCase().includes(query.toLowerCase());

    if (!nameMatch && !tierMatch) return false;

    if (filterTier === "verified") return !!c.metadata.verified;
    if (filterTier === "product")
      return (c.metadata.tier ?? "").toLowerCase().includes("product") || (c.metadata.tier ?? "").toLowerCase().includes("big tech");
    if (filterTier === "services")
      return (c.metadata.tier ?? "").toLowerCase().includes("services") || (c.metadata.tier ?? "").toLowerCase().includes("consulting");

    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company by name or tier (e.g. Adobe, Big Tech)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm surface border border-border focus:outline-none focus:border-orange-500 transition-all text-primary placeholder:text-muted"
          />
        </div>

        {/* Tier filter pill buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all",      label: "All Companies" },
            { id: "verified", label: "Verified Only" },
            { id: "product",  label: "Product & Tech" },
            { id: "services", label: "IT Services" },
          ].map((tab) => {
            const isActive = filterTier === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTier(tab.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
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
          <p className="text-xs text-muted">Try adjusting your search query or tier filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const isTargeted = !!targetedSet[c.id];
            const verified = !!c.metadata.verified;
            return (
              <div
                key={c.id}
                className="group rounded-3xl p-5 surface border border-border hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {/* Top bar: initial logo + names + target button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-11 rounded-2xl flex items-center justify-center font-bold text-base transition-transform duration-300 group-hover:scale-105"
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
                          <h3 className="font-bold text-sm text-primary group-hover:text-orange-400 transition-colors">
                            {c.name}
                          </h3>
                          {verified && (
                            <span title="Verified Public Intel">
                              <CheckCircle2 className="size-3.5 text-teal-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        {c.metadata.tier && (
                          <p className="text-xs text-muted mt-0.5">{c.metadata.tier}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges / Intel summary */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {verified ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                        <Sparkles className="size-3" /> Verified Intel Roadmap
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        General Pattern
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom card action */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <TargetButton companyId={c.id} companyName={c.name} initiallyTargeted={isTargeted} />
                  <Link
                    href={`/dashboard/companies/${c.slug}`}
                    className="text-xs font-semibold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 transition-all group-hover:translate-x-0.5"
                  >
                    View Process <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
