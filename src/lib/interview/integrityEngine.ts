export type SecurityEventType =
  | "FACE_NOT_VISIBLE"
  | "MULTIPLE_FACES"
  | "FACE_OFF_CENTER"
  | "LIGHTING_POOR"
  | "AUDIO_HIGH_NOISE"
  | "EYES_OCCLUDED"
  | "FACE_PARTIALLY_OCCLUDED";

export interface SecurityEvent {
  type: SecurityEventType;
  startedAt: number; // Unix timestamp ms
  durationMs: number;
  confidence: number;
  metadata?: Record<string, any>;
}

export type EyeVisibilityState = "VISIBLE" | "PARTIAL" | "OCCLUDED" | "UNKNOWN";
export type FaceVisibilityState = "GOOD" | "PARTIAL" | "POOR" | "UNKNOWN";

export interface VisionFrameData {
  faceDetected: boolean;
  faceCount: number;
  faceVisibilityScore: number; // 0.0 to 1.0
  faceVisibilityState: FaceVisibilityState;
  leftEyeScore: number; // 0.0 to 1.0
  leftEyeState: EyeVisibilityState;
  rightEyeScore: number; // 0.0 to 1.0
  rightEyeState: EyeVisibilityState;
  bothEyesVisible: boolean;
  centerX: number; // 0 to 1 (0.5 is centered)
  centerY: number; // 0 to 1
  brightness: number; // 0 to 255
  lightingStatus: "good" | "too_dark" | "too_bright";
}

/**
 * Client-Side Integrity & Event Management Engine:
 * Performs temporal smoothing over a 2-second sliding window to avoid false positives (e.g. blinks),
 * buffers events locally in memory, and flushes batched JSON logs to the server.
 */
export class IntegrityEngine {
  private sessionId: string;
  private eventBuffer: SecurityEvent[] = [];
  private activeStateStartTimes: Map<SecurityEventType, number | null> = new Map();
  private flushIntervalId: any = null;

  // Temporal Threshold (2000ms persistence required to log event - ignores normal blinks)
  private readonly PERSISTENCE_THRESHOLD_MS = 2000;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.startAutoFlush();
  }

  /**
   * Evaluates a single local vision frame (sampled at 5-10 FPS)
   */
  public processFrame(data: VisionFrameData) {
    const now = Date.now();

    // 1. Check Face Visibility & Presence
    if (!data.faceDetected || data.faceCount === 0) {
      this.handleConditionTrigger("FACE_NOT_VISIBLE", true, now);
    } else {
      this.handleConditionTrigger("FACE_NOT_VISIBLE", false, now);
    }

    // 2. Check Persistent Eye Occlusion (ignores normal 100-400ms blinks)
    if (data.faceDetected && (!data.bothEyesVisible || data.leftEyeState === "OCCLUDED" || data.rightEyeState === "OCCLUDED")) {
      this.handleConditionTrigger("EYES_OCCLUDED", true, now);
    } else {
      this.handleConditionTrigger("EYES_OCCLUDED", false, now);
    }

    // 3. Check Face Partial Occlusion
    if (data.faceDetected && (data.faceVisibilityState === "PARTIAL" || data.faceVisibilityState === "POOR")) {
      this.handleConditionTrigger("FACE_PARTIALLY_OCCLUDED", true, now);
    } else {
      this.handleConditionTrigger("FACE_PARTIALLY_OCCLUDED", false, now);
    }

    // 4. Check Multiple Faces
    if (data.faceCount > 1) {
      this.handleConditionTrigger("MULTIPLE_FACES", true, now);
    } else {
      this.handleConditionTrigger("MULTIPLE_FACES", false, now);
    }

    // 5. Check Off Center
    const isOffCenter = data.centerX < 0.2 || data.centerX > 0.8 || data.centerY < 0.15 || data.centerY > 0.85;
    if (data.faceDetected && isOffCenter) {
      this.handleConditionTrigger("FACE_OFF_CENTER", true, now);
    } else {
      this.handleConditionTrigger("FACE_OFF_CENTER", false, now);
    }

    // 6. Check Lighting
    if (data.lightingStatus !== "good") {
      this.handleConditionTrigger("LIGHTING_POOR", true, now);
    } else {
      this.handleConditionTrigger("LIGHTING_POOR", false, now);
    }
  }

  private handleConditionTrigger(eventType: SecurityEventType, isTriggered: boolean, now: number) {
    const startTime = this.activeStateStartTimes.get(eventType);

    if (isTriggered) {
      if (!startTime) {
        this.activeStateStartTimes.set(eventType, now);
      }
    } else {
      if (startTime) {
        const duration = now - startTime;
        if (duration >= this.PERSISTENCE_THRESHOLD_MS) {
          // Log persistent event
          this.eventBuffer.push({
            type: eventType,
            startedAt: startTime,
            durationMs: duration,
            confidence: 0.91,
          });
        }
        this.activeStateStartTimes.set(eventType, null);
      }
    }
  }

  /**
   * Starts periodic batch flushing to the server every 20 seconds
   */
  private startAutoFlush() {
    if (typeof window === "undefined") return;
    this.flushIntervalId = setInterval(() => {
      this.flushEvents();
    }, 20000);
  }

  /**
   * Sends buffered security events to backend API
   */
  public async flushEvents() {
    if (this.eventBuffer.length === 0) return;

    const eventsToUpload = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await fetch("/api/interview/security-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events: eventsToUpload,
        }),
      });
    } catch (err) {
      // Re-queue un-flushed events on network failure
      this.eventBuffer = [...eventsToUpload, ...this.eventBuffer];
    }
  }

  public destroy() {
    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId);
    }
    this.flushEvents();
  }
}
