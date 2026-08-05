"use client";

import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Fuel, Navigation, CheckCircle2, AlertCircle, Sparkles, Terminal, Layers } from "lucide-react";

export interface PetrolPump {
  id: number;
  petrol: number;
  distance: number;
}

export interface CircularStep {
  stepIndex: number;
  line: number;
  codeSnippet: string;
  currPump: number;
  startPump: number;
  currPetrol: number;
  deficit: number;
  tankGauge: number;
  status: "idle" | "inspecting" | "fail" | "advance" | "success";
  explanation: string;
}

const SAMPLE_PUMPS: PetrolPump[] = [
  { id: 0, petrol: 4, distance: 6 },
  { id: 1, petrol: 6, distance: 5 },
  { id: 2, petrol: 7, distance: 3 },
  { id: 3, petrol: 4, distance: 5 },
];

const CODE_LINES = [
  "function tour(petrol, distance) {",
  "  let start = 0, curr_petrol = 0, deficit = 0;",
  "  for (let i = 0; i < petrol.length; i++) {",
  "    curr_petrol += petrol[i] - distance[i];",
  "    if (curr_petrol < 0) {",
  "      deficit += curr_petrol;",
  "      start = i + 1;",
  "      curr_petrol = 0;",
  "    }",
  "  }",
  "  return (curr_petrol + deficit >= 0) ? start : -1;",
  "}"
];

const ANIMATION_STEPS: CircularStep[] = [
  {
    stepIndex: 0,
    line: 2,
    codeSnippet: "let start = 0, curr_petrol = 0, deficit = 0;",
    currPump: 0,
    startPump: 0,
    currPetrol: 0,
    deficit: 0,
    tankGauge: 0,
    status: "idle",
    explanation: "🚀 Initialize pointers: start = 0, curr_petrol = 0, deficit = 0. Truck prepares at Pump 0.",
  },
  {
    stepIndex: 1,
    line: 4,
    codeSnippet: "curr_petrol += petrol[0] - distance[0]; // 4 - 6 = -2",
    currPump: 0,
    startPump: 0,
    currPetrol: -2,
    deficit: 0,
    tankGauge: -2,
    status: "inspecting",
    explanation: "⛽ Inspecting Pump 0: Gains 4 petrol, but distance to Pump 1 is 6. Net fuel change = 4 - 6 = -2.",
  },
  {
    stepIndex: 2,
    line: 5,
    codeSnippet: "if (curr_petrol < 0) { // -2 < 0 -> FAILED TO REACH PUMP 1!",
    currPump: 0,
    startPump: 0,
    currPetrol: -2,
    deficit: 0,
    tankGauge: -2,
    status: "fail",
    explanation: "⚠️ Tank dropped below zero (-2)! Truck ran out of petrol before reaching Pump 1. Any start pump from 0 to 0 is invalid.",
  },
  {
    stepIndex: 3,
    line: 6,
    codeSnippet: "deficit += curr_petrol; start = 1; curr_petrol = 0;",
    currPump: 0,
    startPump: 1,
    currPetrol: 0,
    deficit: -2,
    tankGauge: 0,
    status: "advance",
    explanation: "🔄 Accumulate deficit (-2). Reset curr_petrol to 0 and shift start pointer to Pump 1.",
  },
  {
    stepIndex: 4,
    line: 4,
    codeSnippet: "curr_petrol += petrol[1] - distance[1]; // 6 - 5 = +1",
    currPump: 1,
    startPump: 1,
    currPetrol: 1,
    deficit: -2,
    tankGauge: 1,
    status: "inspecting",
    explanation: "⛽ Inspecting Pump 1: Gains 6 petrol, distance to Pump 2 is 5. Net fuel change = +1. Tank balance is now 1.",
  },
  {
    stepIndex: 5,
    line: 4,
    codeSnippet: "curr_petrol += petrol[2] - distance[2]; // 1 + (7 - 3) = +5",
    currPump: 2,
    startPump: 1,
    currPetrol: 5,
    deficit: -2,
    tankGauge: 5,
    status: "inspecting",
    explanation: "⛽ Inspecting Pump 2: Gains 7 petrol, distance to Pump 3 is 3. Net fuel change = +4. Tank balance grows to 5!",
  },
  {
    stepIndex: 6,
    line: 4,
    codeSnippet: "curr_petrol += petrol[3] - distance[3]; // 5 + (4 - 5) = +4",
    currPump: 3,
    startPump: 1,
    currPetrol: 4,
    deficit: -2,
    tankGauge: 4,
    status: "inspecting",
    explanation: "⛽ Inspecting Pump 3: Gains 4 petrol, distance to finish loop is 5. Net fuel change = -1. Tank balance becomes 4.",
  },
  {
    stepIndex: 7,
    line: 11,
    codeSnippet: "return (curr_petrol + deficit >= 0) ? start : -1; // 4 + (-2) = 2 >= 0",
    currPump: 1,
    startPump: 1,
    currPetrol: 4,
    deficit: -2,
    tankGauge: 4,
    status: "success",
    explanation: "🎉 TOUR COMPLETED! Remaining petrol (4) + accumulated deficit (-2) = 2 >= 0. Valid starting petrol pump is Index 1!",
  },
];

export function CircularTourVisualizer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.2); // seconds per step

  const currentStep = ANIMATION_STEPS[stepIndex];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= ANIMATION_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed * 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const handleNext = () => {
    if (stepIndex < ANIMATION_STEPS.length - 1) setStepIndex(stepIndex + 1);
  };

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  return (
    <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-up bg-gradient-to-b from-surface via-surface to-orange-500/5">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-extrabold mb-1">
            <Sparkles className="size-3.5 text-orange-500" /> CareerOS 10x Interactive Visual Engine
          </div>
          <h2 className="font-display text-2xl font-extrabold text-primary flex items-center gap-2.5">
            <Fuel className="size-6 text-orange-500" /> Circular Tour (Petrol Pump Problem) Visualizer
          </h2>
        </div>

        {/* Step Counter Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold text-orange-400 bg-orange-500/15 px-3 py-1.5 rounded-xl border border-orange-500/30">
            Step {stepIndex + 1} / {ANIMATION_STEPS.length}
          </span>
        </div>
      </div>

      {/* ── MAIN VISUAL CANVAS & CODE SPLIT GRID ── */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: CIRCULAR PUMP CANVAS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Circular Petrol Pump Ring Container */}
          <div className="surface-2 border border-border rounded-3xl p-6 relative min-h-[360px] flex items-center justify-center overflow-hidden shadow-inner">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-teal-500/5 pointer-events-none" />

            {/* Central Tank Gauge Meter */}
            <div className="absolute size-36 sm:size-40 rounded-full border-2 border-dashed border-orange-500/30 flex flex-col items-center justify-center p-3 text-center bg-black/40 backdrop-blur-md shadow-2xl z-10">
              <Fuel className="size-6 text-orange-400 mb-1 animate-pulse" />
              <p className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Truck Fuel Tank</p>
              <p className={`font-mono text-xl font-extrabold ${currentStep.tankGauge < 0 ? "text-rose-400" : "text-teal-400"}`}>
                {currentStep.tankGauge} Units
              </p>
              <p className="text-[10px] font-bold text-amber-400 mt-1">
                Deficit: {currentStep.deficit}
              </p>
            </div>

            {/* 4 Circular Pump Nodes Arranged in Ring */}
            <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
              {SAMPLE_PUMPS.map((pump, idx) => {
                // Arrange 4 pumps at Top, Right, Bottom, Left (0deg, 90deg, 180deg, 270deg)
                const angles = [-90, 0, 90, 180];
                const angleRad = (angles[idx] * Math.PI) / 180;
                const radius = 120; // px
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                const isCurrent = currentStep.currPump === pump.id;
                const isStart = currentStep.startPump === pump.id;
                const net = pump.petrol - pump.distance;

                return (
                  <div
                    key={pump.id}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className={`absolute size-20 sm:size-24 rounded-2xl p-2.5 border-2 transition-all duration-500 flex flex-col justify-between shadow-xl ${
                      isCurrent
                        ? "bg-orange-500/20 border-orange-500 scale-110 shadow-orange-500/40 ring-4 ring-orange-500/20 z-20"
                        : isStart
                        ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30 z-10"
                        : "bg-surface border-border opacity-85 hover:opacity-100"
                    }`}
                  >
                    {/* Pump Header & Pointer Badges */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold font-mono text-primary flex items-center gap-1">
                        P{pump.id}
                      </span>

                      <div className="flex items-center gap-1">
                        {isStart && (
                          <span className="text-[9px] font-extrabold bg-amber-500 text-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-sm animate-bounce">
                            START
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[9px] font-extrabold bg-orange-500 text-white px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-sm">
                            🚚 TRUCK
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Petrol vs Distance Metrics */}
                    <div className="space-y-0.5 text-[10px] font-mono leading-tight">
                      <p className="text-teal-400 font-bold">⛽ Gas: {pump.petrol}</p>
                      <p className="text-secondary font-bold">🏁 Dist: {pump.distance}</p>
                    </div>

                    {/* Net Fuel Tag */}
                    <div className="text-[9px] font-bold font-mono text-right">
                      <span className={net >= 0 ? "text-teal-400" : "text-rose-400"}>
                        Net: {net >= 0 ? `+${net}` : net}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Variable Inspector Panel */}
          <div className="surface-2 border border-border rounded-2xl p-4 space-y-2">
            <p className="text-xs font-extrabold text-muted uppercase tracking-wider flex items-center gap-2">
              <Layers className="size-3.5 text-orange-400" /> Real-Time Variable Inspector
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="surface p-2.5 rounded-xl border border-border">
                <span className="text-muted block text-[10px] uppercase">start</span>
                <span className="text-amber-400 font-extrabold text-sm">{currentStep.startPump}</span>
              </div>

              <div className="surface p-2.5 rounded-xl border border-border">
                <span className="text-muted block text-[10px] uppercase">curr_petrol</span>
                <span className={`font-extrabold text-sm ${currentStep.currPetrol < 0 ? "text-rose-400" : "text-teal-400"}`}>
                  {currentStep.currPetrol}
                </span>
              </div>

              <div className="surface p-2.5 rounded-xl border border-border">
                <span className="text-muted block text-[10px] uppercase">deficit</span>
                <span className="text-purple-400 font-extrabold text-sm">{currentStep.deficit}</span>
              </div>

              <div className="surface p-2.5 rounded-xl border border-border">
                <span className="text-muted block text-[10px] uppercase">inspecting</span>
                <span className="text-orange-400 font-extrabold text-sm">Pump {currentStep.currPump}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: SYNCHRONIZED CODE & SOCRATIC LOG (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Synchronized Code View */}
          <div className="surface-2 border border-border rounded-2xl p-4 space-y-2">
            <p className="text-xs font-extrabold text-muted uppercase tracking-wider flex items-center gap-2">
              <Terminal className="size-3.5 text-orange-400" /> Code Line Synchronizer
            </p>

            <div className="surface border border-border rounded-xl p-3 font-mono text-xs leading-relaxed space-y-1 overflow-x-auto bg-[#09090b]">
              {CODE_LINES.map((lineText, idx) => {
                const lineNum = idx + 1;
                const isHighlight = currentStep.line === lineNum;

                return (
                  <div
                    key={idx}
                    className={`px-2 py-0.5 rounded transition-all flex items-center gap-2 ${
                      isHighlight
                        ? "bg-orange-500/25 text-orange-300 font-bold border-l-2 border-orange-500"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="text-[10px] text-muted w-4 select-none">{lineNum}</span>
                    <span className="whitespace-pre">{lineText}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Socratic Step Explanation Box */}
          <div className={`p-5 rounded-2xl border space-y-2 transition-all duration-300 shadow-lg ${
            currentStep.status === "fail"
              ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
              : currentStep.status === "success"
              ? "border-teal-500/40 bg-teal-500/10 text-teal-200"
              : "border-orange-500/30 bg-orange-500/10 text-orange-200"
          }`}>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
              {currentStep.status === "fail" ? (
                <AlertCircle className="size-4 text-rose-400" />
              ) : currentStep.status === "success" ? (
                <CheckCircle2 className="size-4 text-teal-400" />
              ) : (
                <Sparkles className="size-4 text-orange-400" />
              )}
              <span>Step Insights</span>
            </div>

            <p className="text-xs leading-relaxed font-sans font-medium text-primary">
              {currentStep.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* ── PLAYBACK CONTROL TOOLBAR ── */}
      <div className="surface-2 border border-border p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Play, Pause, Step Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl surface border border-border hover:border-orange-500/40 text-secondary hover:text-primary transition-all"
            title="Reset Animation"
          >
            <RotateCcw className="size-4" />
          </button>

          <button
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="p-2.5 rounded-xl surface border border-border hover:border-orange-500/40 text-secondary hover:text-primary transition-all disabled:opacity-40"
            title="Previous Step"
          >
            <SkipBack className="size-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-extrabold text-xs shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
            <span>{isPlaying ? "Pause" : "Play Animation"}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={stepIndex === ANIMATION_STEPS.length - 1}
            className="p-2.5 rounded-xl surface border border-border hover:border-orange-500/40 text-secondary hover:text-primary transition-all disabled:opacity-40"
            title="Next Step"
          >
            <SkipForward className="size-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted uppercase">Speed:</span>
          <div className="flex items-center gap-1 surface p-1 rounded-xl border border-border">
            {[0.8, 1.2, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  speed === s
                    ? "bg-orange-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
              >
                {s === 0.8 ? "1.5x" : s === 1.2 ? "1.0x" : "0.5x"}
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress Bar Slider */}
        <div className="w-full sm:w-48 flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={ANIMATION_STEPS.length - 1}
            value={stepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setStepIndex(Number(e.target.value));
            }}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
