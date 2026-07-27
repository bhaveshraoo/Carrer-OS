"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/notifications/notification-provider";

type Stage = "idle" | "uploading" | "analyzing" | "done" | "error";

export function ResumeUploader() {
  const router   = useRouter();
  const { notify } = useNotifications();
  const [stage, setStage]       = useState<Stage>("idle");
  const [error, setError]       = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setStage("uploading");

    notify({
      type: "info",
      icon: "📤",
      title: "Uploading your resume…",
      body: "Sit tight — we'll scan it with AI in seconds.",
      autoDismiss: 4000,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes  = await fetch("/api/resume/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      setStage("analyzing");

      notify({
        type: "info",
        icon: "🧠",
        title: "Analysing your resume…",
        body: "AI is scoring, extracting, and rewriting — takes about 20–30s.",
        autoDismiss: 6000,
      });

      const analyzeRes  = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: uploadData.resume.id }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) throw new Error(analyzeData.error ?? "Analysis failed");

      setStage("done");

      notify({
        type: "success",
        icon: "✅",
        title: "Resume report is ready!",
        body: "Your ATS score, suggestions, and rewrites are live.",
        action: { label: "View report", href: "/dashboard/resume" },
        autoDismiss: 0, // keep until dismissed
      });

      notify({
        type: "info",
        icon: "🎯",
        title: "Pick your target companies",
        body: "Now that your resume is scored, add companies to get a personalised DSA prep plan.",
        action: { label: "Browse companies", href: "/dashboard/companies" },
        autoDismiss: 8000,
      });

      router.refresh();
    } catch (err) {
      setStage("error");
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      notify({
        type: "error",
        icon: "❌",
        title: "Upload failed",
        body: msg,
        autoDismiss: 6000,
      });
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  if (stage === "uploading" || stage === "analyzing") {
    return (
      <div
        className="border-2 border-dashed rounded-2xl p-10 text-center"
        style={{ borderColor: "rgba(249,115,22,0.4)", background: "var(--orange-glow)" }}
      >
        <div className="relative inline-flex mb-4">
          <Loader2
            className="size-10 animate-spin"
            style={{ color: "var(--orange)" }}
          />
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: "var(--orange)" }}
          />
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {stage === "uploading" ? "Uploading resume…" : "AI is analysing your resume…"}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          {stage === "analyzing"
            ? "Scoring, extracting details, and generating rewrites — ~20–30s"
            : "Securely transferring your file"}
        </p>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div
        className="border-2 border-dashed rounded-2xl p-10 text-center animate-fade-up"
        style={{ borderColor: "rgba(45,212,191,0.4)", background: "var(--teal-dim)" }}
      >
        <CheckCircle2
          className="size-10 mx-auto mb-3"
          style={{ color: "var(--teal)" }}
        />
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Analysis complete — scroll down to see your report
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300"
        style={{
          borderColor: dragOver ? "var(--orange)" : "var(--border-strong)",
          background: dragOver ? "var(--orange-glow)" : "var(--bg-surface)",
          transform: dragOver ? "scale(1.01)" : "scale(1)",
        }}
      >
        <div
          className="size-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300"
          style={{
            background: dragOver ? "var(--orange-glow)" : "var(--bg-surface-2)",
            border: `2px solid ${dragOver ? "var(--orange)" : "var(--border)"}`,
          }}
        >
          <Upload className="size-6" style={{ color: dragOver ? "var(--orange)" : "var(--text-muted)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Drag and drop your resume, or{" "}
          <span className="font-semibold" style={{ color: "var(--orange)" }}>
            browse
          </span>
        </p>
        <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
          PDF or DOCX · up to 8 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {stage === "error" && (
        <div
          className="mt-3 flex items-start gap-2 text-sm rounded-xl p-3"
          style={{ background: "var(--red-dim)", color: "var(--red)" }}
        >
          <FileText className="size-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
