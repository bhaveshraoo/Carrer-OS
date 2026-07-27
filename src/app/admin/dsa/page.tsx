"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Building2,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface DSAProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  targetCompanies: string[];
  weightage: number;
  description: string;
}

const INITIAL_PROBLEMS: DSAProblem[] = [
  {
    id: "dsa-1",
    title: "Maximum Subarray Revenue (Kadane's Algorithm)",
    topic: "Arrays",
    difficulty: "Medium",
    targetCompanies: ["Google", "Microsoft", "Atlassian"],
    weightage: 85,
    description: "Given an integer array nums, find the subarray with the largest sum and return its sum.",
  },
  {
    id: "dsa-2",
    title: "WebSocket Audio Stream Connection Engine",
    topic: "WebSockets",
    difficulty: "Hard",
    targetCompanies: ["OpenAI", "CareerOS", "Stripe"],
    weightage: 92,
    description: "Design a real-time binary audio stream buffer with zero packet drop fallback.",
  },
];

export default function AdminDSAPage() {
  const { notify } = useNotifications();
  const [problems, setProblems] = useState<DSAProblem[]>(INITIAL_PROBLEMS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [companiesInput, setCompaniesInput] = useState("Google, Atlassian, Microsoft");
  const [weightage, setWeightage] = useState(85);
  const [description, setDescription] = useState("");

  function handleCreateProblem(e: React.FormEvent) {
    e.preventDefault();
    const newProb: DSAProblem = {
      id: `dsa-${Date.now()}`,
      title,
      topic,
      difficulty,
      targetCompanies: companiesInput.split(",").map((s) => s.trim()),
      weightage: Number(weightage),
      description,
    };

    setProblems([newProb, ...problems]);
    setShowCreateModal(false);

    notify({
      type: "success",
      icon: "💻",
      title: "DSA Question Published!",
      body: `Published "${title}" to practice bank and mapped to ${companiesInput}.`,
      autoDismiss: 4000,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-purple-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-purple-400 bg-purple-500/15 border border-purple-500/30">
              <Code2 className="size-3.5 text-purple-400" /> Required Tag: DSA Question Creator
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              DSA Question & PYQ Creator
            </h1>
            <p className="text-xs text-secondary">
              Add new coding questions, configure topic weightages, write solution approaches, and map questions to target companies.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-purple-600 text-white hover:brightness-110 shadow-md shadow-purple-600/20 shrink-0 flex items-center gap-1.5"
          >
            <Plus className="size-4" /> Add New DSA Question
          </button>
        </div>
      </div>

      {/* Problems Bank List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider px-2">
          <span>Active DSA Questions ({problems.length})</span>
          <span>Topic & Weightage</span>
        </div>

        <div className="space-y-3">
          {problems.map((p) => (
            <div key={p.id} className="surface rounded-3xl p-5 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-primary">{p.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    p.difficulty === "Hard" ? "bg-red-500/20 text-red-300" : "bg-orange-500/20 text-orange-300"
                  }`}>
                    {p.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    Topic: {p.topic}
                  </span>
                </div>
                <p className="text-muted leading-relaxed line-clamp-1">{p.description}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="text-muted">Target Companies:</span>
                  {p.targetCompanies.map((c) => (
                    <span key={c} className="font-semibold text-primary surface-2 px-2 py-0.5 rounded-lg border border-border">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-teal-400 font-mono text-sm">{p.weightage}% Weight</span>
                <button
                  onClick={() => setProblems((prev) => prev.filter((x) => x.id !== p.id))}
                  className="p-2 rounded-xl surface-2 text-red-400 hover:bg-red-500/10 border border-red-500/20"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE DSA QUESTION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Code2 className="size-5 text-purple-400" /> Add New DSA Question
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary">Problem Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Reverse Nodes in k-Group"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Trees">Trees</option>
                    <option value="WebSockets">WebSockets</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Weightage %</label>
                  <input
                    type="number"
                    value={weightage}
                    onChange={(e) => setWeightage(Number(e.target.value))}
                    required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Target Companies (Comma Separated)</label>
                <input
                  type="text"
                  value={companiesInput}
                  onChange={(e) => setCompaniesInput(e.target.value)}
                  required
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Problem Statement & Test Case Summary</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe problem statement..."
                  className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl font-bold bg-purple-600 text-white hover:brightness-110 shadow-md">
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
