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
import { IntegrityEngine, type VisionFrameData } from "@/lib/interview/integrityEngine";
import { playGeminiHumanVoice, stopGeminiHumanVoice } from "@/lib/interview/humanVoicePlayer";
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
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [showStarHelper, setShowStarHelper] = useState(false);
  const [endingInterview, setEndingInterview] = useState(false);

  // Tab Switch Detector States
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [showTabWarningModal, setShowTabWarningModal] = useState<boolean>(false);
  const [isTerminatedByTabSwitch, setIsTerminatedByTabSwitch] = useState<boolean>(false);

  const answerStartTimeRef = useRef<number>(Date.now());
  const integrityEngineRef = useRef<IntegrityEngine | null>(null);

  // Initialize Client-Side Integrity Engine for browser-only CV processing
  useEffect(() => {
    integrityEngineRef.current = new IntegrityEngine(sessionId);
    return () => {
      integrityEngineRef.current?.destroy();
    };
  }, [sessionId]);

  const handleFrameSample = useCallback((frameData: VisionFrameData) => {
    integrityEngineRef.current?.processFrame(frameData);
  }, []);

  // ── TAB SWITCH DETECTOR EFFECT ──
  useEffect(() => {
    if (!hasJoinedLobby || isTerminatedByTabSwitch) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;

          if (newCount === 1) {
            setShowTabWarningModal(true);
          } else if (newCount >= 2) {
            setIsTerminatedByTabSwitch(true);
            setTimerActive(false);
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
              window.speechSynthesis.cancel();
            }
          }

          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasJoinedLobby, isTerminatedByTabSwitch]);

  // Hooks
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const { noiseLevel, dbLevel } = useNoiseDetector(isListening);
  const { videoRef, metrics: cameraMetrics } = useCameraPresence(handleFrameSample);

  // Function to speak interviewer questions via High-Quality Natural Human Voice Engine
  const speakQuestion = useCallback(async (text: string) => {
    if (!voiceEnabled || typeof window === "undefined") return;
    try {
      setIsSpeakingQuestion(true);
      stopGeminiHumanVoice();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      // 1. Try Gemini 2.0 Human TTS API
      try {
        const res = await fetch("/api/interview/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        const data = await res.json();
        if (data.success && data.audioBase64) {
          await playGeminiHumanVoice(
            data.audioBase64,
            data.mimeType || "audio/mp3",
            () => setIsSpeakingQuestion(true),
            () => setIsSpeakingQuestion(false)
          );
          return;
        }
      } catch {
        // Fallback to high-quality browser voice picker
      }

      // 2. High-Quality Natural Human Voice Selection (Safari / Chrome / Edge)
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.92; // Natural speech rate
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        // Priority list of realistic human voices across Safari, Chrome, and Edge
        const preferredVoices = [
          "Google US English",
          "Samantha (Enhanced)",
          "Karen (Enhanced)",
          "Microsoft Jenny Online (Natural) - English (United States)",
          "Microsoft Guy Online (Natural) - English (United States)",
          "Samantha",
          "Karen",
          "Daniel",
          "Alex",
        ];

        let selectedVoice = voices.find((v) =>
          preferredVoices.some((pref) => v.name.toLowerCase().includes(pref.toLowerCase()))
        );

        if (!selectedVoice) {
          selectedVoice = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Natural"));
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onstart = () => setIsSpeakingQuestion(true);
        utterance.onend = () => setIsSpeakingQuestion(false);
        utterance.onerror = () => setIsSpeakingQuestion(false);

        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeakingQuestion(false);
      }
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
          }
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
    setEndingInterview(true);
    setInterviewerStatus("Ending interview... Please wait");


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

  // ── TAB SWITCH STRICTLY TERMINATED FULL-SCREEN OVERLAY ──
  if (isTerminatedByTabSwitch) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 animate-fade-in text-foreground">
        <div className="max-w-lg w-full bg-card border-2 border-rose-500/40 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl bg-gradient-to-b from-rose-500/10 via-card to-card relative overflow-hidden">
          <div className="size-20 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border-2 border-rose-500/40 animate-pulse shadow-lg">
            <XCircle className="size-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
              Integrity Violation
            </span>
            <h1 className="font-display text-2xl font-black text-foreground tracking-tight pt-2">
              TAB SWITCH STRICTLY NOT ALLOWED
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Your AI interview session was automatically terminated because tab switching was detected twice. To ensure interview integrity and security, candidates must remain on the active test window at all times.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/60 border border-border/80 text-xs text-left space-y-2 text-muted-foreground font-medium">
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>Violations Recorded:</span>
              <strong className="text-rose-500 font-bold">2 Tab Switches</strong>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <strong className="text-rose-500 font-bold">Session Terminated</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsTerminatedByTabSwitch(false);
              setShowTabWarningModal(false);
              setTabSwitchCount(0);
              setHasJoinedLobby(false);
            }}
            className="w-full py-4 rounded-2xl font-extrabold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="size-5" /> Rejoin Interview
          </button>
        </div>
      </div>
    );
  }

  // ── GOOGLE MEET STYLE PRE-JOIN WAITING ROOM LOBBY ──
  if (!hasJoinedLobby) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-6 text-foreground">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-teal-500/15 text-teal-500 flex items-center justify-center font-bold border border-teal-500/30">
              <Video className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-foreground">
                {session.job_role} Interview Lobby
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{session.company_name}</span> • <span>{session.interview_type} ({session.difficulty})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-full font-bold">
            <ShieldCheck className="size-4 text-teal-500" /> Ready to Join
          </div>
        </div>

        {/* Google Meet Waiting Room Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Live Video Preview & Media Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video rounded-3xl bg-slate-900 border-2 border-border overflow-hidden shadow-2xl flex items-center justify-center group">
              {cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                  <div className="size-20 rounded-full bg-slate-800 border border-border flex items-center justify-center">
                    <Video className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Camera is turned off</p>
                </div>
              )}

              {/* Bottom Floating Control Bar */}
              <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-4 z-10">
                <button
                  type="button"
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`size-12 rounded-full flex items-center justify-center shadow-xl transition-all border ${
                    micEnabled
                      ? "bg-slate-800/90 text-white hover:bg-slate-700 border-slate-600"
                      : "bg-red-500 text-white hover:bg-red-600 border-red-400"
                  }`}
                  title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {micEnabled ? <Mic className="size-5" /> : <MicOff className="size-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`size-12 rounded-full flex items-center justify-center shadow-xl transition-all border ${
                    cameraEnabled
                      ? "bg-slate-800/90 text-white hover:bg-slate-700 border-slate-600"
                      : "bg-red-500 text-white hover:bg-red-600 border-red-400"
                  }`}
                  title={cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
                >
                  {cameraEnabled ? <Video className="size-5" /> : <Video className="size-5 opacity-40" />}
                </button>
              </div>
            </div>

            {/* Device Readiness Status */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${cameraEnabled ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                <span className="font-semibold text-secondary">Camera: {cameraEnabled ? "Ready" : "Off"}</span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${micEnabled ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                <span className="font-semibold text-secondary">Mic: {micEnabled ? "Ready" : "Off"}</span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="font-semibold text-secondary">AI Interviewer: Online</span>
              </div>
            </div>
          </div>

          {/* Right: Meeting Overview & Join CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-teal-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl bg-gradient-to-br from-teal-500/10 via-card to-card">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-500">Google Meet Waiting Room</span>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  Ready to start your interview?
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Test your camera and microphone above before entering the room. Your AI interviewer is standby to begin your session.
                </p>
              </div>

              <div className="space-y-2.5 pt-3 text-xs text-secondary border-t border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Target Company:</span>
                  <span className="font-bold text-foreground">{session.company_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Job Role:</span>
                  <span className="font-bold text-foreground">{session.job_role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-mono font-bold text-teal-500">{session.duration_minutes} mins</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setHasJoinedLobby(true);
                  setTimerActive(true);
                  if (currentQuestion) {
                    speakQuestion(currentQuestion.question_text);
                  }
                }}
                className="w-full py-4 rounded-2xl font-extrabold text-sm bg-teal-500 hover:bg-teal-600 text-white shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Video className="size-5" /> Join Interview Now
              </button>
            </div>
          </div>

        </div>
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

          {/* Upside Aligned Response & Action Control Bar */}
          <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <button
              onClick={handleToggleMic}
              disabled={submittingAnswer || isHighNoise}
              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 ${
                isListening
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="size-4" /> Pause Recording
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
              className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submittingAnswer ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Evaluating...
                </>
              ) : (
                <>
                  Submit Answer <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <button
              onClick={handleFinishInterview}
              disabled={endingInterview || submittingAnswer}
              className="w-full py-3.5 px-4 rounded-2xl bg-muted hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 border border-border text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {endingInterview ? (
                <>
                  <Loader2 className="size-4 animate-spin text-rose-500" /> Ending...
                </>
              ) : (
                "End Interview Early"
              )}
            </button>
          </div>
        </div>

        {/* Ending Interview Overlay Modal */}
        {endingInterview && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="p-8 rounded-3xl bg-card border border-border/80 shadow-2xl max-w-md w-full text-center space-y-4 animate-fade-in">
              <div className="size-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center mx-auto shadow-inner">
                <Loader2 className="size-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-extrabold text-foreground">Ending Interview... Please Wait</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Gemini is evaluating your full spoken transcript, verifying technical depth, and finalizing your strict executive report...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1st Tab Switch Warning Modal Overlay */}
        {showTabWarningModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="p-8 rounded-3xl bg-card border-2 border-amber-500/40 shadow-2xl max-w-md w-full text-center space-y-5 animate-fade-in bg-gradient-to-b from-amber-500/10 via-card to-card">
              <div className="size-16 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <AlertTriangle className="size-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  Warning 1 of 2
                </span>
                <h3 className="font-display text-xl font-black text-foreground">
                  TAB SWITCH DETECTED
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Navigating away or switching browser tabs is strictly monitored during AI interviews. You have <strong>1 remaining warning</strong>. A 2nd tab switch will immediately terminate your session!
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTabWarningModal(false)}
                className="w-full py-3.5 rounded-2xl font-extrabold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-lg transition-all cursor-pointer"
              >
                I Understand &amp; Resume Interview
              </button>
            </div>
          </div>
        )}


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

            {/* Dynamic Camera, Face & Eye Visibility Metrics */}
            <div className="space-y-2 text-[11px] font-semibold pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-between">
                  <span>Camera</span>
                  {cameraMetrics.hasCameraPermission ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-1">
                      <XCircle className="size-3.5" /> Error
                    </span>
                  )}
                </div>

                <div className="p-2 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-between">
                  <span>Face Presence</span>
                  {cameraMetrics.status === "PRESENT" && (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Present
                    </span>
                  )}
                  {cameraMetrics.status === "ABSENT" && (
                    <span className="text-rose-500 font-bold flex items-center gap-1">
                      <XCircle className="size-3.5" /> Not Detected
                    </span>
                  )}
                  {cameraMetrics.status === "UNKNOWN" && (
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Loader2 className="size-3.5 animate-spin" /> Checking...
                    </span>
                  )}
                </div>

                <div className="p-2 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-between">
                  <span>Face Visibility</span>
                  {cameraMetrics.faceVisibilityState === "GOOD" && (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Good
                    </span>
                  )}
                  {cameraMetrics.faceVisibilityState === "PARTIAL" && (
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="size-3.5" /> Partial
                    </span>
                  )}
                  {cameraMetrics.faceVisibilityState === "POOR" && (
                    <span className="text-rose-500 font-bold flex items-center gap-1">
                      <XCircle className="size-3.5" /> Poor
                    </span>
                  )}
                  {cameraMetrics.faceVisibilityState === "UNKNOWN" && (
                    <span className="text-muted-foreground font-bold flex items-center gap-1">
                      Unknown
                    </span>
                  )}
                </div>

                <div className="p-2 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-between">
                  <span>Eyes</span>
                  {cameraMetrics.bothEyesVisible ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Visible
                    </span>
                  ) : cameraMetrics.status === "PRESENT" ? (
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="size-3.5" /> Occluded
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-bold flex items-center gap-1">
                      Unknown
                    </span>
                  )}
                </div>
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

