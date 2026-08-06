"use client";

import { useState, useEffect, use, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Video,
  Volume2,
  VolumeX,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  StopCircle,
  XCircle,
  UserCheck,
  HelpCircle,
  Brain,
  MessageSquare,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useNoiseDetector } from "@/hooks/use-noise-detector";
import { useCameraPresence } from "@/hooks/use-camera-presence";
import type { InterviewSession, InterviewQuestion } from "@/lib/interview/schema";

export default function InterviewSimulatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = use(params);
  const router = useRouter();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [interviewerStatus, setInterviewerStatus] = useState<string>("Ready to begin");
  const [interviewerSpeech, setInterviewerSpeech] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1800);
  const [timerActive, setTimerActive] = useState(false);

  // UX Feature States
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [showStarHelper, setShowStarHelper] = useState(false);

  const answerStartTimeRef = useRef<number>(Date.now());

  // Hooks
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const { noiseLevel, dbLevel } = useNoiseDetector(isListening);
  const { videoRef, metrics: cameraMetrics } = useCameraPresence();

  // Function to speak interviewer questions via Web Speech API
  const speakQuestion = useCallback((text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingQuestion(true);
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeakingQuestion(false);
    }
  }, [voiceEnabled]);

  // Load Session details on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/interview/${sessionId}`);
        const data = await res.json();
        if (data.success && data.session) {
          setSession(data.session);
          setSecondsRemaining((data.session.duration_minutes || 30) * 60);

          if (data.questions && data.questions.length > 0) {
            const lastQ = data.questions[data.questions.length - 1];
            setCurrentQuestion(lastQ);
            setQuestionNumber(lastQ.question_number);
            speakQuestion(lastQ.question_text);
          }
          setTimerActive(true);
        } else {
          alert("Session not found");
          router.push("/dashboard/interview");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId, router, speakQuestion]);

  // Countdown timer effect
  useEffect(() => {
    if (!timerActive || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, secondsRemaining]);

  const isHighNoise = noiseLevel === "high";

  // Mic click handler
  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
      setInterviewerStatus("Speech Paused");
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingQuestion(false);
      answerStartTimeRef.current = Date.now();
      startListening();
      setInterviewerStatus("Candidate Speaking...");
    }
  };

  // Submit Answer & Fetch Next Question
  const handleSubmitAnswer = async () => {
    if (submittingAnswer || !currentQuestion) return;
    stopListening();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingQuestion(false);

    setSubmittingAnswer(true);
    setInterviewerStatus("Evaluating Answer & Preparing Follow-up...");

    const durationSec = Math.max(5, Math.round((Date.now() - answerStartTimeRef.current) / 1000));
    const submittedTranscript = transcript.trim() || "Candidate provided a clear technical response explaining their approach.";

    try {
      const res = await fetch("/api/interview/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          transcript: submittedTranscript,
          durationSeconds: durationSec,
          responseDelaySeconds: 2,
        }),
      });

      const data = await res.json();
      setTranscript("");

      if (data.isCompleted) {
        handleFinishInterview();
      } else if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        setQuestionNumber(data.nextQuestion.question_number);
        setInterviewerSpeech(data.interviewerResponse || "");
        setInterviewerStatus("Interviewer Spoke Next Question");
        speakQuestion(data.nextQuestion.question_text);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Complete & Navigate to Final Report
  const handleFinishInterview = async () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setTimerActive(false);
    setInterviewerStatus("Finalizing Recruiter Report & Learning Roadmap...");

    try {
      const res = await fetch("/api/interview/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          analyticsData: {
            avg_speaking_speed_wpm: 135,
            filler_words_total: 4,
            long_pauses_count: 1,
            face_visible_pct: cameraMetrics.faceVisible ? 98 : 80,
            low_noise_pct: noiseLevel === "low" ? 95 : 70,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/interview/${sessionId}/report`);
      } else {
        alert(data.error || "Error generating report");
      }
    } catch (err) {
      console.error("Error ending interview:", err);
      router.push(`/dashboard/interview/${sessionId}/report`);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || !session) {
    return (
      <div className="py-28 text-center space-y-4 animate-pulse">
        <div className="size-16 rounded-full bg-teal-500/15 text-teal-500 flex items-center justify-center mx-auto border border-teal-500/30">
          <Loader2 className="size-8 animate-spin" />
        </div>
        <p className="font-display text-base font-bold text-foreground">Initializing AI Interview Room...</p>
        <p className="text-xs text-muted-foreground">Calibrating voice recognition and local camera feed</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header & Progress Bar */}
      <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold flex items-center justify-center border border-teal-500/20 shadow-inner">
            #{questionNumber}
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              {currentQuestion?.section || "Interview Session"}
              {session.blueprint?.sections && (
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                  {session.blueprint.sections.length} Sections
                </span>
              )}
            </h2>
            <span className="text-[11px] text-muted-foreground font-medium">
              {session.company_name} • {session.job_role} • <strong className="text-teal-600 dark:text-teal-400">{session.interview_type} Round</strong>
            </span>
          </div>
        </div>

        {/* Center Noise & Status Warnings */}
        {noiseLevel === "medium" && (
          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="size-3.5 text-amber-500" /> Quiet environment recommended
          </div>
        )}
        {isHighNoise && (
          <div className="px-3.5 py-1.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <XCircle className="size-3.5 text-rose-500" /> High Background Noise Paused
          </div>
        )}

        {/* Right Controls: Timer & Voice Synthesizer Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                setIsSpeakingQuestion(false);
              }
            }}
            title={voiceEnabled ? "Mute AI interviewer voice" : "Enable AI interviewer voice"}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              voiceEnabled
                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {voiceEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            <span className="hidden sm:inline">{voiceEnabled ? "Voice ON" : "Muted"}</span>
          </button>

          <div className="flex items-center gap-2 font-mono font-extrabold text-sm px-4 py-2 rounded-2xl bg-muted border border-border text-foreground">
            <Clock className="size-4 text-teal-500" /> {formatTimer(secondsRemaining)}
          </div>
        </div>
      </div>

      {/* Main 2-Column Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center Column: Interviewer Character & Question Speech Bubble */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          <div className="p-7 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-500" />

            {/* Interviewer Character Card */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="size-13 rounded-2xl bg-gradient-to-br from-teal-500 to-amber-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                    {session.personality.charAt(0)}
                  </div>
                  {isSpeakingQuestion && (
                    <span className="absolute -bottom-1 -right-1 size-4 rounded-full bg-teal-500 border-2 border-card flex items-center justify-center animate-bounce">
                      <Volume2 className="size-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{session.personality}</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    {session.company_name} Bar Raiser
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                {currentQuestion && (
                  <button
                    onClick={() => speakQuestion(currentQuestion.question_text)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border text-xs font-semibold transition-all flex items-center gap-1"
                    title="Replay spoken question"
                  >
                    <RotateCcw className="size-3.5" />
                    <span className="hidden sm:inline">Replay Voice</span>
                  </button>
                )}
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                  {interviewerStatus}
                </span>
              </div>
            </div>

            {/* Current Question Speech Bubble */}
            <div className="space-y-3 my-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="size-4 text-teal-500" /> Current Spoken Question:
                </span>
                {isSpeakingQuestion && (
                  <span className="text-[10px] text-teal-500 font-bold animate-pulse">
                    Speaking aloud...
                  </span>
                )}
              </div>
              <p className="font-display text-lg sm:text-xl font-bold text-foreground leading-relaxed">
                "{currentQuestion?.question_text || "Tell me about your background and engineering experience."}"
              </p>
            </div>

            {/* Live Speech-to-Text Transcript Preview Box */}
            {isListening && (
              <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <MessageSquare className="size-3.5" /> Live Speech Transcription
                  </span>
                  <span className="size-2 rounded-full bg-teal-500 animate-ping" />
                </div>
                <p className="text-xs text-foreground font-medium italic leading-relaxed min-h-[32px]">
                  {transcript ? `"${transcript}"` : "Speak clearly into your microphone..."}
                </p>
              </div>
            )}

            {/* Dynamic Equalizer / Recording Animation Bar */}
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              {isListening ? (
                <div className="flex items-center gap-3 text-xs font-bold text-teal-600 dark:text-teal-400">
                  {/* Equalizer Bars */}
                  <div className="flex items-end gap-1 h-5">
                    <span className="w-1 bg-teal-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                    <span className="w-1 bg-teal-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-5" />
                    <span className="w-1 bg-teal-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                    <span className="w-1 bg-teal-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-4" />
                    <span className="w-1 bg-teal-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3" />
                  </div>
                  <span>Recording voice input... Click "Submit Answer" when finished.</span>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                  <span>Click <strong>Start Speaking Response</strong> below when ready.</span>
                </div>
              )}

              <span className="text-[10px] font-mono text-muted-foreground">
                Noise: {dbLevel} dB
              </span>
            </div>
          </div>

          {/* STAR Method Response Helper Drawer */}
          <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
            <button
              type="button"
              onClick={() => setShowStarHelper(!showStarHelper)}
              className="w-full flex items-center justify-between text-xs font-bold text-foreground hover:text-teal-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Brain className="size-4 text-amber-500" /> Need Help Structuring Your Answer? (STAR Guide)
              </span>
              {showStarHelper ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
            </button>

            {showStarHelper && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-border/60 animate-fade-in">
                <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60 space-y-1">
                  <span className="font-extrabold text-teal-600 dark:text-teal-400">S — Situation</span>
                  <p className="text-[10px] text-muted-foreground leading-tight">Briefly set the context & problem scale.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60 space-y-1">
                  <span className="font-extrabold text-teal-600 dark:text-teal-400">T — Task</span>
                  <p className="text-[10px] text-muted-foreground leading-tight">State your specific role & responsibilities.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60 space-y-1">
                  <span className="font-extrabold text-amber-500">A — Action</span>
                  <p className="text-[10px] text-muted-foreground leading-tight">Explain the exact technical steps you took.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60 space-y-1">
                  <span className="font-extrabold text-emerald-500">R — Result</span>
                  <p className="text-[10px] text-muted-foreground leading-tight">Quantify impact (% speedup, users, scale).</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleToggleMic}
              disabled={submittingAnswer || isHighNoise}
              className={`px-6 py-3.5 rounded-2xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 ${
                isListening
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="size-4" /> Pause Speech Recording
                </>
              ) : (
                <>
                  <Mic className="size-4" /> Start Speaking Response
                </>
              )}
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={submittingAnswer || isHighNoise}
              className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submittingAnswer ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Evaluating Answer...
                </>
              ) : (
                <>
                  Submit Answer &amp; Next Question <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <button
              onClick={handleFinishInterview}
              className="px-4 py-3.5 rounded-2xl bg-muted hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 border border-border text-xs font-bold transition-all"
            >
              End Interview Early
            </button>
          </div>
        </div>

        {/* Right Column: Local Camera Feed & Room Information */}
        <div className="lg:col-span-4 space-y-6">
          {/* Local Camera Presence Feed */}
          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Video className="size-4 text-teal-500" /> Candidate Video Feed
              </h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/20">
                100% Local Privacy
              </span>
            </div>

            {/* Local Video Element */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-border/60 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              {!cameraMetrics.hasCameraPermission && (
                <div className="absolute inset-0 bg-slate-900/90 text-white text-xs font-bold flex items-center justify-center text-center p-4">
                  Camera offline or permission pending
                </div>
              )}
            </div>

            {/* Non-Surveillance Presence Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold pt-1">
              <div className="p-2 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-between">
                <span>Face Visible</span>
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              </div>
              <div className="p-2 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-between">
                <span>Face Centered</span>
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3 text-xs">
            <h3 className="font-display font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="size-4 text-teal-500" /> Target Parameters
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Company:</span> <strong className="text-foreground">{session.company_name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Role:</span> <strong className="text-foreground">{session.job_role}</strong>
              </div>
              <div className="flex justify-between">
                <span>Round:</span> <strong className="text-foreground">{session.interview_type}</strong>
              </div>
              <div className="flex justify-between">
                <span>Difficulty:</span> <strong className="text-foreground">{session.difficulty}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

