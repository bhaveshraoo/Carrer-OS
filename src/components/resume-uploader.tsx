"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Stage = "idle" | "uploading" | "analyzing" | "error";

export function ResumeUploader() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setStage("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error ?? "Upload failed");
      }

      setStage("analyzing");

      const analyzeRes = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: uploadData.resume.id }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error ?? "Analysis failed");
      }

      router.refresh();
    } catch (err) {
      setStage("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
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
      <div className="border-2 border-dashed border-teal-300 bg-teal-50/50 rounded-xl p-10 text-center">
        <Loader2 className="size-8 mx-auto mb-3 text-teal-600 animate-spin" />
        <p className="text-sm font-medium text-navy-900">
          {stage === "uploading" ? "Uploading resume..." : "Analyzing — this takes about 20-30 seconds"}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {stage === "analyzing" && "Extracting details, scoring, and generating suggestions"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragOver ? "border-teal-500 bg-teal-50" : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <Upload className="size-8 mx-auto mb-3 text-slate-400" />
        <p className="text-sm text-slate-600">
          Drag and drop your resume, or <span className="text-teal-700 font-medium">browse</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">PDF or DOCX, up to 8MB</p>
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
        <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
          <FileText className="size-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="mt-3">
        <Button variant="outline" size="sm" onClick={() => setStage("idle")} className="hidden">
          Retry
        </Button>
      </div>
    </div>
  );
}
