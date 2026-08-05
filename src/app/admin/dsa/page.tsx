"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Code2,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Building2,
  Zap,
  BookOpen,
  Terminal,
  HelpCircle,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  Info,
  Sliders,
  Check,
  RotateCcw,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";
import { createClient } from "@/lib/supabase/client";

export interface StepItem {
  line: number;
  code: string;
  vars?: Record<string, string>;
  log: string;
  arrayState?: { val: string; active?: boolean; match?: boolean }[];
}

export interface AdminDSAQuestion {
  id: string;
  roadmap: string; // e.g. "easy-to-medium" | "medium-to-hard" | "sde" | "web-dev" | "ai-ml" | "oops" | "company"
  roadmaps: string[];
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  targetCompanies: string[];
  prompt: string; // Step 1
  solution_explanation: string; // Step 2
  time_complexity: string; // Step 2
  space_complexity: string; // Step 2
  solution_javascript: string; // Step 3
  solution_python: string; // Step 3
  solution_cpp: string; // Step 3
  visualizerSteps: StepItem[]; // Step 4
  conceptual_hint?: string; // Step 5
  starter_js?: string; // Step 5
  starter_py?: string; // Step 5
  starter_cpp?: string; // Step 5
  test_cases?: string; // Step 5
  created_at: string;
}

const ROADMAP_OPTIONS = [
  { id: "easy-to-medium", name: "Foundation to Core (Easy → Medium)", badge: "Easy/Med" },
  { id: "medium-to-hard", name: "Advanced to Expert (Medium → Hard)", badge: "Med/Hard" },
  { id: "sde", name: "Tier-1 SDE & FAANG Core", badge: "SDE Core" },
  { id: "web-dev", name: "Full-Stack & Web Architecture", badge: "Web Dev" },
  { id: "ai-ml", name: "AI, ML & Data Engineering", badge: "AI/ML" },
  { id: "oops", name: "Low-Level Design & OOPs", badge: "LLD/OOP" },
  { id: "company", name: "Target Company Track", badge: "Company Tuned" },
];

const TOPIC_OPTIONS = [
  { id: "arrays", label: "Arrays & Hashing" },
  { id: "strings", label: "Strings & Matching" },
  { id: "dp", label: "Dynamic Programming" },
  { id: "graphs", label: "Graphs & BFS/DFS" },
  { id: "trees", label: "Trees & BST" },
  { id: "linked-lists", label: "Linked Lists" },
  { id: "stacks-queues", label: "Stacks & Queues" },
  { id: "greedy", label: "Greedy Algorithms" },
  { id: "recursion", label: "Recursion & Backtracking" },
  { id: "sql", label: "SQL & Database Queries" },
  { id: "basic-programming", label: "Basic Programming" },
  { id: "oop-concepts", label: "OOP Concepts & LLD" },
  { id: "math-number-theory", label: "Math & Number Theory" },
  { id: "pseudocode", label: "Pseudocode & Logic" },
  { id: "web-development", label: "Web Development & APIs" },
];

const INITIAL_DEMO_QUESTIONS: AdminDSAQuestion[] = [
  {
    id: "admin-q-1",
    roadmap: "sde",
    roadmaps: ["sde", "easy-to-medium"],
    title: "Binary Search Insert Position",
    topic: "arrays",
    difficulty: "easy",
    targetCompanies: ["Google", "Microsoft", "Amazon"],
    prompt: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    solution_explanation: "Step 1: Perform Standard Binary Search on sorted array nums.\nStep 2: If nums[mid] === target, target is present at mid.\nStep 3: If target is not found when low > high, low index points precisely to the correct insertion position.",
    time_complexity: "O(log N)",
    space_complexity: "O(1)",
    solution_javascript: "function searchInsert(nums, target) {\n  let low = 0, high = nums.length - 1;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return low;\n}",
    solution_python: "def searchInsert(nums: List[int], target: int) -> int:\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target: return mid\n        if nums[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return low",
    solution_cpp: "int searchInsert(vector<int>& nums, int target) {\n    int low = 0, high = nums.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return low;\n}",
    visualizerSteps: [
      { line: 1, code: "function searchInsert(nums = [1,3,5,6], target = 5) {", vars: { low: "0", high: "3" }, log: "Binary Search for target or its sorted insert position in [1,3,5,6].", arrayState: [{ val: "1" }, { val: "3" }, { val: "5" }, { val: "6" }] },
      { line: 4, code: "  mid=1(val=3)<5 -> low=2; mid=2(val=5)==5 -> return idx 2;", vars: { mid: "2", target: "5" }, log: "Target 5 found at index 2. Return 2.", arrayState: [{ val: "1" }, { val: "3" }, { val: "5", match: true }, { val: "6" }] },
      { line: 8, code: "  return 2; // SEARCH INSERT POSITION COMPLETE", vars: { status: "COMPLETE" }, log: "Search Insert Position complete!", arrayState: [{ val: "Insert/Found at: 2", match: true }] }
    ],
    conceptual_hint: "Remember: In Binary Search, if target is missing after loop terminates (low > high), the low pointer holds the correct insertion index.",
    starter_js: "function searchInsert(nums, target) {\n  // Write your code here...\n}",
    starter_py: "def searchInsert(nums, target):\n    # Write your code here...\n    pass",
    starter_cpp: "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        // Write your code here...\n    }\n};",
    test_cases: "Input: nums = [1,3,5,6], target = 5 | Expected Output: 2\nInput: nums = [1,3,5,6], target = 2 | Expected Output: 1",
    created_at: new Date().toISOString(),
  },
];

export default function AdminDSAPage() {
  const { notify } = useNotifications();
  const [questions, setQuestions] = useState<AdminDSAQuestion[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form Step State (1 through 5)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [selectedRoadmap, setSelectedRoadmap] = useState("easy-to-medium");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("arrays");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [targetCompanies, setTargetCompanies] = useState("Google, Microsoft, Amazon");
  const [prompt, setPrompt] = useState("");

  // Step 2 Fields
  const [solutionExplanation, setSolutionExplanation] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("O(N)");
  const [spaceComplexity, setSpaceComplexity] = useState("O(1)");

  // Step 3 Fields
  const [solutionJS, setSolutionJS] = useState("");
  const [solutionPY, setSolutionPY] = useState("");
  const [solutionCPP, setSolutionCPP] = useState("");

  // Step 4 Fields (Visualizer Code Format)
  const [visualizerMode, setVisualizerMode] = useState<"json" | "builder">("builder");
  const [rawVisualizerJson, setRawVisualizerJson] = useState(`[
  {
    "line": 1,
    "code": "function solve(nums, target) {",
    "vars": { "low": "0", "high": "5" },
    "log": "Initialize algorithm execution window",
    "arrayState": [
      { "val": "1" },
      { "val": "3", "active": true },
      { "val": "5", "match": true }
    ]
  }
]`);
  const [builderSteps, setBuilderSteps] = useState<StepItem[]>([
    {
      line: 1,
      code: "function solve(nums, target) {",
      vars: { low: "0", high: "5" },
      log: "Initialize algorithm pointers and search range",
      arrayState: [{ val: "1" }, { val: "3", active: true }, { val: "5", match: true }],
    },
  ]);

  // Step 5 Fields
  const [conceptualHint, setConceptualHint] = useState("");
  const [starterJS, setStarterJS] = useState("");
  const [starterPY, setStarterPY] = useState("");
  const [starterCPP, setStarterCPP] = useState("");
  const [testCases, setTestCases] = useState("");

  // Load questions on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("careeros_admin_questions");
      if (saved) {
        setQuestions(JSON.parse(saved));
      } else {
        setQuestions(INITIAL_DEMO_QUESTIONS);
        localStorage.setItem("careeros_admin_questions", JSON.stringify(INITIAL_DEMO_QUESTIONS));
      }
    } catch (e) {
      setQuestions(INITIAL_DEMO_QUESTIONS);
    }
  }, []);

  // Save questions to localStorage
  const saveQuestions = (updated: AdminDSAQuestion[]) => {
    setQuestions(updated);
    localStorage.setItem("careeros_admin_questions", JSON.stringify(updated));
    window.dispatchEvent(new Event("careeros_admin_questions_updated"));
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !prompt) {
      notify({
        type: "warning",
        icon: "⚠️",
        title: "Missing Basic Details",
        body: "Please enter Problem Title and Prompt Statement in Step 1.",
      });
      setActiveStep(1);
      return;
    }

    // Parse visualizer steps
    let parsedVisualizerSteps: StepItem[] = [];
    if (visualizerMode === "json") {
      try {
        parsedVisualizerSteps = JSON.parse(rawVisualizerJson);
      } catch (err) {
        notify({
          type: "warning",
          icon: "⚠️",
          title: "Invalid Visualizer JSON",
          body: "Please check your JSON format in Step 4 for syntax errors.",
        });
        setActiveStep(4);
        return;
      }
    } else {
      parsedVisualizerSteps = builderSteps;
    }

    const cleanCompanies = targetCompanies.split(",").map((s) => s.trim()).filter(Boolean);

    const newQuestion: AdminDSAQuestion = {
      id: `admin-q-${Date.now()}`,
      roadmap: selectedRoadmap,
      roadmaps: [selectedRoadmap, "easy-to-medium"],
      title,
      topic,
      difficulty,
      targetCompanies: cleanCompanies,
      prompt,
      solution_explanation: solutionExplanation,
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      solution_javascript: solutionJS,
      solution_python: solutionPY,
      solution_cpp: solutionCPP,
      visualizerSteps: parsedVisualizerSteps,
      conceptual_hint: conceptualHint,
      starter_js: starterJS || `function ${title.replace(/[^a-zA-Z0-9]/g, "")}(inputData) {\n  // Write your code here...\n}`,
      starter_py: starterPY || `def solve(input_data):\n    # Write your code here...\n    pass`,
      starter_cpp: starterCPP || `class Solution {\npublic:\n    void solve() {\n        // Write your code here...\n    }\n};`,
      test_cases: testCases,
      created_at: new Date().toISOString(),
    };

    const updated = [newQuestion, ...questions];
    saveQuestions(updated);
    setShowCreateModal(false);
    resetForm();

    // Sync to Supabase Postgres dsa_questions table
    try {
      const supabase = createClient();
      await (supabase.from("dsa_questions") as any).insert({
        title,
        topic,
        difficulty: difficulty as any,
        prompt,
        solution_explanation: solutionExplanation,
      });
    } catch (err) {
      console.error("Error syncing question to Supabase dsa_questions table", err);
    }

    notify({
      type: "success",
      icon: "🎉",
      title: "Question Published!",
      body: `"${title}" is now published to "${selectedRoadmap.toUpperCase()}" track!`,
      autoDismiss: 4000,
    });
  };

  const resetForm = () => {
    setActiveStep(1);
    setTitle("");
    setPrompt("");
    setSolutionExplanation("");
    setTimeComplexity("O(N)");
    setSpaceComplexity("O(1)");
    setSolutionJS("");
    setSolutionPY("");
    setSolutionCPP("");
    setConceptualHint("");
    setStarterJS("");
    setStarterPY("");
    setStarterCPP("");
    setTestCases("");
  };

  const handleDelete = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    saveQuestions(updated);
    notify({
      type: "info",
      icon: "🗑️",
      title: "Question Deleted",
      body: "Question removed from practice bank.",
    });
  };

  // Helper to add visualizer step in builder
  const addBuilderStep = () => {
    const nextLine = builderSteps.length + 1;
    setBuilderSteps([
      ...builderSteps,
      {
        line: nextLine,
        code: `// Step ${nextLine} code line`,
        vars: { i: `${nextLine - 1}` },
        log: `Step ${nextLine} execution log explanation`,
        arrayState: [{ val: "val1" }, { val: "val2", active: true }],
      },
    ]);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Top Banner */}
      <div className="surface border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-purple-500/10 via-surface to-surface relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-purple-400 bg-purple-500/15 border border-purple-500/30">
              <Code2 className="size-3.5" /> CareerOS Admin Console — DSA Question Calibration
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              DSA Practice & Track Question Creator
            </h1>
            <p className="text-xs text-secondary leading-relaxed max-w-2xl">
              Publish new questions to specialized roadmaps with problem requirements, step-by-step logic, multi-language solutions, interactive visualizer steps, and student test templates.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-6 py-3.5 rounded-2xl font-extrabold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
          >
            <Plus className="size-4" /> Add New DSA Question
          </button>
        </div>
      </div>

      {/* Track Distribution Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface p-4 rounded-2xl border border-border space-y-1">
          <p className="text-[10px] font-extrabold text-muted uppercase">Total Admin Questions</p>
          <p className="font-display text-2xl font-extrabold text-purple-400">{questions.length}</p>
        </div>
        <div className="surface p-4 rounded-2xl border border-border space-y-1">
          <p className="text-[10px] font-extrabold text-muted uppercase">Active Roadmaps</p>
          <p className="font-display text-2xl font-extrabold text-teal-400">{ROADMAP_OPTIONS.length}</p>
        </div>
        <div className="surface p-4 rounded-2xl border border-border space-y-1">
          <p className="text-[10px] font-extrabold text-muted uppercase">Visualizer Animated</p>
          <p className="font-display text-2xl font-extrabold text-orange-400">
            {questions.filter((q) => q.visualizerSteps && q.visualizerSteps.length > 0).length}
          </p>
        </div>
        <div className="surface p-4 rounded-2xl border border-border space-y-1">
          <p className="text-[10px] font-extrabold text-muted uppercase">Target Companies</p>
          <p className="font-display text-2xl font-extrabold text-amber-400">12+</p>
        </div>
      </div>

      {/* Questions Bank Table */}
      <div className="surface border border-border rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-display text-lg font-extrabold text-primary flex items-center gap-2">
              <BookOpen className="size-5 text-purple-400" /> Published DSA Questions
            </h3>
            <p className="text-xs text-muted">Questions available in CareerOS Practice Tracks & Visualizers.</p>
          </div>
          <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {questions.length} Questions
          </span>
        </div>

        <div className="space-y-3">
          {questions.map((q) => {
            const rd = ROADMAP_OPTIONS.find((r) => r.id === q.roadmap);
            return (
              <div
                key={q.id}
                className="surface-2 rounded-2xl p-5 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-purple-500/40"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      🎯 {rd?.name || q.roadmap}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 capitalize">
                      {q.topic}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                        q.difficulty === "easy"
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                          : q.difficulty === "medium"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-primary flex items-center gap-2">
                    {q.title}
                    {q.visualizerSteps && q.visualizerSteps.length > 0 && (
                      <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20 flex items-center gap-1">
                        <Zap className="size-3 text-teal-400" /> Visualizer Enabled ({q.visualizerSteps.length} Steps)
                      </span>
                    )}
                  </h4>

                  <p className="text-xs text-secondary leading-relaxed line-clamp-2">{q.prompt}</p>

                  {q.targetCompanies && q.targetCompanies.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                      <span className="text-muted font-medium">Companies:</span>
                      {q.targetCompanies.map((c) => (
                        <span key={c} className="font-bold text-primary surface px-2 py-0.5 rounded-md border border-border">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-2.5 rounded-xl surface text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all shrink-0"
                  title="Delete Question"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MULTI-STEP QUESTION CREATOR MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-up">
          <div className="surface border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-4xl w-full space-y-6 shadow-2xl relative my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 mb-1">
                  <Sparkles className="size-3.5" /> 5-Step Question Calibration Wizard
                </div>
                <h3 className="font-display text-2xl font-extrabold text-primary flex items-center gap-2">
                  <Code2 className="size-6 text-purple-400" /> Create &amp; Calibrate DSA Question
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="size-9 rounded-2xl surface-2 border border-border text-muted hover:text-primary flex items-center justify-center transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 5-Step Wizard Progress Bar */}
            <div className="grid grid-cols-5 gap-2 pb-2">
              {[
                { step: 1, title: "1. Problem & Track" },
                { step: 2, title: "2. Logic & Complexity" },
                { step: 3, title: "3. Multi-Lang Solutions" },
                { step: 4, title: "4. Visualizer Animation" },
                { step: 5, title: "5. Write & Test Setup" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step as any)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    activeStep === s.step
                      ? "bg-purple-600 text-white border-purple-500 shadow-md font-extrabold"
                      : activeStep > s.step
                      ? "bg-purple-500/10 text-purple-300 border-purple-500/30 font-bold"
                      : "surface-2 text-muted border-border hover:text-primary"
                  }`}
                >
                  <p className="text-[10px] uppercase opacity-80">Step 0{s.step}</p>
                  <p className="text-xs truncate">{s.title.split(". ")[1]}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-6">
              {/* ── STEP 1: PROBLEM STATEMENT & REQUIREMENTS ── */}
              {activeStep === 1 && (
                <div className="space-y-5 animate-fade-up">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                    💡 <strong>Step 1:</strong> Select target Roadmap track, topic category, difficulty level, target companies, and detailed problem prompt statement.
                  </div>

                  {/* Select Roadmap Track */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="size-4 text-purple-400" /> Select Target Practice Track / Roadmap *
                    </label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {ROADMAP_OPTIONS.map((r) => (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => setSelectedRoadmap(r.id)}
                          className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-1 ${
                            selectedRoadmap === r.id
                              ? "bg-purple-600 text-white border-purple-400 shadow-lg ring-2 ring-purple-400/30"
                              : "surface-2 border-border text-secondary hover:text-primary"
                          }`}
                        >
                          <span className="text-xs font-bold truncate">{r.name}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md w-fit ${
                            selectedRoadmap === r.id ? "bg-white/20 text-white" : "bg-purple-500/10 text-purple-400"
                          }`}>
                            {r.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary">Topic Category *</label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-purple-500"
                      >
                        {TOPIC_OPTIONS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary">Difficulty *</label>
                      <select
                        value={difficulty}
                        onChange={(e: any) => setDifficulty(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-purple-500"
                      >
                        <option value="easy">🟢 Easy</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="hard">🔴 Hard</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary">Target Companies (Comma Separated)</label>
                      <input
                        type="text"
                        value={targetCompanies}
                        onChange={(e) => setTargetCompanies(e.target.value)}
                        placeholder="e.g. Google, Meta, Amazon"
                        className="w-full h-11 px-3.5 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary">Problem Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Search Insert Position"
                      required
                      className="w-full h-11 px-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-purple-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary">1. Problem Statement &amp; Requirements *</label>
                    <textarea
                      rows={5}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      required
                      placeholder="Enter full detailed problem description, constraints, and requirements..."
                      className="w-full p-4 rounded-2xl surface-2 border border-border text-xs text-primary leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 2: STEP-BY-STEP LOGIC BREAKDOWN & COMPLEXITY ── */}
              {activeStep === 2 && (
                <div className="space-y-5 animate-fade-up">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    💡 <strong>Step 2:</strong> Provide the optimal algorithm step-by-step logic breakdown and tight asymptotic space/time complexity bounds.
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary">Time Complexity *</label>
                      <input
                        type="text"
                        value={timeComplexity}
                        onChange={(e) => setTimeComplexity(e.target.value)}
                        placeholder="e.g. O(N log N) or O(N)"
                        className="w-full h-11 px-4 rounded-2xl surface-2 border border-border text-xs font-mono font-bold text-teal-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary">Space Complexity *</label>
                      <input
                        type="text"
                        value={spaceComplexity}
                        onChange={(e) => setSpaceComplexity(e.target.value)}
                        placeholder="e.g. O(1) or O(N)"
                        className="w-full h-11 px-4 rounded-2xl surface-2 border border-border text-xs font-mono font-bold text-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary">2. Step-by-Step Logic Breakdown &amp; Complexity Explanation *</label>
                    <textarea
                      rows={7}
                      value={solutionExplanation}
                      onChange={(e) => setSolutionExplanation(e.target.value)}
                      placeholder="Step 1: Initialize two pointers low=0, high=n-1.&#10;Step 2: Calculate mid = (low + high) / 2.&#10;Step 3: Compare nums[mid] with target and shrink search interval..."
                      className="w-full p-4 rounded-2xl surface-2 border border-border text-xs text-primary leading-relaxed focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 3: OFFICIAL MULTI-LANGUAGE ANSWER CODE ── */}
              {activeStep === 3 && (
                <div className="space-y-5 animate-fade-up">
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
                    💡 <strong>Step 3:</strong> Provide reference implementations for JavaScript, Python, and C++.
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                        <Code2 className="size-4" /> Official JavaScript Solution (JS)
                      </label>
                      <textarea
                        rows={6}
                        value={solutionJS}
                        onChange={(e) => setSolutionJS(e.target.value)}
                        placeholder="function solve(nums, target) {&#10;  // JavaScript reference solution&#10;}"
                        className="w-full p-4 rounded-2xl bg-[#09090b] border border-border text-xs font-mono text-orange-300 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                        <Code2 className="size-4" /> Official Python Solution (PY)
                      </label>
                      <textarea
                        rows={6}
                        value={solutionPY}
                        onChange={(e) => setSolutionPY(e.target.value)}
                        placeholder="def solve(nums: List[int], target: int) -> int:&#10;    # Python reference solution&#10;    pass"
                        className="w-full p-4 rounded-2xl bg-[#09090b] border border-border text-xs font-mono text-teal-300 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <Code2 className="size-4" /> Official C++ Solution (CPP)
                      </label>
                      <textarea
                        rows={6}
                        value={solutionCPP}
                        onChange={(e) => setSolutionCPP(e.target.value)}
                        placeholder="class Solution {&#10;public:&#10;    int solve(vector<int>& nums, int target) {&#10;        // C++ reference solution&#10;    }&#10;};"
                        className="w-full p-4 rounded-2xl bg-[#09090b] border border-border text-xs font-mono text-purple-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: INTERACTIVE VISUALIZER ANIMATION CODE ── */}
              {activeStep === 4 && (
                <div className="space-y-6 animate-fade-up">
                  {/* Format Documentation Box */}
                  <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-xs text-orange-200 space-y-3">
                    <div className="flex items-center gap-2 text-orange-400 font-extrabold text-sm">
                      <Zap className="size-4" /> Interactive Visualizer Code Format Specification
                    </div>
                    <p className="leading-relaxed">
                      The CareerOS 10x Visualizer engine executes an array of step objects (`StepItem[]`). Each step highlights a code line and renders data boxes:
                    </p>
                    <div className="p-3 rounded-xl bg-[#09090b] border border-orange-500/20 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      <pre className="whitespace-pre">{`[
  {
    "line": 1,                                  // Highlighted line number in code window
    "code": "function search(nums = [1,3,5], t = 5) {", // Line string
    "vars": { "low": "0", "high": "2" },         // Variable inspector key-values
    "log": "Binary Search initialized on range [0, 2]", // Step description log
    "arrayState": [                             // Data structure boxes representation
      { "val": "1" },
      { "val": "3", "active": true },           // active: true (Orange pulse)
      { "val": "5", "match": true }             // match: true (Green success)
    ]
  }
]`}</pre>
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <label className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
                      <Zap className="size-4 text-orange-500" /> 4. Visualizer Animation Step Configuration
                    </label>

                    <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-border">
                      <button
                        type="button"
                        onClick={() => setVisualizerMode("builder")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          visualizerMode === "builder" ? "bg-orange-500 text-white" : "text-muted hover:text-primary"
                        }`}
                      >
                        Visual Step Builder
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisualizerMode("json")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          visualizerMode === "json" ? "bg-orange-500 text-white" : "text-muted hover:text-primary"
                        }`}
                      >
                        Raw JSON Editor
                      </button>
                    </div>
                  </div>

                  {visualizerMode === "builder" ? (
                    <div className="space-y-4">
                      {builderSteps.map((st, idx) => (
                        <div key={idx} className="surface-2 border border-border p-4 rounded-2xl space-y-3 relative">
                          <div className="flex items-center justify-between border-b border-border pb-2">
                            <span className="text-xs font-bold text-orange-400">Step {idx + 1}</span>
                            {builderSteps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setBuilderSteps(builderSteps.filter((_, i) => i !== idx))}
                                className="text-xs text-red-400 hover:underline"
                              >
                                Remove Step
                              </button>
                            )}
                          </div>

                          <div className="grid sm:grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted uppercase">Line #</label>
                              <input
                                type="number"
                                value={st.line}
                                onChange={(e) => {
                                  const copy = [...builderSteps];
                                  copy[idx].line = Number(e.target.value);
                                  setBuilderSteps(copy);
                                }}
                                className="w-full h-9 px-3 rounded-xl surface border border-border text-xs font-mono text-primary"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[10px] font-bold text-muted uppercase">Code Line String</label>
                              <input
                                type="text"
                                value={st.code}
                                onChange={(e) => {
                                  const copy = [...builderSteps];
                                  copy[idx].code = e.target.value;
                                  setBuilderSteps(copy);
                                }}
                                className="w-full h-9 px-3 rounded-xl surface border border-border text-xs font-mono text-orange-300"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted uppercase">Execution Log Description</label>
                            <input
                              type="text"
                              value={st.log}
                              onChange={(e) => {
                                const copy = [...builderSteps];
                                copy[idx].log = e.target.value;
                                setBuilderSteps(copy);
                              }}
                              className="w-full h-9 px-3 rounded-xl surface border border-border text-xs text-primary"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addBuilderStep}
                        className="w-full py-3 rounded-2xl border border-dashed border-orange-500/40 text-orange-400 font-bold text-xs hover:bg-orange-500/10 flex items-center justify-center gap-2 transition-all"
                      >
                        <Plus className="size-4" /> Add Execution Step
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={12}
                        value={rawVisualizerJson}
                        onChange={(e) => setRawVisualizerJson(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-[#09090b] border border-border text-xs font-mono text-orange-300 leading-relaxed focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 5: WRITE CODE & TEST SETUP ── */}
              {activeStep === 5 && (
                <div className="space-y-5 animate-fade-up">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                    💡 <strong>Step 5:</strong> Configure student starter templates, conceptual hint, and test case expectations.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="size-4" /> Conceptual Hint for Students
                    </label>
                    <textarea
                      rows={3}
                      value={conceptualHint}
                      onChange={(e) => setConceptualHint(e.target.value)}
                      placeholder="Step 1: Perform Standard Binary Search... Step 2: Check boundary conditions..."
                      className="w-full p-3.5 rounded-2xl surface-2 border border-border text-xs text-primary leading-relaxed focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-orange-400">Student JS Starter Shell</label>
                      <textarea
                        rows={5}
                        value={starterJS}
                        onChange={(e) => setStarterJS(e.target.value)}
                        placeholder="function solve(inputData) {&#10;  // Write code here...&#10;}"
                        className="w-full p-3 rounded-2xl bg-[#09090b] border border-border text-xs font-mono text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-teal-400">Student Python Starter Shell</label>
                      <textarea
                        rows={5}
                        value={starterPY}
                        onChange={(e) => setStarterPY(e.target.value)}
                        placeholder="def solve(input_data):&#10;    # Write code here...&#10;    pass"
                        className="w-full p-3 rounded-2xl bg-[#09090b] border border-border text-xs font-mono text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-purple-400">Student C++ Starter Shell</label>
                      <textarea
                        rows={5}
                        value={starterCPP}
                        onChange={(e) => setStarterCPP(e.target.value)}
                        placeholder="class Solution {&#10;public:&#10;    void solve() {}&#10;};"
                        className="w-full p-3 rounded-2xl bg-[#09090b] border border-border text-xs font-mono text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary">Test Case Expectations &amp; Sample Outputs</label>
                    <textarea
                      rows={3}
                      value={testCases}
                      onChange={(e) => setTestCases(e.target.value)}
                      placeholder="TestCase 1: Input [1,3,5,6], target=5 -> 2&#10;TestCase 2: Input [1,3,5,6], target=2 -> 1"
                      className="w-full p-3.5 rounded-2xl surface-2 border border-border text-xs text-primary leading-relaxed focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep > 1) setActiveStep((activeStep - 1) as any);
                  }}
                  disabled={activeStep === 1}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold surface-2 border border-border text-secondary hover:text-primary disabled:opacity-40 flex items-center gap-1.5"
                >
                  <ChevronLeft className="size-4" /> Previous Step
                </button>

                <div className="flex items-center gap-2">
                  {activeStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep((activeStep + 1) as any)}
                      className="px-6 py-2.5 rounded-2xl text-xs font-extrabold bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-1.5"
                    >
                      Next Step <ChevronRight className="size-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-xl flex items-center gap-2"
                    >
                      <Sparkles className="size-4" /> Publish Question to Practice Track
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
