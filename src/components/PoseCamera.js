"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Opens the device camera and runs MoveNet (TensorFlow.js) fully in the
 * browser. The video stream is never recorded or sent anywhere — it only
 * ever exists as pixels on this screen. `onPose` fires ~every animation
 * frame with the current keypoints (or null when nobody is detected).
 */
export default function PoseCamera({ active, onPose, onStatusChange }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const activeRef = useRef(active);
  const onPoseRef = useRef(onPose);
  const onStatusChangeRef = useRef(onStatusChange);
  const [status, setStatus] = useState("loading-camera");

  // Keep refs current every render so the mount-only loop below always
  // calls the latest callbacks instead of the ones captured at mount time.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    onPoseRef.current = onPose;
  }, [onPose]);
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    let cancelled = false;

    function setStat(s) {
      if (cancelled) return;
      setStatus(s);
      onStatusChangeRef.current?.(s);
    }

    async function loop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const detector = detectorRef.current;
      if (!video || !canvas || !detector) return;
      if (video.readyState >= 2 && activeRef.current) {
        try {
          const poses = await detector.estimatePoses(video, { flipHorizontal: false });
          const keypoints = poses[0]?.keypoints || null;
          drawOverlay(canvas, video, keypoints);
          onPoseRef.current?.(keypoints);
        } catch (e) {
          // A dropped frame shouldn't crash the whole game.
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    async function init() {
      try {
        setStat("loading-camera");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 360 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStat("loading-model");
        const tf = await import("@tensorflow/tfjs");
        await tf.setBackend("webgl");
        await tf.ready();
        const poseDetection = await import("@tensorflow-models/pose-detection");
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        });
        if (cancelled) return;
        detectorRef.current = detector;
        setStat("ready");
        loop();
      } catch (err) {
        setStat("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      try {
        detectorRef.current?.dispose?.();
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md aspect-[4/3] overflow-hidden rounded-xl2 border-4 border-matcha-700 bg-ink">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full -scale-x-100 object-cover" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100" />
      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/80 p-4 text-center text-cream">
          <p className="font-body text-base">
            {status === "error"
              ? "เปิดกล้องไม่ได้ กรุณาอนุญาตให้เว็บไซต์นี้ใช้กล้องในเบราว์เซอร์ของคุณ แล้วลองใหม่"
              : status === "loading-model"
              ? "กำลังเตรียมระบบตรวจจับท่าทาง กรุณารอสักครู่..."
              : "กำลังเปิดกล้อง กรุณาอนุญาตการใช้งานกล้อง..."}
          </p>
        </div>
      )}
    </div>
  );
}

function drawOverlay(canvas, video, keypoints) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = video.videoWidth || 480;
  const h = video.videoHeight || 360;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  if (!keypoints) return;
  ctx.fillStyle = "#EFCB63";
  ctx.strokeStyle = "#EFCB63";
  keypoints.forEach((k) => {
    if ((k.score ?? 0) < 0.35) return;
    ctx.beginPath();
    ctx.arc(k.x, k.y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
}
