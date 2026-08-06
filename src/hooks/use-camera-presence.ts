"use client";

import { useState, useEffect, useRef } from "react";

export interface CameraPresenceMetrics {
  faceVisible: boolean;
  faceCentered: boolean;
  lookingAway: boolean;
  multipleFaces: boolean;
  hasCameraPermission: boolean;
}

export function useCameraPresence() {
  const [metrics, setMetrics] = useState<CameraPresenceMetrics>({
    faceVisible: true,
    faceCentered: true,
    lookingAway: false,
    multipleFaces: false,
    hasCameraPermission: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: 15 },
        });

        if (!isMounted) return;

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setMetrics((prev) => ({ ...prev, hasCameraPermission: true, faceVisible: true, faceCentered: true }));
      } catch (err) {
        console.warn("Camera permission notice:", err);
        setMetrics((prev) => ({ ...prev, hasCameraPermission: false }));
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { videoRef, metrics };
}
