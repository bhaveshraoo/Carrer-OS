"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Briefcase,
  Code2,
  TrendingUp,
  Star,
  ChevronDown,
  Info,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Check,
  AlertCircle,
  Scale,
} from "lucide-react";

export interface OverviewSection {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  accentColor: "orange" | "teal" | "amber" | "indigo" | "emerald" | "purple" | "rose";
  content: { key: string; val: string }[];
  textBlocks: string[];
  prosCons?: { pros: string[]; cons: string[] };
}

export function ExpandableOverviewList({ sections }: { sections: OverviewSection[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getIcon = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case "building": return <Building2 className={`size-5 ${colorClass}`} />;
      case "map": return <MapPin className={`size-5 ${colorClass}`} />;
      case "briefcase": return <Briefcase className={`size-5 ${colorClass}`} />;
      case "code": return <Code2 className={`size-5 ${colorClass}`} />;
      case "track": return <TrendingUp className={`size-5 ${colorClass}`} />;
      case "star": return <Star className={`size-5 ${colorClass}`} />;
      case "scale": return <Scale className={`size-5 ${colorClass}`} />;
      case "pros": return <ThumbsUp className={`size-5 ${colorClass}`} />;
      case "cons": return <ThumbsDown className={`size-5 ${colorClass}`} />;
      default: return <Info className={`size-5 ${colorClass}`} />;
    }
  };

  const getColorStyles = (accent: OverviewSection["accentColor"], isActive: boolean) => {
    switch (accent) {
      case "teal":
        return {
          icon: "text-teal-400",
          border: isActive
            ? "border-teal-500/50 bg-teal-500/10 shadow-lg shadow-teal-500/5 ring-1 ring-teal-500/20"
            : "border-border hover:border-teal-500/30 hover:bg-teal-500/[0.02]",
          badge: "bg-teal-500/15 text-teal-400 border-teal-500/30",
        };
      case "amber":
        return {
          icon: "text-amber-400",
          border: isActive
            ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20"
            : "border-border hover:border-amber-500/30 hover:bg-amber-500/[0.02]",
          badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "emerald":
        return {
          icon: "text-emerald-400",
          border: isActive
            ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20"
            : "border-border hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]",
          badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
      case "purple":
        return {
          icon: "text-purple-400",
          border: isActive
            ? "border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/20"
            : "border-border hover:border-purple-500/30 hover:bg-purple-500/[0.02]",
          badge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
        };
      case "rose":
        return {
          icon: "text-rose-400",
          border: isActive
            ? "border-rose-500/50 bg-rose-500/10 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/20"
            : "border-border hover:border-rose-500/30 hover:bg-rose-500/[0.02]",
          badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };
      case "indigo":
        return {
          icon: "text-indigo-400",
          border: isActive
            ? "border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/20"
            : "border-border hover:border-indigo-500/30 hover:bg-indigo-500/[0.02]",
          badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
        };
      default: // orange
        return {
          icon: "text-orange-400",
          border: isActive
            ? "border-orange-500/50 bg-orange-500/10 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/20"
            : "border-border hover:border-orange-500/30 hover:bg-orange-500/[0.02]",
          badge: "bg-orange-500/15 text-orange-400 border-orange-500/30",
        };
    }
  };

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        const isOpen = expandedId === section.id || hoveredId === section.id;
        const styles = getColorStyles(section.accentColor, isOpen);

        return (
          <div
            key={section.id}
            onMouseEnter={() => setHoveredId(section.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
            className={`surface rounded-2xl border ${styles.border} transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer overflow-hidden group`}
          >
            {/* Header Title Row */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`size-10 rounded-xl surface-2 border border-border flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "scale-110 shadow-md" : "group-hover:scale-105"}`}>
                  {getIcon(section.iconName, styles.icon)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md border text-muted">
                      0{idx + 1}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-primary tracking-tight">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-xs text-secondary truncate font-medium mt-0.5">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border hidden sm:inline-flex items-center gap-1 transition-all duration-300 ${styles.badge}`}>
                  {isOpen ? (
                    <>
                      <Sparkles className="size-3 animate-pulse" /> Active View
                    </>
                  ) : (
                    "Hover to Expand"
                  )}
                </span>
                <div className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-180 text-primary" : "text-muted group-hover:text-secondary"}`}>
                  <ChevronDown className="size-5" />
                </div>
              </div>
            </div>

            {/* Smooth Grid-Height Expansion */}
            <div
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`p-4 sm:p-5 pt-0 space-y-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                  }`}
                >
                  <div className="pt-3 border-t border-border/60 space-y-3">
                    {/* Render Pros & Cons in One Single Tile if prosCons object exists */}
                    {section.prosCons ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pros Column */}
                        <div className="surface-2 p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 space-y-2">
                          <p className="text-xs font-extrabold text-teal-400 flex items-center gap-1.5">
                            <ThumbsUp className="size-3.5" /> Work Culture Pros &amp; Advantages
                          </p>
                          <div className="space-y-1.5">
                            {section.prosCons.pros.map((p, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-secondary font-medium">
                                <Check className="size-3.5 text-teal-400 shrink-0 mt-0.5" />
                                <span>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cons Column */}
                        <div className="surface-2 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                          <p className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                            <ThumbsDown className="size-3.5" /> Work Considerations &amp; Cons
                          </p>
                          <div className="space-y-1.5">
                            {section.prosCons.cons.map((c, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-secondary font-medium">
                                <AlertCircle className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Content Key-Value Pairs */}
                        {section.content.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {section.content.map((item, i) => (
                              <div
                                key={i}
                                className="surface-2 p-4 rounded-xl border border-border/80 space-y-1 hover:border-border transition-colors shadow-xs"
                              >
                                <p className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider">
                                  {item.key}
                                </p>
                                <p className="text-xs text-secondary leading-relaxed font-medium">
                                  {item.val}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Additional Text Paragraphs */}
                        {section.textBlocks.length > 0 && (
                          <div className="space-y-2">
                            {section.textBlocks.map((block, i) => (
                              <div key={i} className="surface-2 p-4 rounded-xl border border-border/80">
                                <p className="text-xs text-secondary leading-relaxed font-medium">
                                  {block}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
