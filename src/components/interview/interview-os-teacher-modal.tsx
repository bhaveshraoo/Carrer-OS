"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  GraduationCap,
  Send,
  User,
  RotateCcw,
  Loader2,
  Sparkles,
  X,
  MessageSquare,
  Award,
  CheckCircle2,
  AlertTriangle,
  Brain,
  HelpCircle,
} from "lucide-react";
import type { InterviewSession, InterviewReport } from "@/lib/interview/schema";

interface Message {
  id: string;
  sender: "student" | "teacher";
  text: string;
  timestamp: string;
}

interface InterviewOSTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: InterviewSession;
  report: InterviewReport;
}

function FormattedMarkdown({ content, isTeacher }: { content: string; isTeacher: boolean }) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const firstLineEnd = part.indexOf("\n");
          const code = part.slice(firstLineEnd + 1, -3).trim();
          const lang = part.slice(3, firstLineEnd).trim() || "javascript";

          return (
            <div key={index} className="my-3 rounded-2xl overflow-hidden border border-border bg-slate-950 text-slate-100 text-xs font-mono shadow-md">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="uppercase text-orange-400">{lang}</span>
                <span className="text-[10px] text-muted">Classroom Board Sample</span>
              </div>
              <pre className="p-4 overflow-x-auto text-emerald-400 font-mono text-[12.5px] leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              if (!line.trim()) return <div key={lineIdx} className="h-1" />;

              const regex = /(\*\*.*?\*\*|`.*?`)/g;
              const matches = line.split(regex);

              const lineContent = matches.map((token, tokIdx) => {
                if (token.startsWith("**") && token.endsWith("**")) {
                  return (
                    <strong key={tokIdx} className={isTeacher ? "font-extrabold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-md border border-orange-500/20" : "font-extrabold underline"}>
                      {token.slice(2, -2)}
                    </strong>
                  );
                }
                if (token.startsWith("`") && token.endsWith("`")) {
                  return (
                    <code key={tokIdx} className="font-mono text-xs bg-orange-500/15 text-orange-300 px-1.5 py-0.5 rounded border border-orange-500/30">
                      {token.slice(1, -1)}
                    </code>
                  );
                }
                return token;
              });

              if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-orange-500 font-bold shrink-0">•</span>
                    <span>{lineContent}</span>
                  </div>
                );
              }

              return <p key={lineIdx}>{lineContent}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export function InterviewOSTeacherModal({
  isOpen,
  onClose,
  session,
  report,
}: InterviewOSTeacherModalProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Initialize welcome message
      const initialWelcome: Message = {
        id: "msg-welcome",
        sender: "teacher",
        text: `Hello! I am your **CareerOS Teacher** (OS-Teacher) 🎓.\n\nI've reviewed your full interview evaluation report for **${session.job_role}** at **${session.company_name}**.\n\nYour score is **${report.overall_score}/100** (${report.hiring_recommendation}).\n\nAsk me anything about your score breakdown, your specific mistakes, why points were deducted, or how to master missing concepts!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([initialWelcome]);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, session, report]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen || !mounted) return null;

  async function handleSend(textToSend?: string) {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const studentMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistory = [...messages, studentMsg];
    setMessages(nextHistory);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/interview/os-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole: session.job_role,
          companyName: session.company_name,
          interviewType: session.interview_type,
          personality: session.personality,
          overallScore: report.overall_score,
          recommendation: report.hiring_recommendation,
          verdictReason: report.candidate_verdict_reason,
          strengths: report.strengths,
          weaknesses: report.weaknesses,
          redFlags: report.red_flags,
          missingConcepts: report.missing_critical_concepts,
          questionEvaluations: report.question_evaluations,
          userMessage: query,
          chatHistory: nextHistory.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      const teacherReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "teacher",
        text: data.reply || "I am analyzing your score. Let's revisit this question step-by-step!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, teacherReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: "teacher",
          text: "Encountered a brief network pause during our debrief. Please ask your question again!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const suggestedQuestions = [
    "Why did I get this score?",
    "Explain my technical mistakes & red flags",
    "How can I improve my score next time?",
    report.missing_critical_concepts?.[0]
      ? `Explain missing concept: ${report.missing_critical_concepts[0]}`
      : "What key system trade-offs did I miss?",
  ];

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl surface border-2 border-orange-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[720px] relative transition-all duration-300 transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-border surface-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-orange-500/15 text-orange-500 border border-orange-500/30 flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-primary">os-teacher</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  Interview Debrief Coach
                </span>
              </div>
              <p className="text-[11px] text-muted font-medium">
                {session.job_role} @ {session.company_name} • Score: <strong className="text-orange-400 font-mono">{report.overall_score}/100</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([]);
                const initialWelcome: Message = {
                  id: "msg-welcome",
                  sender: "teacher",
                  text: `Interview debrief reset. Your score is **${report.overall_score}/100** (${report.hiring_recommendation}). Ask me any doubt about your interview performance!`,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };
                setMessages([initialWelcome]);
              }}
              className="p-2 rounded-xl text-muted hover:text-primary hover:bg-orange-500/10 transition-colors cursor-pointer"
              title="Reset Debrief Chat"
            >
              <RotateCcw className="size-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted hover:text-primary hover:bg-orange-500/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 surface">
          {messages.map((msg) => {
            const isTeacher = msg.sender === "teacher";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isTeacher ? "justify-start" : "justify-end"}`}
              >
                {isTeacher && (
                  <div className="size-8 rounded-xl bg-orange-500/15 text-orange-500 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <GraduationCap className="size-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isTeacher
                      ? "surface-2 border border-border text-primary"
                      : "bg-orange-500 text-white font-semibold"
                  }`}
                >
                  <FormattedMarkdown content={msg.text} isTeacher={isTeacher} />
                  <span
                    className={`text-[9px] block text-right mt-1.5 font-mono ${
                      isTeacher ? "text-muted" : "text-white/80"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {!isTeacher && (
                  <div className="size-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="size-8 rounded-xl bg-orange-500/15 text-orange-500 border border-orange-500/30 flex items-center justify-center shrink-0">
                <GraduationCap className="size-4" />
              </div>
              <div className="p-4 rounded-2xl surface-2 border border-border text-xs flex items-center gap-2 text-muted">
                <Loader2 className="size-4 animate-spin text-orange-500" />
                <span>OS-Teacher is reviewing your interview transcript &amp; mistakes...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Quick Chips */}
        <div className="p-3 surface-2 border-t border-border overflow-x-auto flex items-center gap-2 scrollbar-none shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted shrink-0 pl-1">
            Quick Doubts:
          </span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl surface border border-border hover:border-orange-500/50 text-[11px] font-bold text-primary transition-all shrink-0 hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 surface-2 border-t border-border shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask OS-Teacher about your score, mistakes, or roadmap..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl surface border border-border text-xs font-semibold text-primary focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
