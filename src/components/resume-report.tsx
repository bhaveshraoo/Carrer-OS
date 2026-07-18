import { ScoreRing } from "@/components/score-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeAnalysisReport } from "@/lib/resume/types";
import { CheckCircle2, AlertTriangle, ArrowRight, Tag } from "lucide-react";

const subScores = (scores: ResumeAnalysisReport["scores"]) => [
  { label: "ATS", value: scores.ats_score },
  { label: "Recruiter", value: scores.recruiter_score },
  { label: "HR Readability", value: scores.hr_readability_score },
  { label: "Industry Match", value: scores.industry_match_score },
];

const atsBreakdownLabels: Record<string, string> = {
  contact_info: "Contact info",
  skills_match: "Skills match",
  experience: "Experience",
  education: "Education",
  keywords: "Keywords",
  formatting: "Formatting",
};

export function ResumeReport({ report }: { report: ResumeAnalysisReport }) {
  const { scores, suggestions } = report;

  return (
    <div className="space-y-6">
      {/* Scores */}
      <Card>
        <CardContent className="pt-6 grid sm:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="flex justify-center">
            <ScoreRing score={scores.resume_score} size={140} />
          </div>
          <div className="space-y-3">
            {subScores(scores).map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-32 shrink-0">{s.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-navy-800"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-8 text-right">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ATS breakdown — why the ATS score is what it is, not just the headline number */}
      {scores.ats_breakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why your ATS score is {scores.ats_score}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(scores.ats_breakdown).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-slate-400 mb-1">{atsBreakdownLabels[key] ?? key}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-teal-600"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-6 text-right">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed">{scores.summary}</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 mb-2">
                Strengths
              </p>
              <ul className="space-y-1.5">
                {scores.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="size-4 text-teal-600 shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-500 mb-2">
                Needs work
              </p>
              <ul className="space-y-1.5">
                {scores.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewrite suggestions */}
      {suggestions.bullet_rewrites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bullet point rewrites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {suggestions.bullet_rewrites.map((b, i) => (
              <div key={i} className="text-sm space-y-1.5">
                <p className="text-slate-400 line-through decoration-slate-300">{b.original}</p>
                <p className="flex gap-2 text-slate-800 font-medium">
                  <ArrowRight className="size-4 text-teal-600 shrink-0 mt-0.5" />
                  {b.improved}
                </p>
                <p className="text-xs text-slate-400 pl-6">{b.reason}</p>
                {i < suggestions.bullet_rewrites.length - 1 && (
                  <div className="h-px bg-slate-100 mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Missing keywords + section suggestions */}
      {(suggestions.missing_ats_keywords.length > 0 || suggestions.section_suggestions.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>What to add</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.missing_ats_keywords.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Missing ATS keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.missing_ats_keywords.map((k, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
                    >
                      <Tag className="size-3" /> {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {suggestions.section_suggestions.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Section suggestions
                </p>
                <ul className="space-y-1.5">
                  {suggestions.section_suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-slate-700">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
