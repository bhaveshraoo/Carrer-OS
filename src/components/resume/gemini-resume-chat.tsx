"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  Bot,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "How can I add quantified metrics to my project bullets?",
  "What critical technical skills am I missing on my resume?",
  "How do I rewrite 'worked on website' into a STAR bullet?",
  "Is my current layout formatting ATS friendly?",
];

/**
 * Custom Rich Markdown Parser for Chat Messages
 */
function FormattedMarkdownText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inList = false;
  let currentListItems: React.ReactNode[] = [];

  const flushList = (keyPrefix: string) => {
    if (inList && currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`ul-${keyPrefix}`} className="space-y-1.5 my-2 pl-1">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`${idx}`);
      return;
    }

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      flushList(`${idx}`);
      const headingText = trimmed.replace(/^#+\s*/, "");
      renderedElements.push(
        <h4
          key={`h-${idx}`}
          className="font-display text-xs font-extrabold text-orange-400 uppercase tracking-wider mt-4 mb-1.5 flex items-center gap-1.5 border-b border-orange-500/20 pb-1"
        >
          <Zap className="size-3.5 text-orange-400 shrink-0" />
          <span>{renderInlineMarkdown(headingText)}</span>
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      inList = true;
      const bulletText = trimmed.replace(/^[\*\-\•]\s*/, "");
      currentListItems.push(
        <li key={`li-${idx}`} className="flex items-start gap-2 text-xs text-primary leading-relaxed">
          <span className="size-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
          <span>{renderInlineMarkdown(bulletText)}</span>
        </li>
      );
      return;
    }

    flushList(`${idx}`);
    renderedElements.push(
      <p key={`p-${idx}`} className="text-xs text-primary leading-relaxed my-1 font-medium">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList("final");

  return <div className="space-y-1">{renderedElements}</div>;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-extrabold text-orange-300 bg-orange-500/10 px-1 py-0.5 rounded border border-orange-500/20">
          {inner}
        </strong>
      );
    }
    return part;
  });
}

export function GeminiResumeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      content:
        "Hello! I am your **CareerOS Resume AI Strategist**. I have reviewed your uploaded resume text. Ask me anything about improving your bullet points, adding metrics, closing skill gaps, or ATS formatting!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Scroll ONLY the internal chat container, NEVER the page/window!
  const scrollInternalChatToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Skip initial mount auto-scroll to prevent page jump when clicking tab
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollInternalChatToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/resumes/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get AI response.");

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: `⚠️ Error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-2xl overflow-hidden min-h-[620px] flex flex-col justify-between">
      <CardHeader className="p-6 bg-gradient-to-r from-orange-500/10 via-background to-background border-b border-border shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/25">
              <Bot className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-primary flex items-center gap-2">
                Gemini Resume AI Assistant
              </CardTitle>
              <CardDescription className="text-xs">
                Ask questions strictly scoped to your resume, bullet rewrites, and ATS improvements.
              </CardDescription>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
            <Sparkles className="size-3" /> Resume Advisor Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Chat History Messages Container with Fixed High Height */}
        <div
          ref={scrollContainerRef}
          className="space-y-4 h-[480px] overflow-y-auto pr-2 scrollbar-thin"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-surface-2 border border-border text-primary"
                }`}
              >
                {m.sender === "user" ? <User className="size-4" /> : <Bot className="size-4 text-orange-400" />}
              </div>

              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-orange-500 text-white font-medium shadow-md shadow-orange-500/10 rounded-tr-none"
                    : "surface border border-border text-primary shadow-sm rounded-tl-none"
                }`}
              >
                {m.sender === "user" ? (
                  <span>{m.content}</span>
                ) : (
                  <FormattedMarkdownText text={m.content} />
                )}
                <div
                  className={`text-[9px] mt-2 font-medium ${
                    m.sender === "user" ? "text-white/70 text-right" : "text-muted"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-xs font-bold">
                <Bot className="size-4 text-orange-400" />
              </div>
              <div className="surface border border-border text-primary p-3 rounded-2xl text-xs flex items-center gap-2 rounded-tl-none">
                <RefreshCw className="size-3.5 animate-spin text-orange-400" />
                <span className="text-secondary font-medium">Gemini is analyzing your resume query...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips & Input */}
        <div className="space-y-3 shrink-0 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-muted flex items-center gap-1">
              <Lightbulb className="size-3 text-orange-400" /> Suggested Resume Questions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-[11px] text-secondary hover:text-primary bg-surface-2 hover:bg-orange-500/10 border border-border hover:border-orange-500/30 px-3 py-1 rounded-full transition-all text-left truncate max-w-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about your resume, metrics, or ATS alignment..."
              className="flex-1 surface-2 border border-border rounded-xl px-4 py-2.5 text-xs text-primary focus:border-orange-500 focus:outline-none transition-colors"
            />
            <Button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              variant="primary"
              className="shrink-0 px-4 py-2.5 shadow-md shadow-orange-500/20"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
