"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useNotifications, Notification } from "./notification-provider";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle className="size-4" style={{ color: "#2DD4BF" }} />,
  error:   <AlertCircle className="size-4" style={{ color: "#F87171" }} />,
  warning: <AlertTriangle className="size-4" style={{ color: "#FCD34D" }} />,
  info:    <Info className="size-4" style={{ color: "var(--orange)" }} />,
};

const ACCENT: Record<string, string> = {
  success: "var(--teal)",
  error:   "var(--red)",
  warning: "var(--amber)",
  info:    "var(--orange)",
};

function ToastItem({ n, onDismiss }: { n: Notification; onDismiss: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (n.autoDismiss && n.autoDismiss > 0) {
      timerRef.current = setTimeout(() => onDismiss(n.id), n.autoDismiss);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [n.id, n.autoDismiss, onDismiss]);

  const accent = ACCENT[n.type];

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg pointer-events-auto"
      style={{
        background: "var(--glass-bg)",
        border: `1px solid var(--border-strong)`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        animation: "slide-in-top 0.35s cubic-bezier(0.16,1,0.3,1) both",
        minWidth: 300,
        maxWidth: 380,
      }}
    >
      {/* Accent left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: accent }}
      />

      <div className="pl-4 pr-3 py-3 flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{ICONS[n.type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {n.icon && <span className="mr-1">{n.icon}</span>}
            {n.title}
          </p>
          {n.body && (
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {n.body}
            </p>
          )}
          {n.action && (
            <Link
              href={n.action.href}
              className="inline-block mt-1.5 text-xs font-semibold underline underline-offset-2"
              style={{ color: accent }}
              onClick={() => onDismiss(n.id)}
            >
              {n.action.label} →
            </Link>
          )}
        </div>
        <button
          onClick={() => onDismiss(n.id)}
          className="shrink-0 mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "var(--text-muted)" }}
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      {n.autoDismiss && n.autoDismiss > 0 && (
        <div className="absolute bottom-0 left-1 right-0 h-0.5 overflow-hidden">
          <div
            className="h-full origin-left"
            style={{
              background: accent,
              opacity: 0.4,
              animation: `progress-bar ${n.autoDismiss}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export function NotificationToastStack() {
  const { toasts, dismiss } = useNotifications();

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: 380 }}
    >
      {toasts.map((n) => (
        <ToastItem key={n.id} n={n} onDismiss={dismiss} />
      ))}
    </div>
  );
}
