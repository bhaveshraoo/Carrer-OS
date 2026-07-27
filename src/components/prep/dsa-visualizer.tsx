"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronRight, CheckCircle2, Circle, Clock, Zap, Sparkles } from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

export interface QuestionData {
  id: string;
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  solution_explanation: string | null;
}

const SAMPLE_STEPS: Record<string, { line: number; code: string; vars: Record<string, string>; log: string }[]> = {
  default: [
    { line: 1, code: "function solve(nums, target) {", vars: { nums: "[2, 7, 11, 15]", target: "9" }, log: "Initialize algorithm pointers" },
    { line: 2, code: "  let map = new Map();", vars: { map: "{}" }, log: "Create hash map for O(1) lookup" },
    { line: 3, code: "  for (let i = 0; i < nums.length; i++) {", vars: { i: "0", val: "2" }, log: "Iterate element nums[0] = 2" },
    { line: 4, code: "    let complement = target - nums[i];", vars: { i: "0", complement: "7" }, log: "Calculate complement = 9 - 2 = 7" },
    { line: 5, code: "    if (map.has(complement)) return [map.get(complement), i];", vars: { found: "false" }, log: "7 not in map yet" },
    { line: 6, code: "    map.set(nums[i], i);", vars: { map: "{ 2 => 0 }" }, log: "Store 2 => index 0 in map" },
    { line: 7, code: "  for (let i = 0; i < nums.length; i++) { // i = 1", vars: { i: "1", val: "7" }, log: "Iterate element nums[1] = 7" },
    { line: 8, code: "    let complement = target - nums[i];", vars: { i: "1", complement: "2" }, log: "Calculate complement = 9 - 7 = 2" },
    { line: 9, code: "    if (map.has(2)) return [0, 1]; // MATCH FOUND!", vars: { match: "[0, 1]", status: "SUCCESS" }, log: "Found 2 in map at index 0! Return [0, 1]" },
  ],
};

export function DsaQuestionCard({
  q,
  isRecommended,
}: {
  q: QuestionData;
  isRecommended: boolean;
}) {
  const { notify } = useNotifications();
  const [open, setOpen] = useState(false);

  // Stepper state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Local storage mastery state
  const [status, setStatus] = useState<"unsolved" | "in_progress" | "mastered">("unsolved");

  useEffect(() => {
    const saved = localStorage.getItem(`careeros-dsa-${q.id}`);
    if (saved === "mastered" || saved === "in_progress") {
      setStatus(saved);
    }
  }, [q.id]);

  function updateStatus(newStatus: "unsolved" | "in_progress" | "mastered") {
    setStatus(newStatus);
    localStorage.setItem(`careeros-dsa-${q.id}`, newStatus);

    if (newStatus === "mastered") {
      notify({
        type: "success",
        icon: "🏆",
        title: "Question Mastered!",
        body: `Marked "${q.title}" as Mastered. Progress saved!`,
        autoDismiss: 3000,
      });
    }
  }

  const steps = SAMPLE_STEPS.default;
  const currentStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        open ? "surface border-orange-500/40 shadow-xl" : "surface-2 border-border hover:border-orange-500/30"
      }`}
    >
      {/* Header bar */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none gap-4"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Difficulty pill */}
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize shrink-0 ${
              q.difficulty === "easy"
                ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                : q.difficulty === "medium"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {q.difficulty}
          </span>

          <span className="font-semibold text-sm text-primary truncate">
            {q.title}
          </span>

          {isRecommended && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <Sparkles className="size-3" /> Target Recommended
            </span>
          )}
        </div>

        {/* Right controls: Mastery Badge & Accordion Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const next = status === "unsolved" ? "in_progress" : status === "in_progress" ? "mastered" : "unsolved";
              updateStatus(next);
            }}
            className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              status === "mastered"
                ? "bg-teal-500 text-white shadow-sm"
                : status === "in_progress"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "surface text-muted border border-border hover:text-primary"
            }`}
            title="Click to toggle status: Unsolved ➔ In Progress ➔ Mastered"
          >
            {status === "mastered" ? (
              <CheckCircle2 className="size-3.5" />
            ) : status === "in_progress" ? (
              <Clock className="size-3.5 text-amber-400" />
            ) : (
              <Circle className="size-3.5" />
            )}
            <span className="capitalize">{status.replace("_", " ")}</span>
          </button>

          <svg
            className={`size-4 text-muted transition-transform duration-200 ${open ? "rotate-180 text-orange-400" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {open && (
        <div className="px-5 pb-5 pt-2 border-t border-border space-y-5 animate-fade-up">
          {/* Question Prompt */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Problem Statement</p>
            <p className="text-sm text-secondary leading-relaxed surface-2 p-3.5 rounded-2xl border border-border">
              {q.prompt}
            </p>
          </div>

          {/* Solution Approach & Complexity Badges */}
          {q.solution_explanation && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Optimal Solution Approach
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Time: O(N)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Space: O(N)
                  </span>
                </div>
              </div>
              <p className="text-xs text-secondary leading-relaxed surface p-3.5 rounded-2xl border border-border">
                {q.solution_explanation}
              </p>
            </div>
          )}

          {/* ── INTERACTIVE CONCEPT STEPPER / PSEUDO-CODE EXECUTION VISUALIZER ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Zap className="size-3.5 text-orange-500" /> Interactive Execution Visualizer
              </span>

              {/* Stepper Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1 transition-all"
                >
                  {isPlaying ? <Pause className="size-3" /> : <Play className="size-3" />}
                  {isPlaying ? "Pause" : "Play Stepper"}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                  }}
                  className="p-1 rounded-lg surface border border-border text-muted hover:text-primary transition-colors"
                  title="Reset Stepper"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Code Window with Stepper Line Highlight */}
            <div className="rounded-2xl overflow-hidden border border-border surface">
              <div className="px-4 py-2 bg-surface-2 border-b border-border flex items-center justify-between text-[11px] text-muted font-mono">
                <span>solution.js</span>
                <span>Step {currentStepIndex + 1} of {steps.length}</span>
              </div>

              <div className="p-4 font-mono text-xs space-y-1 overflow-x-auto">
                {steps.map((st, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 px-2 py-1 rounded-lg transition-colors ${
                        isCurrent
                          ? "bg-orange-500/20 text-orange-300 font-bold border-l-2 border-orange-500"
                          : "text-secondary opacity-70"
                      }`}
                    >
                      <span className="text-[10px] text-muted w-4 text-right shrink-0">{st.line}</span>
                      <span>{st.code}</span>
                    </div>
                  );
                })}
              </div>

              {/* Live Memory & Pointer State Inspector */}
              <div className="p-3.5 bg-surface-2 border-t border-border grid sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                    Live Memory Inspector
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {Object.entries(currentStep.vars).map(([k, v]) => (
                      <span key={k} className="px-2 py-0.5 rounded-md surface border border-border text-teal-400">
                        {k}: <strong className="text-primary">{v}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                    Execution Log
                  </p>
                  <p className="text-xs text-orange-400 font-mono flex items-center gap-1">
                    <ChevronRight className="size-3 text-orange-500" /> {currentStep.log}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
