"use client";

import { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
  Send,
  User,
  RotateCcw,
  Loader2,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

interface Message {
  id: string;
  sender: "student" | "teacher";
  text: string;
  timestamp: string;
}

interface OSTeacherChatProps {
  questionTitle: string;
  topic: string;
  difficulty: string;
  prompt: string;
  solutionExplanation: string | null;
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
                <span className="text-[10px] text-muted">Classroom Board Code</span>
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

export function OSTeacherChat({
  questionTitle,
  topic,
  difficulty,
  prompt,
  solutionExplanation,
}: OSTeacherChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "teacher",
      text: `Welcome to the classroom! I'm **OS-Teacher**, your personal DSA mentor 👨‍🏫.\n\nWe are currently analyzing **"${questionTitle}"** (${topic.toUpperCase()} • ${difficulty.toUpperCase()}).\n\nWhat doubt do you have about this problem? Feel free to ask for a Socratic hint, complexity breakdown, or step-by-step logic trace!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "student",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/prep/os-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionTitle,
          topic,
          difficulty,
          prompt,
          solutionExplanation,
          userMessage: textToSend,
          chatHistory: messages.slice(-6),
        }),
      });

      const data = await res.json();

      const teacherMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "teacher",
        text: data.reply || "Classroom connection glitch! Ask your question again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, teacherMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "teacher",
          text: "I had a quick network hiccup. Please ask your doubt again!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: "💡 Socratic Hint", text: "Can you give me a subtle hint to get started on this problem without revealing full code?" },
    { label: "⏱️ Time & Space Complexity", text: "What is the optimal Time and Space complexity for this problem and why?" },
    { label: "🔍 Edge Case Trace", text: "What edge cases should I be careful of for this question?" },
    { label: "📝 Step-by-Step Logic", text: "Can you break down the step-by-step intuition for this solution in simple terms?" },
  ];

  return (
    <div className="surface border border-border rounded-3xl p-6 space-y-6 shadow-xl animate-fade-up">
      {/* 👨‍🏫 CLASSROOM HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-sm">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-primary">os-teacher</h3>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Live Mentor
              </span>
            </div>
            <p className="text-xs font-semibold text-muted">
              Classroom Mentor for <span className="text-orange-400 font-bold">"{questionTitle}"</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="px-3 py-1.5 rounded-xl text-xs font-bold surface-2 border border-border text-muted hover:text-primary transition-colors flex items-center gap-1.5"
          title="Clear doubt history"
        >
          <RotateCcw className="size-3.5" /> Clear Board
        </button>
      </div>

      {/* 💡 QUICK DOUBT CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.text)}
            disabled={isLoading}
            className="shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl surface-2 border border-border text-secondary hover:text-primary hover:border-orange-500/40 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* 💬 CHAT MESSAGES WINDOW */}
      <div className="surface-2 border border-border rounded-2xl p-4 min-h-[340px] max-h-[480px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isTeacher = msg.sender === "teacher";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isTeacher ? "justify-start" : "justify-end"}`}
            >
              {isTeacher && (
                <div className="size-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0 mt-1 shadow-sm">
                  <GraduationCap className="size-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isTeacher
                    ? "surface border-l-4 border-l-orange-500 border-border text-primary shadow-md space-y-2"
                    : "bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[11px] font-bold opacity-80 border-b border-current/10 pb-1 mb-1">
                  <span className="flex items-center gap-1 text-orange-400">
                    {isTeacher ? "👨‍🏫 OS-Teacher" : "🎓 Student"}
                  </span>
                  <span className="font-mono text-[10px] text-muted">{msg.timestamp}</span>
                </div>

                <FormattedMarkdown content={msg.text} isTeacher={isTeacher} />
              </div>

              {!isTeacher && (
                <div className="size-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-orange-500/20">
                  <User className="size-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <GraduationCap className="size-4 animate-bounce" />
            </div>
            <div className="surface border border-border rounded-2xl p-4 text-sm text-primary font-bold flex items-center gap-2">
              <Loader2 className="size-4 animate-spin text-orange-500" />
              <span>OS-Teacher is writing on the classroom board...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ✏️ STUDENT INPUT BAR */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Type your doubt about "${questionTitle}"...`}
          disabled={isLoading}
          className="flex-1 surface-2 border border-border focus:border-orange-500 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-muted outline-none transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="px-6 py-3 rounded-2xl text-xs font-extrabold bg-orange-500 text-white hover:brightness-110 disabled:opacity-40 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20 shrink-0"
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Ask Doubt
        </button>
      </div>
    </div>
  );
}
