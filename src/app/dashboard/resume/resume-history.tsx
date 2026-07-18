"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteResume } from "./actions";
import { formatDate } from "@/lib/format";
import { Trash2, FileText, Loader2 } from "lucide-react";

export interface HistoryItem {
  id: string;
  file_name: string;
  created_at: string;
  status: string;
  resume_score: number | null;
}

export function ResumeHistory({ items }: { items: HistoryItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleDelete(id: string) {
    setError("");
    setPendingId(id);
    startTransition(async () => {
      const result = await deleteResume(id);
      if (!result.success) {
        setError(result.error ?? "Couldn't delete that.");
      }
      setPendingId(null);
    });
  }

  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
        Past uploads
      </p>
      <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <FileText className="size-4 text-slate-400 shrink-0" />
            <Link
              href={`/dashboard/resume/${item.id}`}
              className="flex-1 min-w-0 text-sm text-slate-700 hover:text-teal-700 truncate"
            >
              {item.file_name}
            </Link>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {formatDate(item.created_at)}
            </span>
            {item.resume_score !== null && (
              <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                {item.resume_score}
              </span>
            )}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={isPending}
              aria-label="Delete resume"
              className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {isPending && pendingId === item.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </button>
          </li>
        ))}
      </ul>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
