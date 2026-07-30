"use client";

import { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  MapPin,
  IndianRupee,
  Building,
} from "lucide-react";
import { TargetButton } from "@/app/dashboard/companies/target-button";
import type { CompanyData } from "./company-list";

interface TiltCompanyCardProps {
  company: CompanyData;
  isTargeted: boolean;
  onOpenMatchModal: (company: CompanyData) => void;
}

export function TiltCompanyCard({
  company,
  isTargeted,
  onOpenMatchModal,
}: TiltCompanyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate 3D tilt angles (max 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setSpotlight({ x, y, opacity: 1 });
  }

  function handleMouseLeave() {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSpotlight({ x: 50, y: 50, opacity: 0 });
  }

  const verified = !!company.metadata.verified;
  const rounds = company.hiring_rounds_count || 3;
  const topSkills = (company.required_skills || []).slice(0, 3);
  const city = company.metadata.city || "India Tech Hub";
  const ctc = company.metadata.ctc_range;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.15s ease-out, box-shadow 0.2s ease-out",
        transformStyle: "preserve-3d",
      }}
      className="group relative rounded-3xl p-6 surface border border-border/80 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden"
    >
      {/* Dynamic Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-0"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, rgba(249, 115, 22, 0.12), transparent 80%)`,
        }}
      />

      <div className="relative z-10 space-y-3.5">
        {/* Top Header: Initial Avatar + Name + AI Match */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className="size-13 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-inner transition-transform duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0.05) 100%)",
                border: "1px solid rgba(249,115,22,0.35)",
                color: "var(--orange)",
                boxShadow: "0 4px 14px rgba(249,115,22,0.15)",
              }}
            >
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-extrabold text-base text-primary group-hover:text-orange-400 transition-colors">
                  {company.name}
                </h3>
                {verified && (
                  <span title="Verified Placement Intel">
                    <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted font-medium">
                <span className="flex items-center gap-1 text-teal-400 font-bold">
                  <MapPin className="size-3" /> {city}
                </span>
                {company.metadata.tier && (
                  <span className="truncate max-w-[140px] font-semibold text-secondary">• {company.metadata.tier}</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Match Button */}
          <button
            onClick={() => onOpenMatchModal(company)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 hover:scale-105 active:scale-95 flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            <Bot className="size-3.5" /> AI Match
          </button>
        </div>

        {/* Badges Bar: Rounds + CTC + Intel */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl surface-2 border border-border text-secondary flex items-center gap-1">
            <Layers className="size-3.5 text-orange-400" /> {rounds} Rounds
          </span>

          {ctc && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
              <IndianRupee className="size-3.5" /> {ctc}
            </span>
          )}

          {verified ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
              <Sparkles className="size-3.5" /> Verified
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              General Pattern
            </span>
          )}
        </div>

        {/* Skills Tags */}
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topSkills.map((sk) => (
              <span
                key={sk}
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg surface-2 text-secondary border border-border/70"
              >
                {sk}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Target Button + View Process Link */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-border/80">
        <TargetButton companyId={company.id} companyName={company.name} initiallyTargeted={isTargeted} />
        <Link
          href={`/dashboard/companies/${company.slug}`}
          className="text-xs font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 transition-all group-hover:translate-x-1"
        >
          View Process <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
