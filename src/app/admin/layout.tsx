"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Crown,
  ArrowLeft,
  ChevronRight,
  Zap,
  KeyRound,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ALL_ADMIN_SECTIONS,
  AdminUserAccount,
  BOSS_ACCOUNT,
  authenticateAdminCredentials,
  authenticateAdminCredentialsAsync,
  getStoredAdminUsers,
  saveAdminUsers,
} from "@/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUserAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Login Form Inputs
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    function checkAuth() {
      try {
        const savedAuth = sessionStorage.getItem("careeros_admin_auth") || localStorage.getItem("careeros_admin_auth");
        const savedEmail = sessionStorage.getItem("careeros_admin_email") || localStorage.getItem("careeros_admin_email");

        if (savedAuth === "true" && savedEmail) {
          const cleanSaved = savedEmail.trim().toLowerCase();
          if (cleanSaved === BOSS_ACCOUNT.email.toLowerCase()) {
            setCurrentUser(BOSS_ACCOUNT);
            setIsLoading(false);
            return;
          }

          const users = getStoredAdminUsers();
          const match = users.find((u) => u.email.trim().toLowerCase() === cleanSaved);
          if (match) {
            setCurrentUser(match);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Auth check error", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    // Listen for employee permission updates in real time
    const handleUserUpdate = () => {
      const savedEmail = sessionStorage.getItem("careeros_admin_email") || localStorage.getItem("careeros_admin_email");
      if (savedEmail) {
        const cleanSaved = savedEmail.trim().toLowerCase();
        if (cleanSaved === BOSS_ACCOUNT.email.toLowerCase()) {
          setCurrentUser(BOSS_ACCOUNT);
          return;
        }
        const users = getStoredAdminUsers();
        const match = users.find((u) => u.email.trim().toLowerCase() === cleanSaved);
        if (match) setCurrentUser(match);
      }
    };

    window.addEventListener("careeros_admin_users_updated", handleUserUpdate);
    return () => window.removeEventListener("careeros_admin_users_updated", handleUserUpdate);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const user = await authenticateAdminCredentialsAsync(adminEmail, adminPin);

      if (user) {
        setCurrentUser(user);
        sessionStorage.setItem("careeros_admin_auth", "true");
        sessionStorage.setItem("careeros_admin_email", user.email);
        localStorage.setItem("careeros_admin_auth", "true");
        localStorage.setItem("careeros_admin_email", user.email);
        setLoginError(null);
      } else {
        setLoginError("Access Denied: Unrecognized Admin Email or Passcode. Only Boss or authorized Employees can log in.");
      }
    } catch (err) {
      setLoginError("Login error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogout = () => {
    setCurrentUser(null);
    setAdminPin("");
    sessionStorage.removeItem("careeros_admin_auth");
    sessionStorage.removeItem("careeros_admin_email");
    localStorage.removeItem("careeros_admin_auth");
    localStorage.removeItem("careeros_admin_email");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center surface" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-muted uppercase tracking-wider">Verifying Admin Authenticity...</p>
        </div>
      </div>
    );
  }

  // ── UNAUTHENTICATED ADMIN LOGIN SCREEN ──
  if (!currentUser) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 size-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full surface border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10 animate-fade-up">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="size-16 rounded-2xl bg-amber-500/15 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30 shadow-lg">
              <Crown className="size-8 text-amber-400" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Boss &amp; Staff Access Guard
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mt-2">
                Career<span className="text-orange-500">OS</span> Admin Portal
              </h2>
              <p className="text-xs text-secondary mt-1">
                Independent Admin Credentials Required. Only Boss or assigned staff can access.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 animate-fade-up">
                <AlertCircle className="size-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-amber-400" /> Admin / Employee Email *
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                placeholder="Fill access email provided by management"
                className="w-full h-11 px-4 rounded-2xl surface-2 border border-border text-xs text-primary font-medium focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-amber-400" /> Admin Passcode / Password *
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full h-11 pl-4 pr-10 rounded-2xl surface-2 border border-border text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  {showPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-secondary select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-amber-500 cursor-pointer"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-extrabold text-xs text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
            >
              {isSubmitting ? (
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Crown className="size-4 text-white" />
              )}
              <span>{isSubmitting ? "Authenticating..." : "Authenticate Admin Credentials"}</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
            <Link href="/dashboard" className="text-secondary hover:text-primary flex items-center gap-1.5 font-bold transition-colors">
              <ArrowLeft className="size-4" /> Return to Student Dashboard
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </div>
    );
  }

  // Filter navigation items based on current user's allowed section permissions
  const allowedNavItems = ALL_ADMIN_SECTIONS.filter((item) => {
    if (currentUser.isBoss) return true; // Boss gets all sections
    return currentUser.allowedSectionIds.includes(item.id);
  });

  // Check if current route is allowed for this user
  const currentSectionObj = ALL_ADMIN_SECTIONS.find((item) => item.href === pathname);
  const isSectionAllowed =
    currentUser.isBoss ||
    !currentSectionObj ||
    currentUser.allowedSectionIds.includes(currentSectionObj.id);

  // ── AUTHENTICATED ADMIN CONSOLE LAYOUT ──
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* ── ADMIN TOP HEADER BAR ── */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Left Logo & Admin Badge */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="font-display text-xl font-bold flex items-center gap-1.5">
              Career<span className="text-orange-500">OS</span>
            </Link>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${
                currentUser.isBoss
                  ? "text-amber-400 bg-amber-500/15 border-amber-500/30"
                  : "text-purple-400 bg-purple-500/15 border-purple-500/30"
              }`}
            >
              {currentUser.isBoss ? (
                <>
                  <Crown className="size-3.5 text-amber-400" /> Boss / Platform Owner
                </>
              ) : (
                <>
                  <UserCheck className="size-3.5 text-purple-400" /> Staff Member ({currentUser.department})
                </>
              )}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-bold surface-2 px-3.5 py-1.5 rounded-xl border border-border hover:border-orange-500/40 transition-colors flex items-center gap-1 text-secondary"
            >
              <ArrowLeft className="size-3.5" /> Student Dashboard
            </Link>

            <ThemeToggle />

            {/* Authenticated Admin Avatar & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-border text-xs">
              <div
                className={`size-8 rounded-full font-bold flex items-center justify-center text-xs shadow-sm ${
                  currentUser.isBoss ? "bg-amber-500 text-white" : "bg-purple-600 text-white"
                }`}
              >
                {currentUser.isBoss ? "👑" : "👤"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-primary leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-amber-400 font-mono pt-0.5">{currentUser.email}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleAdminLogout}
                className="p-2 rounded-xl surface-2 text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center gap-1 font-bold text-xs"
                title="Lock Admin Portal & Logout"
              >
                <LogOut className="size-3.5" />
                <span className="hidden md:inline">Lock Portal</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ADMIN BODY ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid md:grid-cols-12 gap-6">

        {/* Left Admin Sidebar Navigation */}
        <aside className="md:col-span-3 space-y-4">
          <div className="surface border border-border rounded-3xl p-4 space-y-1 shadow-md">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 py-2 flex items-center justify-between">
              <span>Management Suite</span>
              <span className="text-purple-400 font-mono text-[9px]">{allowedNavItems.length} Allowed</span>
            </p>
            {allowedNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-secondary hover:text-primary hover:bg-surface-2"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="size-3.5" />}
                </Link>
              );
            })}
          </div>

          {/* System Role Badge */}
          <div className="surface-2 border border-border rounded-3xl p-4 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-teal-400 font-bold">
              <span className="flex items-center gap-1"><Zap className="size-3.5" /> Role Status</span>
              <span>{currentUser.isBoss ? "Boss (Full Access)" : "Staff Member"}</span>
            </div>
            <p className="text-[11px] text-muted font-mono">{currentUser.role}</p>
          </div>
        </aside>

        {/* Main Admin Page Content OR Restricted Access Warning */}
        <main className="md:col-span-9 space-y-6">
          {isSectionAllowed ? (
            children
          ) : (
            <div className="surface border border-red-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-fade-up shadow-xl">
              <div className="size-20 rounded-3xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="size-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold text-red-400 uppercase tracking-widest bg-red-500/10 px-3.5 py-1 rounded-full border border-red-500/20">
                  ⛔ Section Access Restricted
                </span>
                <h3 className="font-display text-2xl font-extrabold text-primary">
                  {currentSectionObj?.label || "Restricted Admin Module"}
                </h3>
                <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                  You do not have permission from Boss (<strong className="text-amber-400 font-bold">bhaveshy9654@gmail.com</strong>) to open or view this section.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-2 border border-border text-xs text-muted max-w-sm mx-auto font-mono">
                Assigned Section Permissions: {currentUser.allowedSectionIds.join(", ") || "None"}
              </div>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-all"
              >
                Return to Allowed Admin Sections
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
