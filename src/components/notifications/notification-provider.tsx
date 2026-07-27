"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body?: string;
  icon?: string;
  action?: { label: string; href: string };
  autoDismiss?: number; // ms — 0 = never
  read: boolean;
  timestamp: Date;
}

interface State {
  notifications: Notification[];
  toasts: Notification[];
}

type Action =
  | { type: "ADD"; payload: Notification }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "MARK_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "CLEAR_ALL" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return {
        notifications: [action.payload, ...state.notifications].slice(0, 50),
        toasts: [...state.toasts, action.payload].slice(-4), // max 4 toasts
      };
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      };
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "CLEAR_ALL":
      return { notifications: [], toasts: [] };
    default:
      return state;
  }
}

interface NotificationContextValue {
  notifications: Notification[];
  toasts: Notification[];
  unreadCount: number;
  notify: (opts: Omit<Notification, "id" | "read" | "timestamp">) => void;
  dismiss: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { notifications: [], toasts: [] });

  const notify = useCallback(
    (opts: Omit<Notification, "id" | "read" | "timestamp">) => {
      const notification: Notification = {
        ...opts,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        read: false,
        timestamp: new Date(),
        autoDismiss: opts.autoDismiss ?? 5000,
      };
      dispatch({ type: "ADD", payload: notification });
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", id });
  }, []);

  const markRead = useCallback((id: string) => {
    dispatch({ type: "MARK_READ", id });
  }, []);

  const markAllRead = useCallback(() => {
    dispatch({ type: "MARK_ALL_READ" });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications: state.notifications, toasts: state.toasts, unreadCount, notify, dismiss, markRead, markAllRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
