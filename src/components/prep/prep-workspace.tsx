"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Code2,
  Brain,
  Globe,
  Layers,
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Circle,
  Zap,
  Target,
  BookOpen,
  ArrowLeft,
  Terminal,
  Eye,
  Copy,
} from "lucide-react";
import { CompanyChip } from "@/components/company-chip";
import { useNotifications } from "@/components/notifications/notification-provider";
import { CodeEditorEvaluator } from "./code-editor-evaluator";

export interface QuestionData {
  id: string;
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  solution_explanation: string | null;
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

interface StepItem {
  line: number;
  code: string;
  vars: Record<string, string>;
  log: string;
  arrayState?: { val: string; active?: boolean; match?: boolean }[];
}

const DOMAIN_ROADMAPS = [
  {
    id: "sde",
    title: "SDE / Core Software Engineer",
    icon: Code2,
    accent: "var(--orange)",
    accentDim: "var(--orange-glow)",
    desc: "Master Arrays, Dynamic Programming, Graphs, and Trees for Tier-1 SDE roles.",
    topics: ["arrays", "graphs", "dp", "trees", "linked-lists"],
    questionsCount: "45+ Questions",
  },
  {
    id: "web-dev",
    title: "Full-Stack & Web Systems",
    icon: Globe,
    accent: "var(--teal)",
    accentDim: "var(--teal-dim)",
    desc: "Async JS, DOM Tree Manipulation, SQL Queries, and System Architecture.",
    topics: ["web-development", "sql", "stacks-queues", "strings"],
    questionsCount: "30+ Questions",
  },
  {
    id: "ai-ml",
    title: "AI & Data Engineering",
    icon: Brain,
    accent: "#3B82F6",
    accentDim: "rgba(59, 130, 246, 0.15)",
    desc: "Math & Number Theory, Matrix Transformations, Hash Maps, and Optimization.",
    topics: ["math-number-theory", "basic-programming", "arrays", "dp"],
    questionsCount: "25+ Questions",
  },
  {
    id: "oops",
    title: "OOPs & Low-Level Design",
    icon: Layers,
    accent: "var(--amber)",
    accentDim: "var(--amber-dim)",
    desc: "Object-Oriented Concepts, Design Patterns, Pseudocode, and Memory Allocation.",
    topics: ["oop-concepts", "pseudocode", "recursion"],
    questionsCount: "20+ Questions",
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

/**
 * Clean function name generator: converts title into readable JavaScript camelCase
 */
function getCleanFuncName(title: string): string {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, "").split(" ");
  if (words.length === 0) return "solveAlgorithm";
  return words[0].toLowerCase() + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

/**
 * Dynamic Step Generator: Produces clear line-by-line algorithm execution,
 * visual array states, pointers, and step logs tailored to each question!
 */
function getDynamicExecutionSteps(q: QuestionData): StepItem[] {
  const topic = q.topic.toLowerCase();
  const title = q.title.toLowerCase();
  const funcName = getCleanFuncName(q.title);

  // 1. MAXIMUM SUBARRAY REVENUE (Kadane's Algorithm)
  if (title.includes("maximum subarray") || title.includes("kadane") || title.includes("revenue")) {
    return [
      { line: 1, code: `function ${funcName}(nums) {`, vars: { nums: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]" }, log: "Initialize Kadane's algorithm on profit/loss array", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4" }, { val: "-1" }, { val: "2" }, { val: "1" }, { val: "-5" }, { val: "4" }] },
      { line: 2, code: "  let maxSoFar = nums[0];", vars: { maxSoFar: "-2" }, log: "Initialize global max profit maxSoFar = -2", arrayState: [{ val: "-2", active: true }, { val: "1" }, { val: "-3" }, { val: "4" }, { val: "-1" }, { val: "2" }, { val: "1" }, { val: "-5" }, { val: "4" }] },
      { line: 3, code: "  let currentMax = nums[0];", vars: { currentMax: "-2" }, log: "Initialize current subarray sum currentMax = -2", arrayState: [{ val: "-2", active: true }, { val: "1" }, { val: "-3" }, { val: "4" }, { val: "-1" }, { val: "2" }, { val: "1" }, { val: "-5" }, { val: "4" }] },
      { line: 4, code: "  for (let i = 1; i < nums.length; i++) {", vars: { i: "3", val: "4" }, log: "Reach element at index 3: value 4 (Start profitable subarray)", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", active: true }, { val: "-1" }, { val: "2" }, { val: "1" }, { val: "-5" }, { val: "4" }] },
      { line: 5, code: "    currentMax = Math.max(nums[i], currentMax + nums[i]);", vars: { currentMax: "6" }, log: "Extend subarray [4, -1, 2, 1]: currentMax = 6", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", match: true }, { val: "-1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "-5" }, { val: "4" }] },
      { line: 6, code: "    maxSoFar = Math.max(maxSoFar, currentMax);", vars: { maxSoFar: "6" }, log: "Update global maximum profit maxSoFar = 6", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", match: true }, { val: "-1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "-5" }, { val: "4" }] },
      { line: 7, code: "  return maxSoFar; // KADANE RESULT FOUND", vars: { result: "6", timeComplexity: "O(N)", spaceComplexity: "O(1)" }, log: "Subarray [4, -1, 2, 1] yields maximum revenue of 6!", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", match: true }, { val: "-1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "-5" }, { val: "4" }] },
    ];
  }

  // 2. MISSING ROLL NUMBER (Sum Formula)
  if (title.includes("missing roll number") || title.includes("missing")) {
    return [
      { line: 1, code: `function ${funcName}(nums, n) {`, vars: { n: "5", nums: "[1, 2, 4, 5]" }, log: "Initialize roll-number array [1, 2, 4, 5], total n = 5", arrayState: [{ val: "1" }, { val: "2" }, { val: "4" }, { val: "5" }] },
      { line: 2, code: "  let expectedSum = (n * (n + 1)) / 2;", vars: { expectedSum: "15" }, log: "Calculate expected sum 1..5: (5 * 6) / 2 = 15", arrayState: [{ val: "1" }, { val: "2" }, { val: "4" }, { val: "5" }] },
      { line: 3, code: "  let actualSum = 0;", vars: { actualSum: "0" }, log: "Initialize actual sum counter actualSum = 0", arrayState: [{ val: "1" }, { val: "2" }, { val: "4" }, { val: "5" }] },
      { line: 4, code: "  for (let num of nums) { actualSum += num; }", vars: { actualSum: "12" }, log: "Sum array elements: 1 + 2 + 4 + 5 = 12", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "5", match: true }] },
      { line: 5, code: "  let missing = expectedSum - actualSum;", vars: { missing: "3" }, log: "Calculate missing roll number: 15 - 12 = 3", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Missing)", match: true }, { val: "4" }, { val: "5" }] },
      { line: 6, code: "  return missing; // RESULT FOUND", vars: { result: "3", status: "SUCCESS" }, log: "Missing student roll number is 3! O(N) Time, O(1) Space", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Missing)", match: true }, { val: "4" }, { val: "5" }] },
    ];
  }

  // 3. GRAPH TRAVERSALS (BFS / DFS)
  if (topic === "graphs" || title.includes("graph") || title.includes("bfs") || title.includes("dfs") || title.includes("path")) {
    return [
      { line: 1, code: `function ${funcName}(graph, startNode) {`, vars: { startNode: "'A'", totalNodes: "5" }, log: "Initialize graph traversal starting at node 'A'", arrayState: [{ val: "A", active: true }, { val: "B" }, { val: "C" }, { val: "D" }, { val: "E" }] },
      { line: 2, code: "  let queue = [startNode];", vars: { queue: "['A']" }, log: "Enqueue root node 'A' into BFS queue", arrayState: [{ val: "A", active: true }, { val: "B" }, { val: "C" }, { val: "D" }, { val: "E" }] },
      { line: 3, code: "  let visited = new Set([startNode]);", vars: { visited: "{ 'A' }" }, log: "Mark node 'A' as visited in Set", arrayState: [{ val: "A", match: true }, { val: "B" }, { val: "C" }, { val: "D" }, { val: "E" }] },
      { line: 4, code: "  while (queue.length > 0) {", vars: { queueSize: "1" }, log: "Loop while BFS queue is non-empty", arrayState: [{ val: "A", match: true }, { val: "B" }, { val: "C" }, { val: "D" }, { val: "E" }] },
      { line: 5, code: "    let curr = queue.shift();", vars: { curr: "'A'", queue: "[]" }, log: "Pop node 'A' from front of queue", arrayState: [{ val: "A", active: true }, { val: "B" }, { val: "C" }, { val: "D" }, { val: "E" }] },
      { line: 6, code: "    for (let neighbor of graph[curr]) {", vars: { neighbors: "['B', 'C']" }, log: "Retrieve unvisited neighbors of 'A': ['B', 'C']", arrayState: [{ val: "A", match: true }, { val: "B", active: true }, { val: "C", active: true }, { val: "D" }, { val: "E" }] },
      { line: 7, code: "      visited.add(neighbor); queue.push(neighbor);", vars: { queue: "['B', 'C']", visited: "{'A', 'B', 'C'}" }, log: "Enqueue 'B' & 'C' and mark visited", arrayState: [{ val: "A", match: true }, { val: "B", match: true }, { val: "C", match: true }, { val: "D" }, { val: "E" }] },
      { line: 8, code: "  return Array.from(visited); // TRAVERSAL COMPLETE", vars: { result: "['A', 'B', 'C']", status: "SUCCESS" }, log: "Graph traversal complete! Return visited nodes array", arrayState: [{ val: "A", match: true }, { val: "B", match: true }, { val: "C", match: true }, { val: "D" }, { val: "E" }] },
    ];
  }

  // 4. TWO-SUM / HASH MAP PAIRING
  return [
    { line: 1, code: `function ${funcName}(prices, budget) {`, vars: { prices: "[2, 7, 11, 15]", budget: "9" }, log: `Initialize algorithm for "${q.title}"`, arrayState: [{ val: "2" }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 2, code: "  let map = new Map();", vars: { map: "{}" }, log: "Create hash map for O(1) time complexity lookup", arrayState: [{ val: "2" }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 3, code: "  for (let i = 0; i < prices.length; i++) {", vars: { i: "0", price: "2" }, log: "Inspect item at index 0: price $2", arrayState: [{ val: "2", active: true }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 4, code: "    let complement = budget - prices[i];", vars: { i: "0", complement: "7" }, log: "Calculate complement required: $9 - $2 = $7", arrayState: [{ val: "2", active: true }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 5, code: "    if (map.has(complement)) return [map.get(complement), i];", vars: { found: "false" }, log: "Complement $7 is not in hash map yet", arrayState: [{ val: "2", active: true }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 6, code: "    map.set(prices[i], i);", vars: { map: "{ 2 => 0 }" }, log: "Store price $2 at index 0 in map", arrayState: [{ val: "2", match: true }, { val: "7" }, { val: "11" }, { val: "15" }] },
    { line: 7, code: "  // Next iteration: i = 1, price = 7", vars: { i: "1", price: "7" }, log: "Advance loop pointer to index 1: price $7", arrayState: [{ val: "2", match: true }, { val: "7", active: true }, { val: "11" }, { val: "15" }] },
    { line: 8, code: "    if (map.has(2)) return [0, 1]; // MATCH FOUND!", vars: { match: "[0, 1]", status: "SUCCESS" }, log: "Match found! Complement $2 exists at index 0. Return indices [0, 1]", arrayState: [{ val: "2", match: true }, { val: "7", match: true }, { val: "11" }, { val: "15" }] },
  ];
}

export function PrepWorkspace({
  companies,
  targetedCompanyIds,
  recommendedTopics,
  questionsByTopic,
}: PrepWorkspaceProps) {
  const { notify } = useNotifications();

  // Active view: null = Hub view, string = active roadmap ID ("sde", "web-dev", "ai-ml", "oops", "company")
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const [showCompanyManager, setShowCompanyManager] = useState(false);

  // Active topic & question selection inside workspace
  const [activeTopic, setActiveTopic] = useState<string>("");
  const [activeQuestion, setActiveQuestion] = useState<QuestionData | null>(null);

  // Workspace sub-tab: 'stepper' vs 'editor' (default to 'editor')
  const [workspaceTab, setWorkspaceTab] = useState<"stepper" | "editor">("editor");

  // Execution visualizer state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Local storage question statuses
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, "unsolved" | "in_progress" | "mastered">>({});

  // Whenever active question changes, reset stepper to start
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [activeQuestion?.id]);

  function handleSelectRoadmap(id: string, initialTopics: string[]) {
    setSelectedRoadmap(id);
    const firstTopic = initialTopics[0] || Object.keys(questionsByTopic)[0] || "arrays";
    setActiveTopic(firstTopic);

    const topicQs = questionsByTopic[firstTopic] || [];
    if (topicQs.length > 0) {
      setActiveQuestion(topicQs[0]);
    }
  }

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

  // Get dynamic execution steps tailored specifically to activeQuestion
  const steps = activeQuestion ? getDynamicExecutionSteps(activeQuestion) : [];
  const currentStep = steps[currentStepIndex] || steps[0];

  // Stepper timer loop
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
    <div className="space-y-6 animate-fade-up">

      {/* ── MODE A: ROADMAP HUB (5 DOMAIN CARDS + COMPANY TARGET MANAGER) ── */}
      {!selectedRoadmap ? (
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--orange)" }}>
              Structured Practice Roadmaps
            </p>
            <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Choose Your Practice Track
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Select a specialized domain roadmap below or jump directly into your target company customized track.
            </p>
          </div>

          {/* 5 Grid Domain Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOMAIN_ROADMAPS.map((r) => (
              <div
                key={r.id}
                onClick={() => handleSelectRoadmap(r.id, r.topics)}
                className="group rounded-3xl p-6 surface border border-border hover:border-orange-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="size-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: r.accentDim }}
                    >
                      <r.icon className="size-6" style={{ color: r.accent }} />
                    </div>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider surface-2 px-2.5 py-1 rounded-full border border-border">
                      {r.questionsCount}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-primary group-hover:text-orange-400 transition-colors">
                    {r.title}
                  </h3>

                  <p className="text-xs text-secondary leading-relaxed">
                    {r.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs font-bold text-orange-400 inline-flex items-center gap-1">
                    Start Roadmap <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            ))}

            {/* 5TH CARD: TARGET COMPANY CUSTOM ROADMAP */}
            <div
              onClick={() => handleSelectRoadmap("company", recommendedTopics)}
              className="group rounded-3xl p-6 surface border border-orange-500/40 bg-orange-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="size-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--orange-glow)" }}
                  >
                    <Target className="size-6" style={{ color: "var(--orange)" }} />
                  </div>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
                    <Sparkles className="size-3" /> Resume Tuned
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-primary group-hover:text-orange-400 transition-colors">
                  Target Company Track
                </h3>

                <p className="text-xs text-secondary leading-relaxed">
                  Questions weighted specifically by your active target companies ({targetedCompanyIds.length} active).
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-orange-500/20">
                <span className="text-xs font-bold text-orange-400 inline-flex items-center gap-1">
                  Launch Company Track <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>

          {/* Expandable Company Target Manager Bar */}
          <div className="surface border border-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-orange-500" />
                <div>
                  <h3 className="font-bold text-sm text-primary">Target Company Manager</h3>
                  <p className="text-xs text-muted">Add or remove target companies to tune your recommended questions.</p>
                </div>
              </div>

              <button
                onClick={() => setShowCompanyManager(!showCompanyManager)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl surface-2 border border-border hover:border-orange-500/40 transition-all text-secondary hover:text-primary flex items-center gap-1"
              >
                {showCompanyManager ? "Hide Manager" : "Manage Target Companies"}
              </button>
            </div>

            {showCompanyManager && (
              <div className="pt-3 border-t border-border animate-fade-up">
                <div className="flex flex-wrap gap-2">
                  {companies.map((c) => (
                    <CompanyChip
                      key={c.id}
                      companyId={c.id}
                      name={c.name}
                      initiallyTargeted={targetedCompanyIds.includes(c.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── MODE B: INTERACTIVE LEARNING WORKSPACE (SPLIT IDE VIEW) ── */
        <div className="space-y-6">
          {/* Top workspace navigation bar */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <button
              onClick={() => setSelectedRoadmap(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors surface-2 px-3 py-1.5 rounded-xl border border-border"
            >
              <ArrowLeft className="size-4" /> Back to Roadmaps
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
                <Sparkles className="size-3" /> Active Track: {selectedRoadmap.toUpperCase()}
              </span>
            </div>
          </div>

          {/* ── SPLIT VIEW: LEFT TOPICS TABLE (3 COLS) + RIGHT MIDDLE WORKSPACE (9 COLS) ── */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">

            {/* LEFT COLUMN: TOPIC TABLE & SUB-QUESTION LIST (3 COLS) */}
            <div className="lg:col-span-3 surface border border-border rounded-3xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <BookOpen className="size-4 text-orange-500" /> Topics & Questions
                </h3>
                <span className="text-[10px] font-bold text-muted">
                  {Object.keys(questionsByTopic).length} Topics
                </span>
              </div>

              {/* Topic Selector Tabs */}
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {Object.entries(questionsByTopic).map(([topicKey, qList]) => {
                  const isTopicActive = activeTopic === topicKey;
                  return (
                    <div key={topicKey} className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveTopic(topicKey);
                          if (qList.length > 0) setActiveQuestion(qList[0]);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                          isTopicActive
                            ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                            : "surface-2 text-secondary hover:text-primary border border-transparent"
                        }`}
                      >
                        <span className="truncate">{TOPIC_LABELS[topicKey] ?? topicKey}</span>
                        <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">
                          {qList.length} Qs
                        </span>
                      </button>

                      {/* Sub-table of questions when topic active */}
                      {isTopicActive && (
                        <div className="pl-3 space-y-1 pt-1 animate-fade-up">
                          {qList.map((q) => {
                            const isQActive = activeQuestion?.id === q.id;
                            const qStat = questionStatuses[q.id] || "unsolved";
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
                                <span className="truncate flex-1">{q.title}</span>
                                {qStat === "mastered" ? (
                                  <CheckCircle2 className="size-3.5 text-teal-400 shrink-0" />
                                ) : (
                                  <Circle className="size-3 text-muted shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: RICH INTERACTIVE QUESTION WORKSPACE (9 COLS) */}
            <div className="lg:col-span-9 space-y-6">
              {activeQuestion ? (
                <div className="space-y-6">
                  {/* Mode Selector Tabs: Stepper vs Code Writer */}
                  <div className="flex gap-2 border-b border-border pb-1">
                    <button
                      onClick={() => setWorkspaceTab("stepper")}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        workspaceTab === "stepper"
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "surface-2 text-secondary hover:text-primary border border-border"
                      }`}
                    >
                      <Zap className="size-4" /> Interactive Visualizer Stepper
                    </button>

                    <button
                      onClick={() => setWorkspaceTab("editor")}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        workspaceTab === "editor"
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "surface-2 text-secondary hover:text-primary border border-border"
                      }`}
                    >
                      <Terminal className="size-4" /> Student Code Writer & AI Evaluator
                    </button>
                  </div>

                  {/* SUB-TAB 1: INTERACTIVE CODE WRITER & AI EVALUATOR */}
                  {workspaceTab === "editor" && (
                    <CodeEditorEvaluator
                      questionId={activeQuestion.id}
                      questionTitle={activeQuestion.title}
                      topic={activeQuestion.topic}
                      prompt={activeQuestion.prompt}
                      solutionExplanation={activeQuestion.solution_explanation}
                    />
                  )}

                  {/* SUB-TAB 2: INTERACTIVE STEPPER VISUALIZER (ENHANCED & BOLDER) */}
                  {workspaceTab === "stepper" && (
                    <div className="surface border border-border rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl animate-fade-up">

                      {/* Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                              {TOPIC_LABELS[activeQuestion.topic] ?? activeQuestion.topic}
                            </span>
                            <span className="text-xs font-bold capitalize text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                              {activeQuestion.difficulty}
                            </span>
                          </div>
                          <h2 className="font-display text-2xl font-bold text-primary">
                            {activeQuestion.title}
                          </h2>
                        </div>

                        <button
                          onClick={() => {
                            const cur = questionStatuses[activeQuestion.id] || "unsolved";
                            const next = cur === "unsolved" ? "in_progress" : cur === "in_progress" ? "mastered" : "unsolved";
                            updateStatus(activeQuestion.id, next);
                          }}
                          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                            (questionStatuses[activeQuestion.id] || "unsolved") === "mastered"
                              ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                              : "bg-orange-500 text-white hover:brightness-110"
                          }`}
                        >
                          <CheckCircle2 className="size-4" />
                          {(questionStatuses[activeQuestion.id] || "unsolved") === "mastered" ? "Mastered" : "Mark as Mastered"}
                        </button>
                      </div>

                      {/* Problem Intuition */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-muted uppercase tracking-wider">Problem Intuition & Scenario</p>
                        <div className="surface-2 p-4 rounded-2xl border border-border text-sm text-secondary leading-relaxed">
                          {activeQuestion.prompt}
                        </div>
                      </div>

                      {/* ── BOLD VISUAL ALGORITHM STEPPER & DIAGRAM GRAPHIC ── */}
                      <div className="space-y-4 pt-2">

                        {/* Top Stepper Controls Bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-2 p-4 rounded-2xl border border-border">
                          <div className="flex items-center gap-2">
                            <Zap className="size-5 text-orange-500" />
                            <span className="text-sm font-bold text-primary">
                              Step {currentStepIndex + 1} of {steps.length}
                            </span>
                          </div>

                          {/* Large Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                              disabled={currentStepIndex === 0}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold surface border border-border text-secondary hover:text-primary disabled:opacity-40 flex items-center gap-1 transition-all"
                            >
                              <ChevronLeft className="size-4" /> Prev Step
                            </button>

                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20"
                            >
                              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-white" />}
                              {isPlaying ? "Pause Visualizer" : "Play Visualizer"}
                            </button>

                            <button
                              onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                              disabled={currentStepIndex === steps.length - 1}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold surface border border-border text-secondary hover:text-primary disabled:opacity-40 flex items-center gap-1 transition-all"
                            >
                              Next Step <ChevronRight className="size-4" />
                            </button>

                            <button
                              onClick={() => {
                                setIsPlaying(false);
                                setCurrentStepIndex(0);
                              }}
                              className="p-2 rounded-xl surface border border-border text-muted hover:text-primary transition-colors"
                              title="Reset Stepper"
                            >
                              <RotateCcw className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* ── VISUAL DATA STRUCTURE DIAGRAM CARD ── */}
                        {currentStep?.arrayState && currentStep.arrayState.length > 0 && (
                          <div className="surface border border-orange-500/30 p-5 rounded-2xl space-y-3 bg-orange-500/5">
                            <p className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Eye className="size-4" /> Visual Data Structure State
                            </p>

                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                              {currentStep.arrayState.map((elem, idx) => (
                                <div
                                  key={idx}
                                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all duration-300 min-w-[60px] text-center ${
                                    elem.match
                                      ? "bg-teal-500/20 border-teal-500 text-teal-300 scale-110 shadow-lg shadow-teal-500/20 font-bold"
                                      : elem.active
                                      ? "bg-orange-500/30 border-orange-500 text-orange-200 scale-105 shadow-md shadow-orange-500/30 font-bold"
                                      : "surface-2 border-border text-secondary opacity-80"
                                  }`}
                                >
                                  <span className="text-[10px] font-mono text-muted">idx [{idx}]</span>
                                  <span className="text-base font-extrabold">{elem.val}</span>
                                  {elem.active && (
                                    <span className="text-[9px] font-bold text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded-full">
                                      Pointer i
                                    </span>
                                  )}
                                  {elem.match && (
                                    <span className="text-[9px] font-bold text-teal-300 bg-teal-500/20 px-1.5 py-0.5 rounded-full">
                                      Match
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ── LARGE HUMAN-READABLE STEP LOG BANNER ── */}
                        <div className="surface-2 border border-teal-500/30 p-4 rounded-2xl flex items-start gap-3 bg-teal-500/5">
                          <Sparkles className="size-5 text-teal-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                              Active Step Intuition & Action Log
                            </p>
                            <p className="text-sm font-semibold text-primary mt-1 leading-relaxed">
                              {currentStep?.log}
                            </p>
                          </div>
                        </div>

                        {/* ── BOLDER CODE SYNTAX STEPPER WINDOW ── */}
                        <div className="rounded-3xl overflow-hidden border border-border surface shadow-xl">
                          <div className="px-5 py-3 bg-surface-2 border-b border-border flex items-center justify-between text-xs text-muted font-mono">
                            <span className="flex items-center gap-2">
                              <span className="size-2.5 rounded-full bg-orange-500 inline-block" />
                              {getCleanFuncName(activeQuestion.title)}.js
                            </span>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  const fullCode = steps.map((s) => s.code).join("\n");
                                  navigator.clipboard.writeText(fullCode);
                                  notify({
                                    type: "success",
                                    icon: "📋",
                                    title: "Visualizer Code Copied!",
                                    body: "Algorithm code copied to clipboard.",
                                    autoDismiss: 2500,
                                  });
                                }}
                                className="text-[11px] font-bold text-orange-400 hover:text-white bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-xl border border-orange-500/30 flex items-center gap-1 transition-all active:scale-95"
                              >
                                <Copy className="size-3 text-orange-400" /> Copy Code
                              </button>
                              <span>Active Line {currentStep?.line}</span>
                            </div>
                          </div>

                          {/* Code Lines with Larger Font (text-sm) */}
                          <div className="p-5 font-mono text-sm space-y-1.5 overflow-x-auto leading-relaxed">
                            {steps.map((st, idx) => {
                              const isCurrent = idx === currentStepIndex;
                              return (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-4 px-3.5 py-2 rounded-xl transition-all ${
                                    isCurrent
                                      ? "bg-orange-500/25 text-orange-200 font-bold border-l-4 border-orange-500 shadow-md"
                                      : "text-secondary opacity-75 hover:opacity-100"
                                  }`}
                                >
                                  <span className="text-xs text-muted w-5 text-right shrink-0">{st.line}</span>
                                  <span>{st.code}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Variable Memory State Inspector */}
                          <div className="p-5 bg-surface-2 border-t border-border space-y-2">
                            <p className="text-xs font-bold text-muted uppercase tracking-wider">
                              Live Variable & Memory Inspector State
                            </p>
                            <div className="flex flex-wrap gap-2.5 font-mono text-xs">
                              {Object.entries(currentStep?.vars || {}).map(([k, v]) => (
                                <span key={k} className="px-3 py-1.5 rounded-xl surface border border-border text-teal-300 font-bold shadow-sm">
                                  {k}: <span className="text-primary">{v}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="surface border border-border rounded-3xl p-12 text-center text-xs text-muted">
                  Select a topic and question from the left sidebar to start practicing.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
