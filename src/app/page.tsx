import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/score-ring";
import {
  FileText,
  Building2,
  Code2,
  ArrowRight,
  Upload,
  Target,
  Trophy,
} from "lucide-react";

const subScores = [
  { label: "ATS", value: 91 },
  { label: "Recruiter", value: 84 },
  { label: "HR Readability", value: 88 },
];

const pillars = [
  {
    icon: FileText,
    title: "Resume Intelligence",
    body: "Upload once. Get a scored, section-by-section breakdown and AI-rewritten bullet points tuned for the ATS systems Indian recruiters actually use.",
  },
  {
    icon: Building2,
    title: "Company Intelligence",
    body: "Real hiring-process breakdowns, required skills, and prep roadmaps for the companies actually recruiting on Indian campuses this season.",
  },
  {
    icon: Code2,
    title: "DSA Prep, Mapped to Companies",
    body: "Practice the topics each company is known to emphasize, not a generic question dump — tied directly to the companies you're targeting.",
  },
];

const steps = [
  { icon: Upload, title: "Upload your resume", body: "PDF or DOCX, under a minute." },
  { icon: Target, title: "Pick your target companies", body: "We map what each one actually looks for." },
  { icon: Trophy, title: "Follow your roadmap", body: "Resume fixes, DSA topics, and company prep in one place." },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Nav */}
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-navy-900">
            CareerOS
          </span>
          <nav className="hidden sm:flex items-center gap-8 text-sm text-slate-600">
            <a href="#how-it-works" className="hover:text-navy-900">How it works</a>
            <a href="#pillars" className="hover:text-navy-900">What you get</a>
          </nav>
          <Button asChild size="sm" variant="primary">
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-teal-700 uppercase mb-4">
            Built for campus placement season
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-navy-900 leading-[1.05] mb-6">
            Know exactly what stands between you and the offer.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-md">
            CareerOS scores your resume, maps what each target company
            actually looks for, and builds your prep roadmap — one AI-native
            platform instead of five disconnected tools.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="primary">
              <Link href="/signup">
                Analyze my resume <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
        </div>

        {/* Signature visual: live-feeling score card */}
        <div className="flex justify-center md:justify-end">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-slate-500">Your Resume Score</span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-50 text-teal-700">
                Updated now
              </span>
            </div>
            <div className="flex justify-center mb-6">
              <ScoreRing score={87} size={148} />
            </div>
            <div className="space-y-3">
              {subScores.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-32">{s.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-navy-800"
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 w-8 text-right">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem stats */}
      <section className="bg-navy-900 text-white py-16">
        <div className="mx-auto max-w-6xl px-6 grid sm:grid-cols-2 gap-10">
          <div>
            <p className="font-display text-5xl font-semibold text-teal-400 mb-2">1.5M</p>
            <p className="text-slate-300 max-w-xs">
              engineering graduates enter the Indian job market every year.
            </p>
          </div>
          <div>
            <p className="font-display text-5xl font-semibold text-amber-400 mb-2">83%</p>
            <p className="text-slate-300 max-w-xs">
              graduate without a role or internship matched to their skills.
              Preparation, not talent, is usually the gap.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-navy-900 mb-12 text-center">
          Three steps. One roadmap.
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="mx-auto mb-4 size-14 rounded-full bg-teal-50 flex items-center justify-center">
                <s.icon className="size-6 text-teal-700" />
              </div>
              <p className="font-semibold text-navy-900 mb-1">{s.title}</p>
              <p className="text-sm text-slate-500">{s.body}</p>
              {i < steps.length - 1 && (
                <div className="hidden sm:block h-px bg-slate-200 mt-8" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-semibold text-navy-900 mb-12 text-center">
            What you get today
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="size-11 rounded-full bg-teal-50 flex items-center justify-center mb-5">
                  <p.icon className="size-5 text-teal-700" />
                </div>
                <p className="font-semibold text-navy-900 mb-2">{p.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold text-navy-900 mb-4">
          Start with your resume. It takes a minute.
        </h2>
        <p className="text-slate-500 mb-8">Free to try. No credit card needed.</p>
        <Button asChild size="lg" variant="primary">
          <Link href="/signup">
            Get my resume score <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-6xl px-6 text-sm text-slate-400">
          CareerOS
        </div>
      </footer>
    </div>
  );
}
