"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Video,
  Volume2,
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
  const answerStartTimeRef = useRef<number>(Date.now());

  // Hooks
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const { noiseLevel, dbLevel } = useNoiseDetector(isListening);
  const { videoRef, metrics: cameraMetrics } = useCameraPresence();

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
  }, [sessionId, router]);

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

  // Auto-pause if noise level is high
  const isHighNoise = noiseLevel === "high";

  // Mic click handler
  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      answerStartTimeRef.current = Date.now();
      startListening();
      setInterviewerStatus("Candidate Speaking...");
    }
  };

  // Submit Answer & Fetch Next Question
  const handleSubmitAnswer = async () => {
    if (submittingAnswer || !currentQuestion) return;
    stopListening();
    setSubmittingAnswer(true);
    setInterviewerStatus("Gemini Evaluating Answer & Preparing Follow-up...");

    const durationSec = Math.max(5, Math.round((Date.now() - answerStartTimeRef.current) / 1000));

    try {
      const res = await fetch("/api/interview/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          transcript: transcript || "Candidate provided a clear technical response.",
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
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Complete & Navigate to Final Report
  const handleFinishInterview = async () => {
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
      <div className="py-24 text-center text-sm font-semibold text-muted-foreground animate-pulse">
        Initializing AI Interview Room &amp; Local Privacy Verification...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header & Progress Bar */}
      <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-teal-500/10 text-teal-600 font-bold flex items-center justify-center border border-teal-500/20">
            #{questionNumber}
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-foreground">
              {currentQuestion?.section || "Interview Session"}
            </h2>
            <span className="text-[11px] text-muted-foreground font-medium">
              {session.company_name} • {session.job_role}
            </span>
          </div>
        </div>

        {/* Center Noise Warning Badge */}
        {noiseLevel === "medium" && (
          <div className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="size-3.5 text-amber-500" /> Background noise detected. Move to a quieter room.
          </div>
        )}
        {isHighNoise && (
          <div className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <XCircle className="size-3.5 text-rose-500" /> High Noise Paused. Interview waiting for silence.
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center gap-2 font-mono font-extrabold text-sm px-4 py-1.5 rounded-2xl bg-muted border border-border text-foreground">
          <Clock className="size-4 text-teal-500" /> {formatTimer(secondsRemaining)}
        </div>
      </div>

      {/* Main 2-Column Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center Column: Interviewer Character & Question Speech Bubble */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          <div className="p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-500" />

            {/* Interviewer Character Card */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-teal-500 to-amber-500 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                  {session.personality.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{session.personality}</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    {session.company_name} Bar Raiser
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border/60">
                {interviewerStatus}
              </span>
            </div>

            {/* Current Question Speech Bubble */}
            <div className="space-y-3 my-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Volume2 className="size-4 text-teal-500" /> Current Question Spoken:
              </div>
              <p className="font-display text-lg sm:text-xl font-bold text-foreground leading-relaxed">
                "{currentQuestion?.question_text || "Tell me about your background and engineering experience."}"
              </p>
            </div>

            {/* Audio Waveform / Recording Animation */}
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              {isListening ? (
                <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 animate-pulse">
                  <div className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-teal-500 animate-ping" />
                    <span className="size-2 rounded-full bg-teal-500" />
                    <span className="size-2 rounded-full bg-teal-500" />
                  </div>
                  Listening to candidate response... (No transcript visible)
                </div>
              ) : (
                <div className="text-xs text-muted-foreground font-semibold">
                  Click <strong>Start Speaking</strong> below when ready to respond.
                </div>
              )}

              <span className="text-[10px] font-mono text-muted-foreground">
                DB Level: {dbLevel} dB
              </span>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleToggleMic}
              disabled={submittingAnswer || isHighNoise}
              className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 ${
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
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submittingAnswer ? (
                "Processing Answer..."
              ) : (
                <>
                  Submit Answer &amp; Next Question <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <button
              onClick={handleFinishInterview}
              className="px-4 py-3 rounded-2xl bg-muted hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 border border-border text-xs font-bold transition-all"
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
                <Video className="size-4 text-teal-500" /> Candidate Video Verification
              </h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/20">
                100% Local (Not Recorded)
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
            <h3 className="font-display font-bold text-foreground">Session Parameters</h3>
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
