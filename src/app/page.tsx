import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/score-ring";
import { ScrollyContainer } from "@/components/scrollytelling/scrolly-container";
import {
  FileText,
  Building2,
  Code2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Rocket,
  Award,
  DollarSign,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const subScores = [
  { label: "ATS",            value: 91 },
  { label: "Recruiter",      value: 84 },
  { label: "HR Readability", value: 88 },
];

const pillars = [
  {
    icon: FileText,
    title: "Resume Intelligence",
    body: "Upload once. Get a scored, section-by-section breakdown and AI-rewritten bullet points tuned for the ATS systems Indian recruiters actually use.",
    accent: "var(--orange)",
    accentDim: "var(--orange-glow)",
  },
  {
    icon: Building2,
    title: "Company Intelligence",
    body: "Real hiring-process breakdowns, required skills, and prep roadmaps for the companies actually recruiting on Indian campuses this season.",
    accent: "var(--teal)",
    accentDim: "var(--teal-dim)",
  },
  {
    icon: Code2,
    title: "DSA Prep, Mapped to Companies",
    body: "Practice the topics each company is known to emphasize, not a generic question dump — tied directly to the companies you're targeting.",
    accent: "var(--amber)",
    accentDim: "var(--amber-dim)",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-40 glass"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <BrandLogo href="/" />
          <nav className="hidden sm:flex items-center gap-8 text-sm" style={{ color: "var(--text-secondary)" }}>
            <a href="#scrollytelling" className="hover:opacity-80 transition-opacity">6-Step Story</a>
            <a href="#projects" className="hover:opacity-80 transition-opacity">Internship Hub</a>
            <a href="#pillars" className="hover:opacity-80 transition-opacity">What you get</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              Log in
            </Link>
            <Button asChild size="sm" variant="primary">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase rounded-full px-3.5 py-1.5 mb-6"
            style={{
              background: "var(--orange-glow)",
              border: "1px solid rgba(249,115,22,0.25)",
              color: "var(--orange)",
            }}
          >
            <Sparkles className="size-3.5" />
            Built for campus placement season
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] mb-6" style={{ color: "var(--text-primary)" }}>
            Know exactly what stands between you and the{" "}
            <span style={{ color: "var(--orange)" }}>offer.</span>
          </h1>
          <p className="text-base sm:text-lg mb-8 max-w-md leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            CareerOS scores your resume, maps what each target company actually looks for,
            and builds your prep roadmap — one AI-native platform instead of five disconnected tools.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="primary">
              <Link href="/signup">
                Analyse my resume <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#scrollytelling">Explore 6-Step Story</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-2">
              {["A","B","C","D"].map((l) => (
                <div
                  key={l}
                  className="size-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                  style={{
                    background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
                    borderColor: "var(--bg-base)",
                    color: "#fff",
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Join students prepping for top placement offers
            </p>
          </div>
        </div>

        {/* ── Hero visual: score card ── */}
        <div className="flex justify-center md:justify-end animate-float">
          <div
            className="rounded-3xl p-7 w-full max-w-sm"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              boxShadow: "var(--shadow-lg), 0 0 60px rgba(249,115,22,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Your Resume Score
              </span>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "var(--orange-glow)", color: "var(--orange)", border: "1px solid rgba(249,115,22,0.2)" }}
              >
                ✦ Live AI
              </span>
            </div>
            <div className="flex justify-center mb-5">
              <ScoreRing score={87} size={148} />
            </div>
            <div className="space-y-3">
              {subScores.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs w-28 shrink-0" style={{ color: "var(--text-muted)" }}>
                    {s.label}
                  </span>
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-surface-2)" }}
                  >
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${s.value}%`,
                        background: "linear-gradient(90deg, var(--orange), #fb923c)",
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right" style={{ color: "var(--text-primary)" }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Floating tag */}
            <div
              className="mt-5 flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
            >
              <TrendingUp className="size-4" style={{ color: "var(--teal)" }} />
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                ATS score improved by <strong style={{ color: "var(--teal)" }}>+23 pts</strong> after rewrite
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Signature Scrollytelling Section (Phase 1) ── */}
      <section id="scrollytelling" className="border-t border-b border-border py-12" style={{ background: "var(--bg-surface)" }}>
        <ScrollyContainer />
      </section>

      {/* ── PROJECTS & INTERNSHIP HUB FEATURE SHOWCASE ── */}
      <section id="projects" className="mx-auto max-w-6xl px-6 py-12">
        <div className="surface border border-orange-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-surface to-surface">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
                <Rocket className="size-3.5 text-orange-500" /> SaaS Project Cohorts
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                Build Real SaaS Products. Earn <span className="text-orange-400">1-6 Months Internships & 5% Revenue Share.</span>
              </h2>

              <p className="text-sm text-secondary leading-relaxed">
                Join production software engineering teams. Get verified Internship Certificates, LORs, PDF Offer Letters, Discord group access, and 5% equal revenue sharing on completed software sales.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-primary">
                <div className="surface-2 p-3 rounded-2xl border border-border flex items-center gap-2">
                  <Award className="size-4 text-teal-400 shrink-0" />
                  <span>Verified Cert & LOR</span>
                </div>
                <div className="surface-2 p-3 rounded-2xl border border-border flex items-center gap-2">
                  <DollarSign className="size-4 text-orange-500 shrink-0" />
                  <span>5% Revenue Sharing</span>
                </div>
                <div className="surface-2 p-3 rounded-2xl border border-border flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
                  <span>Offer Letter PDF</span>
                </div>
                <div className="surface-2 p-3 rounded-2xl border border-border flex items-center gap-2">
                  <Trophy className="size-4 text-amber-400 shrink-0" />
                  <span>Badge Vault & Ranks</span>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild size="lg" variant="primary">
                  <Link href="/dashboard/projects">
                    Explore Projects & Internships <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual Right Preview Card */}
            <div className="surface-2 p-6 rounded-3xl border border-orange-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  94% Skill Match
                </span>
                <span className="text-xs font-bold text-orange-400 font-mono">₹15,000 / mo</span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-primary">Autonomous Code Refactoring Agent</h3>
                <p className="text-xs text-muted">3 Months Track · 15 hrs/week · Next.js & OpenAI</p>
              </div>

              <div className="surface p-4 rounded-2xl border border-border space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-primary">Application Status</span>
                  <span className="text-teal-400">Offer Letter Ready 🎉</span>
                </div>
                <p className="text-[11px] text-secondary">
                  Selected for Frontend Domain Team. Discord channel and PDF offer letter generated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH JOBS SWIPE DECK FEATURE SHOWCASE ── */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="surface border border-teal-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden bg-gradient-to-br from-teal-500/10 via-surface to-surface">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">

            {/* Left Visual Interactive Card Mockup */}
            <div className="surface-2 p-6 rounded-3xl border border-teal-500/30 space-y-4 shadow-xl order-2 md:order-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  🔥 CareerSwipe Deck
                </span>
                <span className="text-xs font-extrabold text-teal-400 font-mono">92% Match Score</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-primary">Senior Full-Stack Engineer</h3>
                <p className="text-xs text-muted">Google India · Remote / Bengaluru · ₹28 - ₹42 LPA</p>
              </div>

              <div className="surface p-4 rounded-2xl border border-border space-y-2 text-xs">
                <div className="flex justify-between font-bold text-primary">
                  <span>Match Breakdown</span>
                  <span className="text-teal-400">ATS Resume Verified</span>
                </div>
                <p className="text-[11px] text-secondary">
                  Skills matched: Next.js, Node.js, System Design, PostgreSQL. 2 Missing skills highlighted with 1-click learning roadmap.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold text-center">
                  ✕ Pass
                </div>
                <div className="flex-1 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold text-center">
                  ♥ Apply Now
                </div>
              </div>
            </div>

            <div className="space-y-4 order-1 md:order-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-teal-400 bg-teal-500/15 border border-teal-500/30">
                <Building2 className="size-3.5 text-teal-500" /> New Feature: Real-World Tech Jobs Deck
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                Swipe Through <span className="text-teal-400">30+ Real Tech Roles</span> with Live Match Scores.
              </h2>

              <p className="text-sm text-secondary leading-relaxed">
                Explore tech roles from top companies using our interactive job deck. Instantly see your ATS Resume Match Score, salary benchmarks, and skill gap insights before applying.
              </p>

              <div className="pt-2">
                <Button asChild size="lg" variant="primary">
                  <Link href="/dashboard/jobs">
                    Explore Job Swipe Deck <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── AI MOCK INTERVIEW ENGINE FEATURE SHOWCASE ── */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="surface border border-purple-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-surface to-surface">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-purple-400 bg-purple-500/15 border border-purple-500/30">
                <Sparkles className="size-3.5 text-purple-400" /> New Feature: AI Mock Interview Simulator
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                Practice Voice Interviews with <span className="text-purple-400">FAANG Bar-Raiser AI.</span>
              </h2>

              <p className="text-sm text-secondary leading-relaxed">
                Voice-first realtime mock interviews calibrated by Gemini. Choose from 5 interviewer personalities (Strict FAANG Lead, HR Recruiter, Startup Founder) and receive an executive report card with strict grading.
              </p>

              <div className="pt-2">
                <Button asChild size="lg" variant="primary">
                  <Link href="/dashboard/interview">
                    Start Voice AI Interview <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual Right Preview Card */}
            <div className="surface-2 p-6 rounded-3xl border border-purple-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  🎙️ Voice Realtime Active
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">100% Privacy</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-primary">Senior FAANG Engineering Manager</h3>
                <p className="text-xs text-muted">Target Company: Google · Technical System Architecture</p>
              </div>

              <div className="surface p-4 rounded-2xl border border-border space-y-2 text-xs">
                <div className="flex justify-between font-bold text-primary">
                  <span>Recruiter Report Card</span>
                  <span className="text-orange-400 font-mono">Strict Bar-Raiser Score</span>
                </div>
                <p className="text-[11px] text-secondary">
                  Scores clarity, technical depth, and Big-O complexities. Generates personalized learning roadmap steps.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Pillars / What you get ── */}
      <section id="pillars" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--orange)" }}>
            What&apos;s inside
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Everything you need, nothing you don&apos;t.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ...pillars,
            {
              icon: Building2,
              title: "Tech Jobs CareerSwipe Deck",
              body: "Swipe through 30+ verified tech roles with instant ATS skill match % and gap analysis.",
              accent: "var(--teal)",
              accentDim: "var(--teal-dim)",
            },
            {
              icon: Sparkles,
              title: "AI Voice Mock Interview",
              body: "Realtime voice interview simulator with 5 interviewer personalities and strict bar-raiser report cards.",
              accent: "#a855f7",
              accentDim: "rgba(168, 85, 247, 0.15)",
            },
            {
              icon: Rocket,
              title: "SaaS Project Internships",
              body: "Build production software in teams. Earn verified certificates, LORs, offer letters, and 5% revenue share.",
              accent: "var(--orange)",
              accentDim: "var(--orange-glow)",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded-3xl p-7 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 surface border border-border"
            >
              <div
                className="size-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: p.accentDim }}
              >
                <p.icon className="size-6" style={{ color: p.accent }} />
              </div>
              <p className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{p.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Start with your resume.{" "}
          <span style={{ color: "var(--orange)" }}>It takes under a minute.</span>
        </h2>
        <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
          Free to try for placement preparation.
        </p>
        <Button asChild size="lg" variant="primary">
          <Link href="/signup">
            Get my resume score <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between text-sm" style={{ color: "var(--text-muted)" }}>
          <span>
            Career<span style={{ color: "var(--orange)" }}>OS</span>
          </span>
          <span>Built for India&apos;s campus placement season.</span>
        </div>
      </footer>
    </div>
  );
}
