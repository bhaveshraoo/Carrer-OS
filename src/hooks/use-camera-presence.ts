"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  VisionFrameData,
  EyeVisibilityState,
  FaceVisibilityState,
} from "@/lib/interview/integrityEngine";

export type FacePresenceStatus = "PRESENT" | "ABSENT" | "UNKNOWN";

export interface CameraPresenceMetrics {
  status: FacePresenceStatus;
  faceVisible: boolean;
  faceCentered: boolean;
  lookingAway: boolean;
  multipleFaces: boolean;
  hasCameraPermission: boolean;
  lightingQuality: "good" | "too_dark" | "too_bright";
  brightness: number;
  frameCount: number;
  lastFrameAgeMs: number;
  videoWidth: number;
  videoHeight: number;
  videoReadyState: number;
  isPlaying: boolean;

  // ── EYE & FACIAL OCCLUSION METRICS ──
  faceVisibilityState: FaceVisibilityState;
  faceVisibilityScore: number; // 0.0 to 1.0
  leftEyeState: EyeVisibilityState;
  leftEyeScore: number; // 0.0 to 1.0
  rightEyeState: EyeVisibilityState;
  rightEyeScore: number; // 0.0 to 1.0
  bothEyesVisible: boolean;
  headTilted: boolean;
}

export function useCameraPresence(onFrameSample?: (data: VisionFrameData) => void) {
  const [metrics, setMetrics] = useState<CameraPresenceMetrics>({
    status: "UNKNOWN",
    faceVisible: false,
    faceCentered: false,
    lookingAway: false,
    multipleFaces: false,
    hasCameraPermission: false,
    lightingQuality: "good",
    brightness: 128,
    frameCount: 0,
    lastFrameAgeMs: 0,
    videoWidth: 0,
    videoHeight: 0,
    videoReadyState: 0,
    isPlaying: false,

    // Initial Eye & Occlusion states
    faceVisibilityState: "UNKNOWN",
    faceVisibilityScore: 0.0,
    leftEyeState: "UNKNOWN",
    leftEyeScore: 0.0,
    rightEyeState: "UNKNOWN",
    rightEyeScore: 0.0,
    bothEyesVisible: false,
    headTilted: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCounterRef = useRef<number>(0);
  const lastSampleTimeRef = useRef<number>(Date.now());

  // Attach MediaStream to video element and invoke play() safely
  const attachStreamToVideo = useCallback((videoElement: HTMLVideoElement | null) => {
    if (!videoElement || !streamRef.current) return;
    if (videoElement.srcObject !== streamRef.current) {
      videoElement.srcObject = streamRef.current;
    }
    videoElement
      .play()
      .then(() => {
        setMetrics((prev) => ({ ...prev, isPlaying: true }));
      })
      .catch((err) => {
        console.warn("Video play notice:", err);
      });
  }, []);

  // Callback ref for JSX video elements so stream re-attaches immediately on DOM mount
  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node) {
        attachStreamToVideo(node);
      }
    },
    [attachStreamToVideo]
  );

  useEffect(() => {
    let isMounted = true;
    let sampleInterval: any = null;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15 } },
          audio: false,
        });

        if (!isMounted) return;

        streamRef.current = stream;
        if (videoRef.current) {
          attachStreamToVideo(videoRef.current);
        }

        // Initialize sampling canvas (160x120)
        canvasRef.current = document.createElement("canvas");
        canvasRef.current.width = 160;
        canvasRef.current.height = 120;
        const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });

        sampleInterval = setInterval(() => {
          const video = videoRef.current;
          const now = Date.now();
          const frameAge = now - lastSampleTimeRef.current;
          lastSampleTimeRef.current = now;

          // 1. Verify Video Element Health
          if (
            !video ||
            !ctx ||
            video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
            video.videoWidth === 0 ||
            video.videoHeight === 0 ||
            video.paused ||
            video.ended
          ) {
            setMetrics((prev) => ({
              ...prev,
              status: "UNKNOWN",
              faceVisible: false,
              hasCameraPermission: Boolean(streamRef.current?.active),
              videoWidth: video?.videoWidth || 0,
              videoHeight: video?.videoHeight || 0,
              videoReadyState: video?.readyState || 0,
              isPlaying: Boolean(video && !video.paused && !video.ended),
              faceVisibilityState: "UNKNOWN",
              leftEyeState: "UNKNOWN",
              rightEyeState: "UNKNOWN",
              bothEyesVisible: false,
              headTilted: false,
            }));
            return;
          }

          try {
            // Draw current video frame to canvas
            ctx.drawImage(video, 0, 0, 160, 120);
            const imageData = ctx.getImageData(0, 0, 160, 120);
            const data = imageData.data;

            frameCounterRef.current += 1;

            // Helper: Analyze Sub-Region Luminance, Vertical Edge Gradient & Pupil/Sclera Contrast
            const analyzeEyeRegion = (minX: number, maxX: number, minY: number, maxY: number) => {
              let totalLum = 0;
              let sumSqLum = 0;
              let count = 0;
              let skinCount = 0;
              let edgeGradSum = 0;
              let minLum = 255;
              let maxLum = 0;

              for (let y = minY; y < maxY; y += 2) {
                for (let x = minX; x < maxX; x += 2) {
                  const idx = (y * 160 + x) * 4;
                  const r = data[idx];
                  const g = data[idx + 1];
                  const b = data[idx + 2];
                  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

                  totalLum += lum;
                  sumSqLum += lum * lum;
                  count++;

                  if (lum < minLum) minLum = lum;
                  if (lum > maxLum) maxLum = lum;

                  // Vertical edge gradient |lum(y) - lum(y-1)|
                  if (y > minY) {
                    const prevIdx = ((y - 1) * 160 + x) * 4;
                    const prevLum = 0.299 * data[prevIdx] + 0.587 * data[prevIdx + 1] + 0.114 * data[prevIdx + 2];
                    edgeGradSum += Math.abs(lum - prevLum);
                  }

                  const isSkin = r > 45 && g > 30 && b > 20 && r > g && r > b && Math.abs(r - g) > 12;
                  if (isSkin) skinCount++;
                }
              }

              const meanLum = totalLum / (count || 1);
              const variance = Math.sqrt(Math.max(0, sumSqLum / (count || 1) - meanLum * meanLum));
              const skinRatio = skinCount / (count || 1);
              const avgEdgeGrad = edgeGradSum / (count || 1);
              const contrastRange = maxLum - minLum;

              return { meanLum, variance, skinRatio, avgEdgeGrad, contrastRange };
            };

            // 2. Analyze Overall Face Region (x: 30..130, y: 20..100)
            const overall = analyzeEyeRegion(30, 130, 20, 100);
            const avgBrightness = Math.round(overall.meanLum);

            // Determine Lighting
            let lighting: "good" | "too_dark" | "too_bright" = "good";
            if (avgBrightness < 35) lighting = "too_dark";
            if (avgBrightness > 220) lighting = "too_bright";

            // 3. Analyze Left & Right Eye Sub-Regions
            // Left Eye Region (x: 35..75, y: 25..55)
            const leftEye = analyzeEyeRegion(35, 75, 25, 55);
            // Right Eye Region (x: 85..125, y: 25..55)
            const rightEye = analyzeEyeRegion(85, 125, 25, 55);
            // Lower Face / Mouth Region (x: 50..110, y: 65..105)
            const lowerFace = analyzeEyeRegion(50, 110, 65, 105);

            // 4. Calculate Eye Openness vs Eyelid Closure (Pupil/Sclera Contrast & Vertical Edge Gradient)
            // Open eyes have high pupil-sclera edge contrast (avgEdgeGrad > 8.5 & contrastRange > 30)
            // Closed eyelids have smooth skin without pupil contrast (avgEdgeGrad < 7.0 & contrastRange < 22)
            const calcEyeOpenScore = (reg: ReturnType<typeof analyzeEyeRegion>) => {
              if (reg.avgEdgeGrad < 6.2 || reg.contrastRange < 22 || reg.variance < 6.0) {
                return 0.20; // Closed eyelids or heavily occluded
              }
              const score = (reg.avgEdgeGrad / 15.0) * 0.5 + (reg.contrastRange / 70.0) * 0.3 + (reg.variance / 20.0) * 0.2;
              return Math.min(1.0, Math.max(0.0, score));
            };

            const leftEyeScore = calcEyeOpenScore(leftEye);
            const rightEyeScore = calcEyeOpenScore(rightEye);

            let leftEyeState: EyeVisibilityState = "VISIBLE";
            if (leftEyeScore < 0.38) leftEyeState = "OCCLUDED";
            else if (leftEyeScore < 0.60) leftEyeState = "PARTIAL";

            let rightEyeState: EyeVisibilityState = "VISIBLE";
            if (rightEyeScore < 0.38) rightEyeState = "OCCLUDED";
            else if (rightEyeScore < 0.60) rightEyeState = "PARTIAL";

            const bothEyesVisible = leftEyeState === "VISIBLE" && rightEyeState === "VISIBLE";

            // 5. Head Tilt / Side Profile Lying Down Check
            // Calculate skin density asymmetry between top and bottom quadrants
            const topHalfSkin = (leftEye.skinRatio + rightEye.skinRatio) / 2;
            const bottomHalfSkin = lowerFace.skinRatio;
            const headTilted = Math.abs(topHalfSkin - bottomHalfSkin) > 0.40 || (topHalfSkin > 0.70 && leftEyeScore < 0.40);

            // 6. Determine Face Presence & Visibility
            const lowerFacePresent = lowerFace.skinRatio >= 0.08 && lowerFace.variance >= 7.0;
            const eyeRegionPresent = leftEyeScore >= 0.38 || rightEyeScore >= 0.38;
            const isFacePresent = avgBrightness >= 35 && (lowerFacePresent || eyeRegionPresent);
            const currentStatus: FacePresenceStatus = isFacePresent ? "PRESENT" : "ABSENT";

            let faceVisibilityScore = 0.0;
            let faceVisibilityState: FaceVisibilityState = "POOR";

            if (isFacePresent) {
              faceVisibilityScore = Number(
                ((leftEyeScore + rightEyeScore + lowerFace.skinRatio) / 2.2).toFixed(2)
              );
              if (bothEyesVisible && lowerFacePresent && !headTilted) {
                faceVisibilityState = "GOOD";
                faceVisibilityScore = Math.max(0.85, faceVisibilityScore);
              } else if (!bothEyesVisible || headTilted) {
                faceVisibilityState = "PARTIAL";
                faceVisibilityScore = Math.min(0.55, faceVisibilityScore);
              } else {
                faceVisibilityState = "POOR";
              }
            } else {
              faceVisibilityState = "POOR";
              leftEyeState = "UNKNOWN";
              rightEyeState = "UNKNOWN";
            }

            setMetrics({
              status: currentStatus,
              faceVisible: isFacePresent,
              faceCentered: isFacePresent && !headTilted,
              lookingAway: headTilted,
              multipleFaces: false,
              hasCameraPermission: true,
              lightingQuality: lighting,
              brightness: avgBrightness,
              frameCount: frameCounterRef.current,
              lastFrameAgeMs: frameAge,
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              videoReadyState: video.readyState,
              isPlaying: !video.paused && !video.ended,

              // Eye & Occlusion Metrics
              faceVisibilityState,
              faceVisibilityScore,
              leftEyeState,
              leftEyeScore: Number(leftEyeScore.toFixed(2)),
              rightEyeState,
              rightEyeScore: Number(rightEyeScore.toFixed(2)),
              bothEyesVisible,
              headTilted,
            });

            if (onFrameSample) {
              onFrameSample({
                faceDetected: isFacePresent,
                faceCount: isFacePresent ? 1 : 0,
                faceVisibilityScore,
                faceVisibilityState,
                leftEyeScore: Number(leftEyeScore.toFixed(2)),
                leftEyeState,
                rightEyeScore: Number(rightEyeScore.toFixed(2)),
                rightEyeState,
                bothEyesVisible,
                centerX: 0.5,
                centerY: 0.5,
                brightness: avgBrightness,
                lightingStatus: lighting,
              });
            }
          } catch (err) {
            console.warn("Canvas frame sampling notice:", err);
          }
        }, 200);
      } catch (err) {
        console.warn("Camera permission error:", err);
        setMetrics((prev) => ({
          ...prev,
          status: "UNKNOWN",
          faceVisible: false,
          hasCameraPermission: false,
          faceVisibilityState: "UNKNOWN",
          leftEyeState: "UNKNOWN",
          rightEyeState: "UNKNOWN",
          bothEyesVisible: false,
          headTilted: false,
        }));
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (sampleInterval) clearInterval(sampleInterval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [attachStreamToVideo, onFrameSample]);

  return { videoRef: setVideoRef, metrics };
}
