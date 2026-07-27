"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useNotifications, Notification } from "./notification-provider";
import { Bell, X, CheckCheck, Trash2, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const TYPE_ICON: Record<string, React.ReactNode> = {
  success: <CheckCircle className="size-3.5" style={{ color: "#2DD4BF" }} />,
  error:   <AlertCircle className="size-3.5" style={{ color: "#F87171" }} />,
  warning: <AlertTriangle className="size-3.5" style={{ color: "#FCD34D" }} />,
  info:    <Info className="size-3.5" style={{ color: "var(--orange)" }} />,
};

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="relative size-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          background: open ? "var(--orange-glow)" : "var(--bg-surface-2)",
          border: "1px solid var(--border)",
        }}
      >
        <Bell className="size-4" style={{ color: open ? "var(--orange)" : "var(--text-secondary)" }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 size-4 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: "var(--orange)", color: "#fff" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-12 w-80 rounded-2xl shadow-xl z-50 overflow-hidden"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            animation: "slide-in-top 0.25s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--orange)", color: "#fff" }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  title="Mark all as read"
                  className="p-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                  style={{ color: "var(--teal)" }}
                >
                  <CheckCheck className="size-3.5" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all"
                  className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: "var(--red)" }}
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell className="size-8 opacity-20" style={{ color: "var(--text-muted)" }} />
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n: Notification) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:opacity-90 border-b last:border-0"
                  style={{
                    background: n.read ? "transparent" : "var(--orange-dim)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="mt-0.5 shrink-0">{TYPE_ICON[n.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {n.icon && <span className="mr-1">{n.icon}</span>}
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-xs mt-0.5 line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {n.body}
                      </p>
                    )}
                    {n.action && (
                      <Link
                        href={n.action.href}
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold mt-1 inline-block"
                        style={{ color: "var(--orange)" }}
                      >
                        {n.action.label} →
                      </Link>
                    )}
                    <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                      {formatRelative(n.timestamp)}
                    </p>
                  </div>
                  {!n.read && (
                    <div
                      className="size-2 rounded-full mt-1.5 shrink-0"
                      style={{ background: "var(--orange)" }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
