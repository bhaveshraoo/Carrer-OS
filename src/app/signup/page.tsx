"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, CheckCircle2, KeyRound, ArrowRight, Lock, User, AtSign, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

type Mode = "quick" | "password";
type Status = "idle" | "submitting" | "sent" | "error";

const GoogleIcon = () => (
  <svg className="size-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("quick");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP Verification States
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpError, setOtpError] = useState("");

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });

    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }
    setStatus("sent");
  }

  async function handleVerifyOtpCode(e: React.FormEvent) {
    e.preventDefault();
    const fullCode = otpCode.join("");
    if (fullCode.length < 6) {
      setOtpError("Please enter all 6 digits of the OTP code.");
      return;
    }

    setOtpSubmitting(true);
    setOtpError("");

    const supabase = createClient();
    const targetEmail = mode === "quick" ? email : pwEmail;

    // Try verification as signup OTP first
    let { data, error } = await supabase.auth.verifyOtp({
      email: targetEmail,
      token: fullCode,
      type: "signup",
    });

    if (error) {
      // Fallback try as email/magiclink OTP
      const { data: eData, error: eErr } = await supabase.auth.verifyOtp({
        email: targetEmail,
        token: fullCode,
        type: "email",
      });
      data = eData;
      error = eErr;
    }

    setOtpSubmitting(false);

    if (error) {
      setOtpError(error.message || "Invalid or expired OTP code. Please try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function handleOtpDigitChange(index: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`signup-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`signup-otp-input-${index - 1}`);
      prevInput?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtpCode(digits);
      const lastInput = document.getElementById("signup-otp-input-5");
      lastInput?.focus();
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
  }

  async function handlePasswordSignup(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      // 1. Call server API to create pre-confirmed user (0 email sent)
      const res = await fetch("/api/auth/register-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pwEmail,
          password,
          fullName,
          username,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatus("error");
        setError(json.error || "Failed to create account. Please try again.");
        return;
      }

      // 2. Instantly sign in user with password (no email confirmation needed)
      const supabase = createClient();
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: pwEmail,
        password,
      });

      if (signInErr) {
        setStatus("error");
        setError(signInErr.message);
        return;
      }

      // 3. Instant redirect to Dashboard!
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Failed to register account.");
    }
  }

  if (status === "sent") {
    const activeEmail = mode === "quick" ? email : pwEmail;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="surface border border-border rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative z-10 animate-fade-up">
          <div className="size-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mx-auto shadow-inner">
            <KeyRound className="size-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-bold text-primary">Enter Verification Code</h2>
            <p className="text-xs text-secondary leading-relaxed">
              We sent a 6-digit OTP code & confirmation link to <br />
              <span className="font-semibold text-primary">{activeEmail}</span>
            </p>
          </div>

          {/* 6-DIGIT OTP INPUT FORM */}
          <form onSubmit={handleVerifyOtpCode} className="space-y-5">
            <div className="flex items-center justify-center gap-2" onPaste={handleOtpPaste}>
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`signup-otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="size-12 surface-2 border border-border focus:border-orange-500 text-center font-mono font-extrabold text-lg rounded-xl text-primary outline-none transition-all shadow-xs focus:ring-2 focus:ring-orange-500/20"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {otpError}
              </p>
            )}

            <button
              type="submit"
              disabled={otpSubmitting || otpCode.join("").length < 6}
              className="w-full bg-orange-500 hover:brightness-110 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all text-xs flex items-center justify-center gap-2"
            >
              {otpSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="size-4" /> Verify &amp; Activate Account
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-secondary">
            <button
              type="button"
              onClick={(e) => {
                setOtpCode(["", "", "", "", "", ""]);
                if (mode === "quick") handleOtp(e);
                else handlePasswordSignup(e);
              }}
              className="font-semibold text-orange-500 hover:underline"
            >
              Resend OTP Code
            </button>

            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setOtpCode(["", "", "", "", "", ""]);
              }}
              className="font-semibold text-secondary hover:text-primary transition-colors"
            >
              ← Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[450px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-up">
        {/* BRAND LOGO HEADER */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo size="lg" href="/" />
          <p className="text-xs font-semibold text-secondary">
            The AI Career Operating System for Campus Placements
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="surface border border-border rounded-3xl p-7 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="font-display text-2xl font-bold text-primary">Create Your Account</h1>
              <p className="text-xs text-secondary">Free to start — get your ATS score in 60 seconds</p>
            </div>

            {/* MODE SELECTOR TABS */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 surface-2 border border-border rounded-2xl">
              <button
                type="button"
                onClick={() => setMode("quick")}
                className={`text-xs font-extrabold py-2.5 rounded-xl transition-all ${
                  mode === "quick"
                    ? "bg-orange-500 text-white shadow-md scale-[1.01]"
                    : "text-secondary hover:text-primary"
                }`}
              >
                ⚡ Magic Link
              </button>
              <button
                type="button"
                onClick={() => setMode("password")}
                className={`text-xs font-extrabold py-2.5 rounded-xl transition-all ${
                  mode === "password"
                    ? "bg-orange-500 text-white shadow-md scale-[1.01]"
                    : "text-secondary hover:text-primary"
                }`}
              >
                🔒 Password
              </button>
            </div>
          </div>

          {mode === "quick" ? (
            <div className="space-y-4">
              <button
                onClick={handleGoogle}
                type="button"
                className="w-full surface-2 border border-border hover:border-orange-500/40 text-primary font-bold text-xs py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
              >
                <GoogleIcon /> Continue with Google
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 border-b border-border" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">or sign up with magic link</span>
                <div className="h-px flex-1 border-b border-border" />
              </div>

              <form onSubmit={handleOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-secondary flex items-center gap-1.5">
                    <Mail className="size-3.5 text-orange-500" /> College / Work Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@college.edu"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full surface-2 border border-border focus:border-orange-500 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-muted outline-none transition-all"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-orange-500 hover:brightness-110 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all text-xs flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="size-4" /> Send Signup Magic Link
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handlePasswordSignup} className="space-y-3.5">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-bold text-secondary flex items-center gap-1.5">
                  <User className="size-3.5 text-orange-500" /> Full Name
                </label>
                <input
                  id="fullName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Rahul Sharma"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full surface-2 border border-border focus:border-orange-500 rounded-2xl px-4 py-2.5 text-sm text-primary placeholder:text-muted outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="username" className="text-xs font-bold text-secondary flex items-center gap-1.5">
                  <AtSign className="size-3.5 text-orange-500" /> Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="rahul_sharma"
                  required
                  pattern="[a-zA-Z0-9_]{3,20}"
                  title="3-20 characters: letters, numbers, underscores"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full surface-2 border border-border focus:border-orange-500 rounded-2xl px-4 py-2.5 text-sm text-primary placeholder:text-muted outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pwEmail" className="text-xs font-bold text-secondary flex items-center gap-1.5">
                  <Mail className="size-3.5 text-orange-500" /> Email Address
                </label>
                <input
                  id="pwEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@college.edu"
                  required
                  value={pwEmail}
                  onChange={(e) => setPwEmail(e.target.value)}
                  className="w-full surface-2 border border-border focus:border-orange-500 rounded-2xl px-4 py-2.5 text-sm text-primary placeholder:text-muted outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold text-secondary flex items-center gap-1.5">
                  <Lock className="size-3.5 text-orange-500" /> Password (8+ chars)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full surface-2 border border-border focus:border-orange-500 rounded-2xl px-4 py-2.5 text-sm text-primary placeholder:text-muted outline-none transition-all"
                />
              </div>

              {status === "error" && (
                <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-orange-500 hover:brightness-110 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all text-xs flex items-center justify-center gap-2 mt-2"
              >
                {status === "submitting" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="size-4" /> Create Account
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-border text-center">
            <p className="text-xs text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="font-extrabold text-orange-500 hover:underline inline-flex items-center gap-0.5">
                Sign in <ArrowRight className="size-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
