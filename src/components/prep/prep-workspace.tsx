"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Code2,
  Brain,
  Globe,
  Layers,
  Building2,
  CheckCircle2,
  ChevronRight,
  Play,
  Circle,
  Zap,
  Target,
  BookOpen,
  ArrowLeft,
  Terminal,
  GraduationCap,
  Search,
  Filter,
  Flame,
  Award,
  BarChart3,
  X,
  Compass,
  Copy,
  Check,
  RotateCcw,
  Pause,
} from "lucide-react";
import { CompanyChip } from "@/components/company-chip";
import { useNotifications } from "@/components/notifications/notification-provider";
import { CodeEditorEvaluator } from "./code-editor-evaluator";
import { OSTeacherChat } from "./os-teacher-chat";
import { CircularTourVisualizer } from "./circular-tour-visualizer";
import { QUESTION_REGISTRY } from "@/lib/prep/question-solutions-registry";

export interface QuestionData {
  id: string;
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  solution_javascript?: string | null;
  solution_python?: string | null;
  solution_cpp?: string | null;
  solution_explanation: string | null;
  roadmaps?: string[];
}

export interface CompanyData {
  id: string;
  name: string;
}

interface PrepWorkspaceProps {
  companies: CompanyData[];
  targetedCompanyIds: string[];
  recommendedTopics: string[];
  questionsByTopic: Record<string, QuestionData[]>;
}

export interface StepItem {
  line: number;
  code: string;
  vars?: Record<string, string>;
  log: string;
  arrayState?: { val: string; active?: boolean; match?: boolean }[];
}

const DOMAIN_ROADMAPS = [
  {
    id: "easy-to-medium",
    title: "Foundation to Core (Easy → Medium)",
    icon: GraduationCap,
    accent: "#10B981",
    accentDim: "rgba(16, 185, 129, 0.15)",
    desc: "Build rock-solid fundamentals and master core problem-solving patterns required for campus placements.",
    allowedDiffs: ["easy", "medium"],
    topics: [
      "arrays",
      "strings",
      "linked-lists",
      "stacks-queues",
      "trees",
      "graphs",
      "dp",
      "greedy",
      "recursion",
      "basic-programming",
      "math-number-theory",
      "sql",
      "oop-concepts",
      "pseudocode",
      "web-development",
    ],
  },
  {
    id: "medium-to-hard",
    title: "Advanced to Expert (Medium → Hard)",
    icon: Flame,
    accent: "#EF4444",
    accentDim: "rgba(239, 68, 68, 0.15)",
    desc: "Tackle complex algorithmic challenges, dynamic programming optimizations, and hard FAANG interview problems.",
    allowedDiffs: ["medium", "hard"],
    topics: [
      "arrays",
      "strings",
      "linked-lists",
      "stacks-queues",
      "trees",
      "graphs",
      "dp",
      "greedy",
      "recursion",
      "basic-programming",
      "math-number-theory",
      "sql",
      "oop-concepts",
      "pseudocode",
      "web-development",
    ],
  },
  {
    id: "sde",
    title: "Tier-1 SDE & FAANG Core",
    icon: Code2,
    accent: "var(--orange)",
    accentDim: "var(--orange-glow)",
    desc: "High-frequency interview problems on Arrays, DP, Graphs, and Binary Trees for top product companies.",
    topics: ["arrays", "graphs", "dp", "trees", "linked-lists"],
  },
  {
    id: "web-dev",
    title: "Full-Stack & Web Architecture",
    icon: Globe,
    accent: "var(--teal)",
    accentDim: "var(--teal-dim)",
    desc: "Asynchronous JavaScript, SQL Query Optimization, Queue Systems, and API Logic.",
    topics: ["web-development", "sql", "stacks-queues", "strings"],
  },
  {
    id: "ai-ml",
    title: "AI, ML & Data Engineering",
    icon: Brain,
    accent: "#3B82F6",
    accentDim: "rgba(59, 130, 246, 0.15)",
    desc: "Math & Number Theory, Matrix Operations, Hash Maps, Vector Search & Optimization.",
    topics: ["math-number-theory", "basic-programming", "arrays", "dp"],
  },
  {
    id: "oops",
    title: "Low-Level Design & OOPs",
    icon: Layers,
    accent: "var(--amber)",
    accentDim: "var(--amber-dim)",
    desc: "Object-Oriented Design, Design Patterns, Pseudocode Analysis, and Memory Allocation.",
    topics: ["oop-concepts", "pseudocode", "recursion"],
  },
];

const TOPIC_LABELS: Record<string, string> = {
  arrays:              "Arrays & Hashing",
  strings:             "Strings & Matching",
  dp:                  "Dynamic Programming",
  graphs:              "Graphs & BFS/DFS",
  trees:               "Trees & BST",
  "linked-lists":      "Linked Lists",
  "stacks-queues":     "Stacks & Queues",
  greedy:              "Greedy Algorithms",
  recursion:           "Recursion & Backtracking",
  sql:                 "SQL & Database Queries",
  "basic-programming": "Basic Programming",
  "oop-concepts":      "OOP Concepts & LLD",
  "math-number-theory":"Math & Number Theory",
  pseudocode:          "Pseudocode & Logic",
  "web-development":   "Web Development & APIs",
};

const DIFFICULTY_ORDER: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function sortQuestionsByDifficulty(questions: QuestionData[]): QuestionData[] {
  return [...questions].sort((a, b) => {
    const diffA = DIFFICULTY_ORDER[a.difficulty.toLowerCase()] || 4;
    const diffB = DIFFICULTY_ORDER[b.difficulty.toLowerCase()] || 4;
    if (diffA !== diffB) return diffA - diffB;
    return a.title.localeCompare(b.title);
  });
}

function getCleanFuncName(title: string): string {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, "").split(" ");
  if (words.length === 0) return "solveAlgorithm";
  return words[0].toLowerCase() + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function getDynamicExecutionSteps(q: QuestionData): StepItem[] {
  const normalizedTitle = q.title.toLowerCase().trim();
  if (QUESTION_REGISTRY[normalizedTitle]) {
    return QUESTION_REGISTRY[normalizedTitle].visualizerSteps;
  }

  const funcName = getCleanFuncName(q.title);

  return [
    { line: 1, code: `function ${funcName}(nums, target) {`, vars: { nums: "[2, 7, 11, 15]", target: "9" }, log: `Initialize algorithm execution for "${q.title}"`, arrayState: [{ val: "2" }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 2, code: "  let map = new Map();", vars: { map: "{}" }, log: "Create hash map for O(1) constant time lookup", arrayState: [{ val: "2" }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 3, code: "  for (let i = 0; i < nums.length; i++) {", vars: { i: "0", val: "2" }, log: "Inspect element at index 0: value 2", arrayState: [{ val: "2", active: true }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 4, code: "    let complement = target - nums[i];", vars: { i: "0", complement: "7" }, log: "Compute complement: 9 - 2 = 7", arrayState: [{ val: "2", active: true }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 5, code: "    if (map.has(complement)) return [map.get(complement), i];", vars: { found: "false" }, log: "Check hash map for complement 7", arrayState: [{ val: "2", active: true }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 6, code: "    map.set(nums[i], i);", vars: { map: "{ 2 => 0 }" }, log: "Store key 2 at index 0 in map", arrayState: [{ val: "2", match: true }, { val: "7", match: true }, { val: "11" }, { val: "15" }] },
    { line: 7, code: "  // Match found at i = 1, complement = 2", vars: { i: "1", val: "7" }, log: "Advance loop pointer to index 1: value 7", arrayState: [{ val: "2", match: true }, { val: "7", active: true }, { val: "11" }, { val: "15" }] },
    { line: 8, code: "    if (map.has(2)) return [0, 1]; // MATCH FOUND!", vars: { match: "[0, 1]", status: "SUCCESS" }, log: "Match found! Return target indices [0, 1]", arrayState: [{ val: "2", match: true }, { val: "7", match: true }, { val: "11" }, { val: "15" }] },
  ];
}

function convertCppToJS(cppCode: string, funcName: string): string {
  if (!cppCode || cppCode.trim().length === 0) return "";
  let clean = cppCode;
  clean = clean.replace(/class Solution\s*\{\s*public:\s*/g, "");
  clean = clean.replace(/vector<int>&?/g, "Array");
  clean = clean.replace(/vector<string>&?/g, "Array");
  clean = clean.replace(/vector<vector<int>>&?/g, "Array");
  clean = clean.replace(/unordered_map<[^>]+>/g, "Map");
  clean = clean.replace(/unordered_set<[^>]+>/g, "Set");
  clean = clean.replace(/\.size\(\)/g, ".length");
  clean = clean.replace(/\.push_back\(/g, ".push(");

  if (!clean.includes("function") && !clean.includes("const ") && !clean.includes("let ")) {
    return `// JavaScript Solution\nfunction ${funcName}(nums) {\n  ${clean.trim()}\n}`;
  }
  return clean.trim();
}

function convertCppToPython(cppCode: string, funcName: string): string {
  if (!cppCode || cppCode.trim().length === 0) return "";
  let pyFunc = funcName.replace(/([A-Z])/g, "_$1").toLowerCase();
  if (pyFunc.startsWith("_")) pyFunc = pyFunc.slice(1);
  return `# Python Solution\ndef ${pyFunc}(nums):\n    ${cppCode.replace(/\n/g, "\n    ").trim()}`;
}

function cleanStepByStepExplanation(rawExplanation: string): string {
  if (!rawExplanation) return "";

  let cleaned = rawExplanation;

  // 1. Remove all fenced code blocks (```lang ... ```)
  cleaned = cleaned.replace(/```[a-z]*[\s\S]*?```/gi, "");

  // 2. Remove "Reference Solution (...):` or "Solution (...):` headers
  cleaned = cleaned.replace(/(?:Reference\s+)?Solution\s*\([^)]*\)\s*:?/gi, "");

  // 3. Remove "Roadmaps: ...` metadata lines
  cleaned = cleaned.replace(/Roadmaps\s*:\s*[^\n]+/gi, "");

  // 4. Clean up empty lines and trim
  const lines = cleaned.split("\n").map((line) => line.trim());
  const resultLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length > 0) {
      resultLines.push(line);
    } else if (resultLines.length > 0 && resultLines[resultLines.length - 1] !== "") {
      resultLines.push("");
    }
  }

  return resultLines.join("\n").trim();
}

/** Syntax-highlighted code display for Solution & Explanation box */
function ColorfulCodeBlock({ code, lang }: { code: string; lang: string }) {
  const lines = code.split("\n");
  const keywords = ["function", "const", "let", "var", "return", "if", "else", "for", "while", "class", "public", "private", "def", "import", "from", "int", "bool", "string", "void", "new", "this", "true", "false", "null", "undefined", "SELECT", "FROM", "WHERE", "GROUP", "BY", "ORDER", "HAVING", "AND", "OR"];
  const builtins = ["Map", "Set", "Array", "vector", "unordered_map", "Math", "Object", "Promise", "console", "JSON"];
  const methods = ["push", "pop", "shift", "has", "get", "set", "map", "filter", "reduce", "includes", "indexOf", "split", "join", "slice", "splice", "floor", "ceil", "max", "min", "abs", "size", "length", "append", "sort"];

  function tokenizeAndColor(line: string) {
    // Full line comment
    if (line.trim().startsWith("//") || line.trim().startsWith("#") || line.trim().startsWith("--")) {
      return <span className="text-slate-500 italic">{line}</span>;
    }

    // Simple token-by-token colorizer
    const result: React.ReactNode[] = [];
    let rest = line;
    let key = 0;

    // Leading whitespace
    const leadingMatch = rest.match(/^(\s+)/);
    if (leadingMatch) {
      result.push(<span key={key++}>{leadingMatch[1]}</span>);
      rest = rest.slice(leadingMatch[1].length);
    }

    // Tokenize by boundaries
    const tokenRegex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/.*|\/\*[\s\S]*?\*\/|\d+\.?\d*|[a-zA-Z_$][a-zA-Z0-9_$]*|[^\w\s]|\s+)/g;
    const tokens = rest.match(tokenRegex) || [rest];

    for (const token of tokens) {
      if (keywords.includes(token)) {
        result.push(<span key={key++} className="text-orange-400 font-bold">{token}</span>);
      } else if (builtins.includes(token)) {
        result.push(<span key={key++} className="text-purple-400 font-bold">{token}</span>);
      } else if (methods.includes(token)) {
        result.push(<span key={key++} className="text-teal-300">{token}</span>);
      } else if (/^".*"$/.test(token) || /^'.*'$/.test(token) || /^`.*`$/.test(token)) {
        result.push(<span key={key++} className="text-emerald-300">{token}</span>);
      } else if (/^\d+\.?\d*$/.test(token)) {
        result.push(<span key={key++} className="text-cyan-300 font-bold">{token}</span>);
      } else if (["(", ")", "{", "}", "[", "]", ";", ","].includes(token)) {
        result.push(<span key={key++} className="text-slate-400">{token}</span>);
      } else if (["=>", "===", "!==", "==", "!=", "<=", ">=", "<", ">", "&&", "||", "!", "+", "-", "*", "/", "%", "=", "&", "|", "^", "~"].includes(token)) {
        result.push(<span key={key++} className="text-amber-300">{token}</span>);
      } else {
        result.push(<span key={key++} className="text-slate-200">{token}</span>);
      }
    }
    return result;
  }

  return (
    <div className="font-mono text-sm leading-7 overflow-x-auto">
      {lines.map((line, idx) => (
        <div key={idx} className="flex gap-4 hover:bg-white/5 px-2 rounded transition-colors">
          <span className="text-slate-600 text-xs select-none w-6 text-right shrink-0 pt-0.5">{idx + 1}</span>
          <span className="whitespace-pre">{tokenizeAndColor(line)}</span>
        </div>
      ))}
    </div>
  );
}

function QuestionSolutionView({ question }: { question: QuestionData }) {
  const [solLang, setSolLang] = useState<"cpp" | "javascript" | "python">("javascript");
  const [copied, setCopied] = useState(false);

  const explanation = question.solution_explanation || "";
  const cleanedExplanation = cleanStepByStepExplanation(explanation);

  const jsCodeMatch = explanation.match(/```javascript\s*([\s\S]*?)```/i);
  const pyCodeMatch = explanation.match(/```python\s*([\s\S]*?)```/i);
  const cppCodeMatch = explanation.match(/```cpp\s*([\s\S]*?)```/i);

  const cppCode = question.solution_cpp || (cppCodeMatch ? cppCodeMatch[1].trim() : "");
  const funcName = getCleanFuncName(question.title);
  const jsCode = question.solution_javascript || (jsCodeMatch ? jsCodeMatch[1].trim() : (cppCode ? convertCppToJS(cppCode, funcName) : `// JavaScript Solution\nfunction ${funcName}() {\n  // Solution code\n}`));
  const pyCode = question.solution_python || (pyCodeMatch ? pyCodeMatch[1].trim() : (cppCode ? convertCppToPython(cppCode, funcName) : `# Python Solution\ndef ${funcName}():\n    pass`));

  const activeCode = solLang === "javascript" ? jsCode : solLang === "python" ? pyCode : cppCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const promptLines = question.prompt.split("\n");

  // Parse explanation into numbered steps
  const explanationSteps = cleanedExplanation
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .map((l, i) => ({ idx: i, text: l }));

  return (
    <div className="surface border border-border rounded-3xl p-7 sm:p-10 space-y-8 shadow-xl animate-fade-up">
      {/* Question Header & Title */}
      <div className="space-y-4 pb-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-orange-400 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
            {TOPIC_LABELS[question.topic] ?? question.topic}
          </span>
          <span className="text-sm font-bold capitalize text-teal-400 bg-teal-500/10 px-4 py-1.5 rounded-full border border-teal-500/20">
            🟢 {question.difficulty}
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary flex items-center gap-3">
          <BookOpen className="size-8 text-orange-500 shrink-0" />
          {question.title}
        </h2>
      </div>

      {/* Problem Prompt Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-extrabold text-muted uppercase tracking-wider flex items-center gap-2">
          <Terminal className="size-4 text-orange-500" /> Problem Statement & Requirement
        </h4>
        <div className="surface-2 p-6 rounded-2xl border border-border text-base text-secondary leading-relaxed space-y-2 font-sans">
          {promptLines.map((line, idx) => (
            <p key={idx} className="whitespace-pre-wrap">{line}</p>
          ))}
        </div>
      </div>

      {/* Explanation & Steps Breakdown - nicely formatted */}
      <div className="space-y-4">
        <h4 className="text-sm font-extrabold text-muted uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500" /> Step-by-Step Logic Breakdown & Complexity
        </h4>

        <div className="surface-2 p-6 rounded-2xl border border-border space-y-3">
          {explanationSteps.length > 0 ? (
            <div className="space-y-3">
              {explanationSteps.map(({ idx, text }) => {
                const isStep = /^step\s*\d+/i.test(text) || /^\d+\.\s/.test(text);
                const isComplexity = /complexity/i.test(text);
                return (
                  <div key={idx} className={`flex gap-3 items-start ${isStep ? "pt-1" : ""}`}>
                    {isStep ? (
                      <span className="shrink-0 size-6 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                    ) : isComplexity ? (
                      <span className="shrink-0 size-6 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-bold flex items-center justify-center mt-0.5">⏱</span>
                    ) : (
                      <ChevronRight className="size-4 text-orange-400 shrink-0 mt-1" />
                    )}
                    <p className={`text-base leading-relaxed ${isComplexity ? "text-teal-300 font-mono font-bold" : "text-secondary"}`}>
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-base text-muted italic">Detailed logic breakdown available.</p>
          )}
        </div>
      </div>

      {/* Multi-Language Solution Viewer */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h4 className="text-sm font-extrabold text-muted uppercase tracking-wider flex items-center gap-2">
            <Code2 className="size-4 text-teal-400" /> Official Multi-Language Reference Solutions
          </h4>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 surface-2 p-1 rounded-xl border border-border">
              {(["javascript", "python", "cpp"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setSolLang(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${
                    solLang === l
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {l === "cpp" ? "C++" : l === "javascript" ? "JS" : "Python"}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl surface-2 border border-border hover:border-orange-500/40 text-sm font-bold text-secondary hover:text-primary transition-all flex items-center gap-1.5"
            >
              {copied ? <CheckCircle2 className="size-4 text-teal-400" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>

        {/* Colorful Code Snippet Box */}
        <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg">
          {/* Code editor top bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#111117] border-b border-white/5">
            <span className="size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="size-3 rounded-full bg-teal-500/80 inline-block" />
            <span className="ml-3 text-xs text-slate-500 font-mono">
              solution.{solLang === "javascript" ? "js" : solLang === "python" ? "py" : "cpp"}
            </span>
          </div>
          <div className="p-5 bg-[#0D0D12] overflow-x-auto max-h-[500px] overflow-y-auto">
            <ColorfulCodeBlock code={activeCode} lang={solLang} />
          </div>
        </div>
      </div>
    </div>
  );
}

function cleanQuestionTitle(t: string): string {
  return t.toLowerCase().replace(/[''"'`]/g, "").replace(/\s+/g, " ").trim();
}

function getRegistryEntry(qTitle: string) {
  const titleClean = cleanQuestionTitle(qTitle);
  if (QUESTION_REGISTRY[qTitle.toLowerCase().trim()]) {
    return QUESTION_REGISTRY[qTitle.toLowerCase().trim()];
  }
  for (const [key, entry] of Object.entries(QUESTION_REGISTRY)) {
    if (cleanQuestionTitle(key) === titleClean) {
      return entry;
    }
  }
  return null;
}

function hasQuestionVisualizer(q: QuestionData | null): boolean {
  if (!q) return false;
  const titleClean = cleanQuestionTitle(q.title);
  if (titleClean.includes("circular tour") || titleClean.includes("petrol pump")) {
    return true;
  }
  return Boolean(getRegistryEntry(q.title));
}

function RegistryVisualizer({ question, steps }: { question: QuestionData; steps: StepItem[] }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed] = useState<number>(1.2);
  const [justCompleted, setJustCompleted] = useState(false);

  const currentStep = steps[stepIndex] || steps[0];
  const isLast = stepIndex === steps.length - 1;

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
    setJustCompleted(false);
  }, [question.id]);

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            setJustCompleted(true);
            return prev;
          }
          return prev + 1;
        });
      }, speed * 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

  // Auto-reset to step 0 after 5 seconds of completion
  useEffect(() => {
    if (!justCompleted) return;
    const resetTimer = setTimeout(() => {
      setStepIndex(0);
      setJustCompleted(false);
    }, 5000);
    return () => clearTimeout(resetTimer);
  }, [justCompleted]);

  return (
    <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-extrabold mb-1">
            <Sparkles className="size-3.5 text-orange-500" /> CareerOS Interactive Visual Engine
          </div>
          <h2 className="font-display text-2xl font-extrabold text-primary flex items-center gap-2.5">
            <Zap className="size-6 text-orange-500" /> {question.title} Visualizer
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {justCompleted && (
            <span className="text-xs font-mono font-extrabold text-teal-400 bg-teal-500/15 px-3 py-1.5 rounded-xl border border-teal-500/30 animate-pulse">
              ✅ Complete! Resetting in 5s…
            </span>
          )}
          <span className="text-xs font-mono font-extrabold text-orange-400 bg-orange-500/15 px-3 py-1.5 rounded-xl border border-orange-500/30">
            Step {stepIndex + 1} / {steps.length}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Array State + Variable Inspector */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Data State Visualizer Box */}
          <div className="surface-2 border border-border rounded-3xl p-6 space-y-4 shadow-inner">
            <p className="text-xs font-extrabold text-muted uppercase tracking-wider flex items-center gap-2">
              <Layers className="size-3.5 text-orange-400" /> Current Data Structure State
            </p>

            {currentStep.arrayState && currentStep.arrayState.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 py-6 justify-center min-h-[140px]">
                {currentStep.arrayState.map((item, idx) => (
                  <div
                    key={idx}
                    className={`min-w-[56px] px-2 py-2 rounded-2xl flex flex-col items-center justify-center font-mono font-extrabold text-sm border-2 transition-all duration-300 shadow-md ${
                      item.match
                        ? "bg-teal-500/20 border-teal-400 text-teal-300 scale-110 shadow-teal-500/30 ring-4 ring-teal-500/20"
                        : item.active
                        ? "bg-orange-500/20 border-orange-500 text-orange-300 scale-110 shadow-orange-500/30 ring-4 ring-orange-500/20 animate-pulse"
                        : "bg-surface border-border text-secondary"
                    }`}
                  >
                    <span className="text-[10px] text-muted font-normal">idx {idx}</span>
                    <span className="text-center leading-tight break-all max-w-[80px]">{item.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Variable Inspector */}
          {currentStep.vars && Object.keys(currentStep.vars).length > 0 && (
            <div className="surface-2 border border-border rounded-2xl p-4 space-y-2">
              <p className="text-xs font-extrabold text-muted uppercase tracking-wider">
                Variable State Inspector
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm font-mono">
                {Object.entries(currentStep.vars).map(([k, v]) => (
                  <div key={k} className="surface p-3 rounded-xl border border-border">
                    <span className="text-muted block text-xs uppercase mb-0.5">{k}</span>
                    <span className="text-orange-400 font-extrabold text-base">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Full Code with Line Highlight + Log */}
        <div className="lg:col-span-5 space-y-5">
          {/* Full Code Viewer with active line highlight */}
          <div className="surface-2 border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#111117] border-b border-white/5">
              <Terminal className="size-3.5 text-orange-400" />
              <p className="text-xs font-extrabold text-muted uppercase tracking-wider">
                Active Code Line
              </p>
              <span className="ml-auto text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                L{currentStep.line}
              </span>
            </div>
            {/* Full code pane with highlighted active line */}
            <div className="p-2 bg-[#0D0D12] overflow-y-auto max-h-64 font-mono text-sm">
              {steps.map((st, idx) => {
                const isActive = idx === stepIndex;
                const isPast = idx < stepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 px-2 py-1 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-orange-500/20 border-l-2 border-orange-500"
                        : isPast
                        ? "opacity-40"
                        : "opacity-25"
                    }`}
                  >
                    <span className="text-slate-600 text-xs w-5 text-right shrink-0 mt-0.5">{st.line}</span>
                    <span className={`leading-relaxed break-all ${isActive ? "text-orange-300 font-bold" : "text-slate-400"}`}>
                      {st.code}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Execution Log */}
          <div className="p-5 rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-200 space-y-2 shadow-lg">
            <p className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Sparkles className="size-4" /> Step Execution Log
            </p>
            <p className="text-sm leading-relaxed font-sans font-medium text-primary">
              {currentStep.log}
            </p>
          </div>
        </div>
      </div>

      {/* Playback Controls — full-width slider */}
      <div className="surface-2 border border-border p-4 rounded-2xl flex flex-col gap-4">
        {/* Controls row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPlaying(false);
              setStepIndex(0);
              setJustCompleted(false);
            }}
            className="p-2.5 rounded-xl surface border border-border hover:border-orange-500/40 text-secondary hover:text-primary transition-all"
            title="Reset"
          >
            <RotateCcw className="size-4" />
          </button>

          <button
            onClick={() => {
              if (stepIndex > 0) setStepIndex(stepIndex - 1);
            }}
            disabled={stepIndex === 0}
            className="p-2.5 rounded-xl surface border border-border hover:border-orange-500/40 text-secondary hover:text-primary transition-all disabled:opacity-40"
          >
            <ChevronRight className="size-4 rotate-180" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
          >
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            onClick={() => {
              if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
            }}
            disabled={isLast}
            className="p-2.5 rounded-xl surface border border-border hover:border-orange-500/40 text-secondary hover:text-primary transition-all disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>

          <span className="ml-auto text-xs font-mono text-muted">
            {stepIndex + 1} / {steps.length}
          </span>
        </div>

        {/* Full-width slider */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-muted font-mono shrink-0">1</span>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={stepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setJustCompleted(false);
              setStepIndex(Number(e.target.value));
            }}
            className="flex-1 accent-orange-500 cursor-pointer h-2"
          />
          <span className="text-xs text-muted font-mono shrink-0">{steps.length}</span>
        </div>
      </div>
    </div>
  );
}

function QuestionVisualizerRouter({ question }: { question: QuestionData }) {
  const titleClean = cleanQuestionTitle(question.title);

  // Custom 10x Circular Tour (Petrol Pump Problem) visualizer ONLY for petrol pump problem
  if (titleClean.includes("circular tour") || titleClean.includes("petrol pump")) {
    return <CircularTourVisualizer />;
  }

  const entry = getRegistryEntry(question.title);
  if (entry) {
    return <RegistryVisualizer question={question} steps={entry.visualizerSteps} />;
  }

  return null;
}

export function PrepWorkspace({
  companies,
  targetedCompanyIds: initialTargetedCompanyIds,
  recommendedTopics,
  questionsByTopic,
}: PrepWorkspaceProps) {
  const { notify } = useNotifications();

  // Active view: null = Track Explorer Hub, string = active track ID
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const [showCompanyManager, setShowCompanyManager] = useState(false);
  const [companyNotice, setCompanyNotice] = useState<string | null>(null);

  // Target company state
  const [activeTargetCompanyIds, setActiveTargetCompanyIds] = useState<string[]>(initialTargetedCompanyIds);

  // Active topic & question selection
  const [activeTopic, setActiveTopic] = useState<string>("");
  const [activeQuestion, setActiveQuestion] = useState<QuestionData | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [activeAllowedDiffs, setActiveAllowedDiffs] = useState<string[] | undefined>(undefined);

  // Workspace sub-tab: 'solution' vs 'editor' vs 'stepper' vs 'teacher' (DEFAULT TO SOLUTION!)
  const [workspaceTab, setWorkspaceTab] = useState<"solution" | "editor" | "stepper" | "teacher">("solution");

  // Execution visualizer state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Local storage solved status
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, "unsolved" | "in_progress" | "mastered">>({});

  // Sync localStorage completed question statuses on mount
  useEffect(() => {
    try {
      const loaded: Record<string, "unsolved" | "in_progress" | "mastered"> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("careeros-dsa-")) {
          const qId = key.replace("careeros-dsa-", "");
          const val = localStorage.getItem(key);
          if (val === "mastered" || val === "in_progress" || val === "unsolved") {
            loaded[qId] = val;
          }
        }
      }
      setQuestionStatuses(loaded);
    } catch (e) {
      console.error("Error reading localStorage question statuses", e);
    }
  }, []);

  // Sync admin published questions from localStorage & window event
  const [adminQuestions, setAdminQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    const loadAdminQuestions = () => {
      try {
        const saved = localStorage.getItem("careeros_admin_questions");
        if (saved) {
          const parsed: any[] = JSON.parse(saved);
          const mapped: QuestionData[] = parsed.map((item) => ({
            id: item.id,
            title: item.title,
            topic: item.topic.toLowerCase(),
            difficulty: item.difficulty.toLowerCase() as any,
            prompt: item.prompt,
            solution_explanation: item.solution_explanation,
            solution_javascript: item.solution_javascript,
            solution_python: item.solution_python,
            solution_cpp: item.solution_cpp,
            roadmaps: item.roadmaps || [item.roadmap, "easy-to-medium"],
          }));

          setAdminQuestions(mapped);

          // Register visualizer steps into QUESTION_REGISTRY
          parsed.forEach((item) => {
            if (item.visualizerSteps && item.visualizerSteps.length > 0) {
              const key = item.title.toLowerCase().trim();
              QUESTION_REGISTRY[key] = {
                solutionJS: item.solution_javascript || "",
                solutionPY: item.solution_python || "",
                solutionCPP: item.solution_cpp || "",
                visualizerSteps: item.visualizerSteps,
              };
            }
          });
        }
      } catch (e) {
        console.error("Error syncing admin questions", e);
      }
    };

    loadAdminQuestions();
    window.addEventListener("storage", loadAdminQuestions);
    window.addEventListener("careeros_admin_questions_updated", loadAdminQuestions);
    return () => {
      window.removeEventListener("storage", loadAdminQuestions);
      window.removeEventListener("careeros_admin_questions_updated", loadAdminQuestions);
    };
  }, []);

  // Merge adminQuestions into questionsByTopic
  const effectiveQuestionsByTopic = useMemo(() => {
    const merged: Record<string, QuestionData[]> = {};
    Object.keys(questionsByTopic).forEach((t) => {
      merged[t] = [...questionsByTopic[t]];
    });

    adminQuestions.forEach((q) => {
      const t = q.topic.toLowerCase();
      if (!merged[t]) merged[t] = [];
      if (!merged[t].some((existing) => existing.id === q.id)) {
        merged[t].unshift(q);
      }
    });

    return merged;
  }, [questionsByTopic, adminQuestions]);

  const showVisualizerTab = hasQuestionVisualizer(activeQuestion);

  useEffect(() => {
    if (workspaceTab === "stepper" && !showVisualizerTab) {
      setWorkspaceTab("solution");
    }
  }, [activeQuestion?.id, showVisualizerTab, workspaceTab]);

  // Calculate global stats
  const totalQuestions = useMemo(() => {
    return Object.values(effectiveQuestionsByTopic).reduce((acc, list) => acc + list.length, 0);
  }, [effectiveQuestionsByTopic]);

  const masteredCount = useMemo(() => {
    return Object.values(questionStatuses).filter((s) => s === "mastered").length;
  }, [questionStatuses]);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [activeQuestion?.id]);

  function handleToggleTargetCompany(companyId: string, targeted: boolean) {
    if (targeted) {
      setActiveTargetCompanyIds((prev) => [...new Set([...prev, companyId])]);
      setCompanyNotice(null);
    } else {
      setActiveTargetCompanyIds((prev) => prev.filter((id) => id !== companyId));
    }
  }

  function handleSelectRoadmap(id: string, initialTopics: string[], allowedDiffs?: string[]) {
    if (id === "company" && activeTargetCompanyIds.length === 0) {
      setShowCompanyManager(true);
      setCompanyNotice("⚠️ No target company selected yet. Choose your target companies below to launch your customized track!");
      return;
    }

    setSelectedRoadmap(id);
    setActiveAllowedDiffs(allowedDiffs);
    setDifficultyFilter("all");

    const firstTopic = initialTopics[0] || Object.keys(questionsByTopic)[0] || "arrays";
    setActiveTopic(firstTopic);

    const topicQs = questionsByTopic[firstTopic] || [];
    const filteredQs = topicQs.filter((q) => Array.isArray(q.roadmaps) && q.roadmaps.includes(id));
    if (filteredQs.length > 0) {
      const sorted = sortQuestionsByDifficulty(filteredQs);
      setActiveQuestion(sorted[0]);
    } else {
      let foundQ: QuestionData | null = null;
      for (const [tKey, qList] of Object.entries(questionsByTopic)) {
        if (!initialTopics.includes(tKey)) continue;
        const match = qList.find((q) => Array.isArray(q.roadmaps) && q.roadmaps.includes(id));
        if (match) {
          foundQ = match;
          setActiveTopic(tKey);
          break;
        }
      }
      if (foundQ) {
        setActiveQuestion(foundQ);
      } else if (topicQs.length > 0) {
        setActiveQuestion(topicQs[0]);
      }
    }
  }

  const targetedCompanyNames = companies
    .filter((c) => activeTargetCompanyIds.includes(c.id))
    .map((c) => c.name);

  const getTrackCount = (topics: string[], roadmapId: string) => {
    return topics.reduce((acc, t) => {
      const list = effectiveQuestionsByTopic[t] || [];
      return acc + list.filter((q) => Array.isArray(q.roadmaps) && q.roadmaps.includes(roadmapId)).length;
    }, 0);
  };

  const getTrackStats = (topics: string[], roadmapId: string) => {
    let total = 0;
    let mastered = 0;
    topics.forEach((t) => {
      const list = effectiveQuestionsByTopic[t] || [];
      list.forEach((q) => {
        if (Array.isArray(q.roadmaps) && q.roadmaps.includes(roadmapId)) {
          total++;
          if (questionStatuses[q.id] === "mastered") {
            mastered++;
          }
        }
      });
    });
    const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, percentage };
  };

  const getCompanyTrackStats = () => {
    let total = 0;
    let mastered = 0;
    recommendedTopics.forEach((t) => {
      const list = effectiveQuestionsByTopic[t] || [];
      list.forEach((q) => {
        if (Array.isArray(q.roadmaps) && q.roadmaps.includes("company")) {
          total++;
          if (questionStatuses[q.id] === "mastered") {
            mastered++;
          }
        }
      });
    });
    const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, percentage };
  };

  const handleNextQuestion = () => {
    if (!activeQuestion) return;
    const topicKeys = Object.keys(effectiveQuestionsByTopic);
    const currentTopicIdx = topicKeys.indexOf(activeTopic);

    // Current topic questions
    const currentQs = sortQuestionsByDifficulty(
      (effectiveQuestionsByTopic[activeTopic] || []).filter((q) => {
        const qDiff = q.difficulty.toLowerCase();
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiff = difficultyFilter === "all" || qDiff === difficultyFilter;
        const matchesRoadmap = !selectedRoadmap || (Array.isArray(q.roadmaps) && q.roadmaps.includes(selectedRoadmap));
        return matchesSearch && matchesDiff && matchesRoadmap;
      })
    );

    const currentQIndex = currentQs.findIndex((q) => q.id === activeQuestion.id);

    if (currentQIndex !== -1 && currentQIndex < currentQs.length - 1) {
      const nextQ = currentQs[currentQIndex + 1];
      setActiveQuestion(nextQ);
      notify({
        type: "info",
        icon: "➡️",
        title: "Next Question Loaded",
        body: `Advanced to "${nextQ.title}"`,
        autoDismiss: 2500,
      });
    } else {
      // Find next topic that has questions matching filters
      let found = false;
      for (let i = currentTopicIdx + 1; i < topicKeys.length; i++) {
        const nextTopicKey = topicKeys[i];
        const nextQs = sortQuestionsByDifficulty(
          (effectiveQuestionsByTopic[nextTopicKey] || []).filter((q) => {
            const qDiff = q.difficulty.toLowerCase();
            const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDiff = difficultyFilter === "all" || qDiff === difficultyFilter;
            const matchesRoadmap = !selectedRoadmap || (Array.isArray(q.roadmaps) && q.roadmaps.includes(selectedRoadmap));
            return matchesSearch && matchesDiff && matchesRoadmap;
          })
        );
        if (nextQs.length > 0) {
          setActiveTopic(nextTopicKey);
          setActiveQuestion(nextQs[0]);
          found = true;
          notify({
            type: "info",
            icon: "➡️",
            title: `Next Topic: ${TOPIC_LABELS[nextTopicKey] ?? nextTopicKey}`,
            body: `Advanced to "${nextQs[0].title}"`,
            autoDismiss: 2500,
          });
          break;
        }
      }
      if (!found && currentQs.length > 0) {
        notify({
          type: "success",
          icon: "🎉",
          title: "Track Complete!",
          body: "You have reached the end of all questions in this track!",
          autoDismiss: 3500,
        });
      }
    }
  };

  function updateStatus(qId: string, newStatus: "unsolved" | "in_progress" | "mastered") {
    setQuestionStatuses((prev) => ({ ...prev, [qId]: newStatus }));
    localStorage.setItem(`careeros-dsa-${qId}`, newStatus);

    if (newStatus === "mastered") {
      notify({
        type: "success",
        icon: "🏆",
        title: "Question Mastered!",
        body: "Marked question as Mastered. Your progress has been updated!",
        autoDismiss: 3000,
      });
    }
  }

  const steps = activeQuestion ? getDynamicExecutionSteps(activeQuestion) : [];
  const currentStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="space-y-8 animate-fade-up">

      {/* ── TOP HERO HEADER & MASTERY STATS BAR ── */}
      <div className="surface border border-border rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 size-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
              <Sparkles className="size-3.5" /> Next-Gen AI Placement Operating System
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              DSA Practice & Placement Studio
            </h1>
            <p className="text-sm text-secondary leading-relaxed">
              Master algorithm patterns, test solutions live in JS/Python/C++, and accelerate your interview prep with AI.
            </p>
          </div>

          {/* Quick Overview Stats Badge Array */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="surface-2 border border-border px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <BookOpen className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">Question Bank</p>
                <p className="font-display text-lg font-bold text-primary">{totalQuestions.toLocaleString()} Qs</p>
              </div>
            </div>

            <div className="surface-2 border border-border px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="size-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                <Award className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">Mastered</p>
                <p className="font-display text-lg font-bold text-teal-400">{masteredCount} Solved</p>
              </div>
            </div>

            <div className="surface-2 border border-border px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">Targeted</p>
                <p className="font-display text-lg font-bold text-amber-400">{activeTargetCompanyIds.length} Companies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODE A: TRACK EXPLORER HUB ── */}
      {!selectedRoadmap ? (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
                <Compass className="size-6 text-orange-500" /> Specialized Practice Tracks
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Select a domain track or launch your customized target company curriculum.
              </p>
            </div>
          </div>

          {/* 6 Grid Domain Track Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOMAIN_ROADMAPS.map((r) => {
              const liveCount = getTrackCount(r.topics, r.id);
              const stats = getTrackStats(r.topics, r.id);
              return (
                <div
                  key={r.id}
                  onClick={() => handleSelectRoadmap(r.id, r.topics)}
                  className="group rounded-3xl p-6 surface border border-border hover:border-orange-500/60 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div
                        className="size-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm"
                        style={{ background: r.accentDim }}
                      >
                        <r.icon className="size-6" style={{ color: r.accent }} />
                      </div>
                      <span className="text-[11px] font-extrabold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
                        <Flame className="size-3 text-orange-500 fill-current" /> {liveCount} Questions
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-primary group-hover:text-orange-400 transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-xs text-secondary leading-relaxed mt-2">
                        {r.desc}
                      </p>
                    </div>

                    {/* % Completed Progress Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-secondary flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-teal-400" /> Track Progress
                        </span>
                        <span className="font-mono text-orange-400">
                          {stats.percentage}% <span className="text-muted text-[10px]">({stats.mastered}/{stats.total})</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full surface-2 overflow-hidden border border-border relative">
                        <div
                          className="h-full rounded-full transition-all duration-500 shadow-sm"
                          style={{
                            width: `${stats.percentage}%`,
                            background: r.accent || "linear-gradient(90deg, #f97316 0%, #10b981 100%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border relative z-10">
                    <span className="text-xs font-bold text-orange-400 inline-flex items-center gap-1 group-hover:underline">
                      Explore Track <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 6TH CARD: TARGET COMPANY CUSTOMIZED TRACK */}
            {(() => {
              const companyStats = getCompanyTrackStats();
              return (
                <div
                  onClick={() => handleSelectRoadmap("company", recommendedTopics)}
                  className="group rounded-3xl p-6 surface border border-orange-500/50 bg-orange-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="size-12 rounded-2xl bg-orange-500/15 flex items-center justify-center border border-orange-500/30">
                        <Target className="size-6 text-orange-500" />
                      </div>
                      <span className="text-[11px] font-extrabold text-orange-400 bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30 flex items-center gap-1">
                        <Sparkles className="size-3.5" /> Company Tuned
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-primary group-hover:text-orange-400 transition-colors">
                        Target Company Track
                      </h3>
                      <p className="text-xs text-secondary leading-relaxed mt-2">
                        {activeTargetCompanyIds.length > 0
                          ? `Questions weighted for your active targets (${targetedCompanyNames.slice(0, 3).join(", ")}${targetedCompanyNames.length > 3 ? ` +${targetedCompanyNames.length - 3} more` : ""}).`
                          : "No target companies selected yet. Select companies below to launch your customized track!"}
                      </p>
                    </div>

                    {/* % Completed Progress Bar for Company Track */}
                    <div className="space-y-1.5 pt-2 border-t border-orange-500/20">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-secondary flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-teal-400" /> Track Progress
                        </span>
                        <span className="font-mono text-orange-400">
                          {companyStats.percentage}% <span className="text-muted text-[10px]">({companyStats.mastered}/{companyStats.total})</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full surface-2 overflow-hidden border border-border relative">
                        <div
                          className="h-full rounded-full transition-all duration-500 shadow-sm"
                          style={{
                            width: `${companyStats.percentage}%`,
                            background: "linear-gradient(90deg, #f97316 0%, #10b981 100%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-orange-500/20 relative z-10">
                    <span className="text-xs font-bold text-orange-400 inline-flex items-center gap-1 group-hover:underline">
                      {activeTargetCompanyIds.length > 0 ? "Launch Company Track" : "Choose Target Companies"} <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Expandable & Interactive Target Company Manager */}
          <div className="surface border border-orange-500/30 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-primary flex items-center gap-2">
                    Target Company Suite
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {activeTargetCompanyIds.length} Selected
                    </span>
                  </h3>
                  <p className="text-xs text-muted">Add or remove target companies to dynamically weight your DSA questions.</p>
                </div>
              </div>

              <button
                onClick={() => setShowCompanyManager(!showCompanyManager)}
                className="text-xs font-bold px-4 py-2 rounded-xl surface-2 border border-border hover:border-orange-500/40 transition-all text-secondary hover:text-primary flex items-center gap-1.5"
              >
                {showCompanyManager ? "Hide Selector" : "Manage Target Companies"}
              </button>
            </div>

            {companyNotice && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-between animate-fade-up">
                <span>{companyNotice}</span>
                <button onClick={() => setCompanyNotice(null)} className="text-xs font-bold underline opacity-80 hover:opacity-100">
                  Dismiss
                </button>
              </div>
            )}

            {showCompanyManager && (
              <div className="pt-4 border-t border-border space-y-4 animate-fade-up">
                <p className="text-xs text-secondary font-medium">
                  Click any company chip below to target or untarget it in real-time:
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {companies.map((c) => (
                    <CompanyChip
                      key={c.id}
                      companyId={c.id}
                      name={c.name}
                      initiallyTargeted={activeTargetCompanyIds.includes(c.id)}
                      onToggle={handleToggleTargetCompany}
                    />
                  ))}
                </div>

                {activeTargetCompanyIds.length > 0 && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleSelectRoadmap("company", recommendedTopics)}
                      className="px-6 py-3 rounded-2xl text-xs font-bold text-white transition-all shadow-lg hover:shadow-orange-500/25 hover:scale-105 active:scale-95 flex items-center gap-2"
                      style={{ background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)" }}
                    >
                      <Sparkles className="size-4" /> Launch Customized Track ({activeTargetCompanyIds.length} Targeted)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (

        /* ── MODE B: RESTRUCTURED LEARNING STUDIO (SPLIT IDE VIEW) ── */
        <div className="space-y-6">

          {/* Top Navigation Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <button
              onClick={() => setSelectedRoadmap(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-all surface-2 px-4 py-2 rounded-xl border border-border hover:border-orange-500/40"
            >
              <ArrowLeft className="size-4" /> Exit to Tracks
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20 flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> Active Track: {selectedRoadmap.toUpperCase()}
              </span>
            </div>
          </div>

          {/* ── SPLIT VIEW: LEFT TOPIC & QUESTION DRAWER (3 COLS) + RIGHT STUDIO (9 COLS) ── */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">

            {/* LEFT COLUMN: SEARCHABLE TOPIC & QUESTION DRAWER (3 COLS) */}
            <div className="lg:col-span-3 surface border border-border rounded-3xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                  <BookOpen className="size-4 text-orange-500" /> Topics & Questions
                </h3>
                <span className="text-[10px] font-bold text-muted px-2 py-0.5 rounded-full surface-2 border border-border">
                  {Object.keys(questionsByTopic).length} Topics
                </span>
              </div>

              {/* Filter Pills */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="size-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full pl-8 pr-3 py-2 text-xs surface-2 border border-border rounded-xl text-primary placeholder:text-muted focus:outline-none focus:border-orange-500/50"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] font-semibold">
                  {(["all", "easy", "medium", "hard"] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`flex-1 py-1 rounded-lg border capitalize transition-all ${
                        difficultyFilter === diff
                          ? "bg-orange-500/15 text-orange-400 border-orange-500/30 font-bold"
                          : "surface-2 text-muted border-transparent hover:text-secondary"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Selector Accordion */}
              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {Object.entries(effectiveQuestionsByTopic).map(([topicKey, qList]) => {
                  const isTopicActive = activeTopic === topicKey;

                  // Check if topic belongs to selected roadmap
                  const activeRoadmapObj = DOMAIN_ROADMAPS.find((r) => r.id === selectedRoadmap);
                  if (selectedRoadmap && activeRoadmapObj && !activeRoadmapObj.topics.includes(topicKey)) {
                    return null;
                  }

                  // Filter questions by search query, difficulty filter, & explicit roadmap tag
                  const filteredQs = qList.filter((q) => {
                    const qDiff = q.difficulty.toLowerCase();
                    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesDiff = difficultyFilter === "all" || qDiff === difficultyFilter;
                    const matchesRoadmap = !selectedRoadmap || (Array.isArray(q.roadmaps) && q.roadmaps.includes(selectedRoadmap));
                    return matchesSearch && matchesDiff && matchesRoadmap;
                  });

                  if (filteredQs.length === 0) return null;

                  return (
                    <div key={topicKey} className="space-y-1">
                      <button
                        onClick={() => {
                          if (isTopicActive) {
                            setActiveTopic("");
                          } else {
                            setActiveTopic(topicKey);
                            if (filteredQs.length > 0) setActiveQuestion(filteredQs[0]);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                          isTopicActive
                            ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                            : "surface-2 text-secondary hover:text-primary border border-transparent"
                        }`}
                      >
                        <span className="truncate">{TOPIC_LABELS[topicKey] ?? topicKey}</span>
                        <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">
                          {filteredQs.length} Qs
                        </span>
                      </button>

                      {/* Sub-table of questions (Sorted Easy -> Medium -> Hard) */}
                      {isTopicActive && (() => {
                        const sortedQs = sortQuestionsByDifficulty(filteredQs);
                        const easyCount = filteredQs.filter((q) => q.difficulty.toLowerCase() === "easy").length;
                        const medCount  = filteredQs.filter((q) => q.difficulty.toLowerCase() === "medium").length;
                        const hardCount = filteredQs.filter((q) => q.difficulty.toLowerCase() === "hard").length;

                        return (
                          <div className="pl-3 space-y-1.5 pt-1 animate-fade-up">
                            <div className="flex items-center justify-between text-[10px] font-semibold px-2 py-1 surface-2 rounded-lg text-muted border border-border">
                              <span className="text-teal-400 font-bold">🟢 {easyCount} Easy</span>
                              <span>•</span>
                              <span className="text-amber-400 font-bold">🟡 {medCount} Med</span>
                              <span>•</span>
                              <span className="text-rose-400 font-bold">🔴 {hardCount} Hard</span>
                            </div>

                            {sortedQs.map((q) => {
                              const isQActive = activeQuestion?.id === q.id;
                              const qStat = questionStatuses[q.id] || "unsolved";
                              const diffBadgeColor =
                                q.difficulty.toLowerCase() === "easy"
                                  ? "text-teal-400 bg-teal-500/10 border-teal-500/20"
                                  : q.difficulty.toLowerCase() === "medium"
                                  ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                  : "text-rose-400 bg-rose-500/10 border-rose-500/20";

                              return (
                                <button
                                  key={q.id}
                                  onClick={() => {
                                    setActiveQuestion(q);
                                    setWorkspaceTab("editor");
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 ${
                                    isQActive
                                      ? "surface border border-orange-500/40 text-primary shadow-sm"
                                      : "text-muted hover:text-secondary surface-2"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate flex-1">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${diffBadgeColor}`}>
                                      {q.difficulty.slice(0, 1)}
                                    </span>
                                    <span className="truncate">{q.title}</span>
                                  </div>
                                  {qStat === "mastered" ? (
                                    <CheckCircle2 className="size-3.5 text-teal-400 shrink-0" />
                                  ) : (
                                    <Circle className="size-3 text-muted shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: RICH INTERACTIVE QUESTION PLAYGROUND (9 COLS) */}
            <div className="lg:col-span-9 space-y-6">
              {activeQuestion ? (
                <div className="space-y-6">

                  {/* Playground Navigation Sub-Tabs & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => setWorkspaceTab("solution")}
                        className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                          workspaceTab === "solution"
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/30 scale-[1.02]"
                            : "surface-2 text-secondary hover:text-primary border border-border hover:border-orange-500/30"
                        }`}
                      >
                        <BookOpen className="size-4" /> 📖 Solution &amp; Explanation
                      </button>

                      {showVisualizerTab && (
                        <button
                          onClick={() => setWorkspaceTab("stepper")}
                          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                            workspaceTab === "stepper"
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/30 scale-[1.02]"
                              : "surface-2 text-orange-400 hover:text-orange-300 border border-orange-500/30 hover:border-orange-500/50 bg-orange-500/5"
                          }`}
                        >
                          <Zap className="size-4 text-orange-400 fill-current animate-pulse" /> ⚡ 10x Interactive Visualizer
                        </button>
                      )}

                      <button
                        onClick={() => setWorkspaceTab("editor")}
                        className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                          workspaceTab === "editor"
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/30 scale-[1.02]"
                            : "surface-2 text-secondary hover:text-primary border border-border hover:border-orange-500/30"
                        }`}
                      >
                        <Terminal className="size-4" /> 💻 Write Code &amp; Test
                      </button>

                      <button
                        onClick={() => setWorkspaceTab("teacher")}
                        className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                          workspaceTab === "teacher"
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/30 scale-[1.02]"
                            : "surface-2 text-secondary hover:text-primary border border-border hover:border-orange-500/30"
                        }`}
                      >
                        <GraduationCap className="size-4" /> 👨‍🏫 Ask OS-Teacher
                      </button>
                    </div>

                    {/* Question Actions: Mark Completed & Next Question */}
                    <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => {
                          const isMastered = questionStatuses[activeQuestion.id] === "mastered";
                          updateStatus(activeQuestion.id, isMastered ? "unsolved" : "mastered");
                        }}
                        className={`px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 shadow-sm ${
                          questionStatuses[activeQuestion.id] === "mastered"
                            ? "bg-teal-500 text-white shadow-teal-500/25 ring-2 ring-teal-400/30"
                            : "surface-2 text-secondary hover:text-primary border border-border hover:border-teal-500/40"
                        }`}
                        title="Toggle question completion status"
                      >
                        <CheckCircle2 className={`size-4 ${questionStatuses[activeQuestion.id] === "mastered" ? "text-white" : "text-teal-400"}`} />
                        <span>{questionStatuses[activeQuestion.id] === "mastered" ? "Completed" : "Mark Completed"}</span>
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-3 rounded-2xl text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                        title="Advance to next question"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* PLAYGROUND TAB 1: DEDICATED SOLUTION & EXPLANATION VIEW */}
                  {workspaceTab === "solution" && (
                    <QuestionSolutionView question={activeQuestion} />
                  )}

                  {/* PLAYGROUND TAB 2: 10X INTERACTIVE STEP-BY-STEP VISUALIZER */}
                  {workspaceTab === "stepper" && (
                    <QuestionVisualizerRouter question={activeQuestion} />
                  )}

                  {/* PLAYGROUND TAB 3: PRO CODE EDITOR & EVALUATOR */}
                  {workspaceTab === "editor" && (
                    <CodeEditorEvaluator
                      questionId={activeQuestion.id}
                      questionTitle={activeQuestion.title}
                      topic={activeQuestion.topic}
                      prompt={activeQuestion.prompt}
                      solutionExplanation={activeQuestion.solution_explanation}
                    />
                  )}

                  {/* PLAYGROUND TAB 4: OS-TEACHER CLASSROOM CHAT */}
                  {workspaceTab === "teacher" && (
                    <OSTeacherChat
                      questionTitle={activeQuestion.title}
                      topic={activeQuestion.topic}
                      difficulty={activeQuestion.difficulty}
                      prompt={activeQuestion.prompt}
                      solutionExplanation={activeQuestion.solution_explanation}
                    />
                  )}

                  {/* Bottom Action Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 surface border border-border rounded-3xl shadow-lg mt-6">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-2xl flex items-center justify-center border ${
                        questionStatuses[activeQuestion.id] === "mastered"
                          ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      }`}>
                        {questionStatuses[activeQuestion.id] === "mastered" ? (
                          <CheckCircle2 className="size-5 text-teal-400" />
                        ) : (
                          <BookOpen className="size-5 text-orange-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted">Current Question Status</p>
                        <p className="text-sm font-extrabold text-primary flex items-center gap-2">
                          {activeQuestion.title}
                          {questionStatuses[activeQuestion.id] === "mastered" && (
                            <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                              ✓ Mastered
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          const isMastered = questionStatuses[activeQuestion.id] === "mastered";
                          updateStatus(activeQuestion.id, isMastered ? "unsolved" : "mastered");
                        }}
                        className={`flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${
                          questionStatuses[activeQuestion.id] === "mastered"
                            ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                            : "surface-2 text-secondary hover:text-primary border border-border hover:border-teal-500/40"
                        }`}
                      >
                        <CheckCircle2 className="size-4" />
                        <span>{questionStatuses[activeQuestion.id] === "mastered" ? "Completed" : "Mark Completed"}</span>
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-2xl text-xs font-extrabold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                        style={{ background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)" }}
                      >
                        <span>Next Question</span>
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="surface border border-border rounded-3xl p-12 text-center space-y-4">
                  <div className="size-16 rounded-2xl bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center border border-orange-500/20">
                    <BookOpen className="size-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary">No Question Selected</h3>
                  <p className="text-xs text-secondary max-w-sm mx-auto">
                    Select any topic or question from the left sidebar to start practicing.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
