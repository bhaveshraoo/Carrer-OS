"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, CheckCircle2, KeyRound } from "lucide-react";

type Mode = "quick" | "password";
type Status = "idle" | "submitting" | "sent" | "error";

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("quick");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // Quick signup (email OTP) state
  const [email, setEmail] = useState("");

  // Password signup state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [password, setPassword] = useState("");

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

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: pwEmail,
      password,
      options: {
        data: { full_name: fullName, username },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (signUpError) {
      setStatus("error");
      // Postgres unique_violation on the username column surfaces here as a generic
      // message from PostgREST — pattern-match it so the error is actually useful.
      if (signUpError.message.toLowerCase().includes("duplicate") || signUpError.message.includes("23505")) {
        setError("That username is already taken — try another one.");
      } else {
        setError(signUpError.message);
      }
      return;
    }

    // If email confirmations are off in your Supabase project, signUp returns a live
    // session immediately. If they're on, there's no session yet — user needs to click
    // the confirmation link first, same as the OTP flow below.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center text-center gap-3 py-10">
            <CheckCircle2 className="size-10 text-teal-600" />
            <p className="font-medium text-navy-900">Check your email</p>
            <p className="text-sm text-slate-500">
              We sent a confirmation link to {mode === "quick" ? email : pwEmail}. Click it to continue.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="font-display text-2xl font-semibold text-navy-900 mb-2">
            CareerOS
          </Link>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Free to start — get your resume score in a minute.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("quick")}
              className={`text-sm font-medium py-1.5 rounded-md transition-colors ${
                mode === "quick" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Quick signup
            </button>
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`text-sm font-medium py-1.5 rounded-md transition-colors ${
                mode === "password" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Password
            </button>
          </div>

          {mode === "quick" ? (
            <>
              <Button variant="outline" className="w-full" onClick={handleGoogle} type="button">
                Continue with Google
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <form onSubmit={handleOtp} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@college.edu"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {status === "error" && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" variant="primary" className="w-full" disabled={status === "submitting"}>
                  <Mail className="size-4" />
                  {status === "submitting" ? "Sending..." : "Continue with email"}
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handlePasswordSignup} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  required
                  pattern="[a-zA-Z0-9_]{3,20}"
                  title="3-20 characters: letters, numbers, underscores"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwEmail">Email</Label>
                <Input
                  id="pwEmail"
                  type="email"
                  required
                  value={pwEmail}
                  onChange={(e) => setPwEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {status === "error" && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" variant="primary" className="w-full" disabled={status === "submitting"}>
                <KeyRound className="size-4" />
                {status === "submitting" ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="text-teal-700 hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
