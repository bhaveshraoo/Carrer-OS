"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Upload, X, FileText } from "lucide-react";
import { ResumeUploader } from "@/components/resume-uploader";

export function UploadResumeModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="surface border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-orange-400" />
            <h3 className="font-display text-base font-extrabold text-primary">
              Upload New Resume Document
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full text-muted hover:text-primary hover:bg-surface-2 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="text-xs text-secondary font-medium">
          Upload your updated PDF or DOCX resume. Gemini will automatically run a fresh 5-benchmark audit and update your score!
        </p>

        <div className="pt-2">
          <ResumeUploader />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-surface-2 hover:bg-surface-3 text-secondary hover:text-primary border border-border transition-all shrink-0 shadow-sm"
      >
        <Upload className="size-4 text-orange-400" />
        <span>Upload New Resume</span>
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
