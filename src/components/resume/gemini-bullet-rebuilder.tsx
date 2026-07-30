"use client";

import { useState } from "react";
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Building,
  Zap,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface BulletRebuildResult {
  original_bullet: string;
  rebuilt_bullet: string;
  action_verb_used: string;
  quantified_metric_added: string;
  target_company_alignment: string;
}

export function GeminiBulletRebuilder({
  initialBullet = "",
  companyId = "",
  companyName = "Target Company",
}: {
  initialBullet?: string;
  companyId?: string;
  companyName?: string;
}) {
  const [bullet, setBullet] = useState(
    initialBullet || "Built a backend API for an e-commerce website using Node.js and PostgreSQL database."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulletRebuildResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRebuild = async () => {
    if (!bullet || bullet.trim().length < 5) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/resumes/rebuild-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_bullet: bullet,
          target_company_id: companyId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bullet rebuild failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result?.rebuilt_bullet) return;
    navigator.clipboard.writeText(result.rebuilt_bullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-base font-extrabold flex items-center gap-2 text-primary">
              <Wand2 className="size-4 text-orange-500" />
              AI Resume Bullet Re-builder (STAR &amp; Quantified Metrics)
            </CardTitle>
            <CardDescription>
              Transform weak resume statements into high-impact bullets tailored for {companyName}.
            </CardDescription>
          </div>
          <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
            <Sparkles className="size-3" /> Powered by Gemini
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-secondary flex items-center justify-between">
            <span>Paste Candidate Resume Bullet Point:</span>
            <span className="text-[10px] text-muted">Original Input</span>
          </label>
          <textarea
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            rows={3}
            placeholder="e.g. Worked on building a full-stack website using React and Node.js..."
            className="w-full surface-2 border border-border rounded-xl p-3 text-xs text-primary focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>

        <Button
          onClick={handleRebuild}
          disabled={loading || !bullet.trim()}
          variant="primary"
          className="w-full shadow-md shadow-orange-500/20"
        >
          {loading ? (
            <>
              <RefreshCw className="size-4 animate-spin mr-1.5" /> Re-building Bullet with Gemini...
            </>
          ) : (
            <>
              <Sparkles className="size-4 mr-1.5" /> Re-build Bullet for {companyName}
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* ── BEFORE vs AFTER COMPARISON RESULT ── */}
        {result && (
          <div className="space-y-4 pt-2 animate-fade-up">
            {/* Before */}
            <div className="surface-2 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-1">
              <p className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">
                ❌ Original Weak Statement
              </p>
              <p className="text-xs text-secondary font-medium">
                {result.original_bullet}
              </p>
            </div>

            {/* After */}
            <div className="surface p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-3 relative shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Check className="size-4" /> ✅ Gemini Re-built Bullet ({companyName} Aligned)
                </p>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors flex items-center gap-1 border border-emerald-500/30"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy Bullet
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-primary leading-relaxed font-semibold font-mono bg-background/50 p-3 rounded-lg border border-emerald-500/30">
                {result.rebuilt_bullet}
              </p>

              {/* Upgrade Chips */}
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verb: {result.action_verb_used}
                </span>
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Metric: {result.quantified_metric_added}
                </span>
              </div>

              {result.target_company_alignment && (
                <p className="text-[11px] text-secondary font-medium italic pt-1 border-t border-emerald-500/20">
                  💡 {result.target_company_alignment}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
