"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CharacterAvatar, CharacterMood } from "./character-avatar";
import { StoryStage } from "./story-stage";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface StepConfig {
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  mood: CharacterMood;
  bullets: string[];
}

const STEPS: StepConfig[] = [
  {
    number: 1,
    title: "Low Written Resume & Rejected ATS Score",
    subtitle: "Step 01 — Diagnosis",
    badge: "The Problem",
    description:
      "Most student resumes get screened out automatically by ATS algorithms due to missing keywords, poor formatting, and unquantified bullets.",
    mood: "worried",
    bullets: [
      "ATS Score sitting below 40",
      "Generic bullet points with zero metrics",
      "Rejected before a human recruiter reads it",
    ],
  },
  {
    number: 2,
    title: "AI Overhaul to 85+ Green ATS Score",
    subtitle: "Step 02 — Optimization",
    badge: "Instant Upgrade",
    description:
      "CareerOS analyzes your draft against real hiring benchmarks, restructuring action verbs and injecting missing skills to guarantee top-tier screening.",
    mood: "happy",
    bullets: [
      "Targeted ATS Score boost (85+)",
      "Quantified bullet point rewrites",
      "Formatted to pass enterprise ATS scanners",
    ],
  },
  {
    number: 3,
    title: "Pick & Research Target Companies",
    subtitle: "Step 03 — Intelligence",
    badge: "Company Alignment",
    description:
      "Understand exact hiring pipelines, eligibility criteria, and interview round structures for verified Tier-1 & Product companies.",
    mood: "curious",
    bullets: [
      "Deep-dive hiring process breakdown",
      "Core competencies & required tech stacks",
      "Compensation & role expectations",
    ],
  },
  {
    number: 4,
    title: "Targeted DSA & PYQ Prep",
    subtitle: "Step 04 — Practice",
    badge: "Smart Roadmap",
    description:
      "Don't waste time solving random questions. Practice topic-wise DSA questions and Past-Year-Questions specifically prioritized by your targeted companies.",
    mood: "coding",
    bullets: [
      "Company-weighted topic emphasis",
      "Curated Previous Year Questions (PYQs)",
      "Structured solution approaches & pseudocode",
    ],
  },
  {
    number: 5,
    title: "Join Projects & Internship Hub",
    subtitle: "Step 05 — Real Work",
    badge: "1-6 Months Internship",
    description:
      "Join production software teams building real sellable SaaS products. Gain verified 1–6 month internships, certificates, LORs, and 5% equal revenue sharing on project sales.",
    mood: "working",
    bullets: [
      "Real-world SaaS project development",
      "Verified Internship Certificate & LOR",
      "5% Equal Revenue Sharing on product sales",
    ],
  },
  {
    number: 6,
    title: "Application Command Center & Placement Offers!",
    subtitle: "Step 06 — Victory",
    badge: "Offers & Community",
    description:
      "Track all your project applications in real time. Get instant offer letters, 1-on-1 interview scheduling, private Discord group access, and constructive feedback to land your dream role.",
    mood: "celebrating",
    bullets: [
      "Instant PDF Internship Offer Letters & Discord Group Access",
      "Team Leader 1-on-1 interview scheduling",
      "Detailed candidate feedback & skill growth recommendations",
    ],
  },
];

export function ScrollyContainer() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight = window.innerHeight;

      stepRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= pageHeight * 0.5 && rect.bottom >= pageHeight * 0.2) {
          setActiveStep(index + 1);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentStep = STEPS[activeStep - 1] || STEPS[0];

  return (
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-12">
      {/* Header section introducing the signature 6-step flow */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full surface border border-orange-500/30 text-orange-500">
          <Sparkles className="size-3.5" /> Interactive 6-Step Roadmap
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-primary leading-tight">
          How You Go From <span className="text-orange-500">Unprepared</span> To{" "}
          <span className="text-teal-400">Placed</span>
        </h2>
        <p className="text-sm sm:text-base text-secondary">
          Scroll down to watch your journey unfold step-by-step with our AI assistant.
        </p>
      </div>

      {/* Main layout: Sticky visuals on right, Scrolling text triggers on left */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
        {/* Left Column: 6 Scroll Trigger Cards */}
        <div className="lg:col-span-6 space-y-24 py-8">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === step.number;
            return (
              <div
                key={step.number}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className={`transition-all duration-500 rounded-3xl p-6 sm:p-8 border ${
                  isActive
                    ? "surface border-orange-500/50 shadow-xl shadow-orange-500/5 scale-[1.02]"
                    : "surface-2 border-border opacity-50 blur-[0.3px]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                      {step.subtitle}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-surface-2 text-muted"
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-primary">
                    {step.title}
                  </h3>

                  <p className="text-sm text-secondary leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-2 space-y-2">
                    {step.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-secondary">
                        <CheckCircle2 className="size-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Button CTA on final step */}
                  {step.number === 6 && (
                    <div className="pt-4">
                      <Button asChild size="lg" variant="primary" className="w-full sm:w-auto">
                        <Link href="/signup">
                          Start Your Placement Journey <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Character & Story Visual Stage */}
        <div className="lg:col-span-6 sticky top-24 z-20 space-y-6">
          {/* Top Character Avatar Header */}
          <div className="surface border border-border rounded-3xl p-6 flex items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">
                Interactive Assistant
              </span>
              <h4 className="font-display text-lg font-bold text-primary">
                {activeStep === 1 && "Uh oh, ATS Rejection..."}
                {activeStep === 2 && "Score Boosted to 85+!"}
                {activeStep === 3 && "Analyzing Target Companies"}
                {activeStep === 4 && "Mastering High-Impact DSA"}
                {activeStep === 5 && "Joining Internship Hub"}
                {activeStep === 6 && "Offer Letter & Group Access!"}
              </h4>
              <p className="text-xs text-muted">
                Step {activeStep} of 6 • Active Phase
              </p>
            </div>

            <CharacterAvatar mood={currentStep.mood} className="w-28 h-28 shrink-0" />
          </div>

          {/* Interactive Graphic Stage */}
          <StoryStage step={activeStep} />
        </div>
      </div>
    </div>
  );
}
