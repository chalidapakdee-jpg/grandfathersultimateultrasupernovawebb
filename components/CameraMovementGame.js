"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PlayCircle, Pause, Play, Square, Camera, ShieldCheck } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import MOVEMENT_PROMPTS from "@/lib/movementPrompts";
import { speakThai, stopSpeaking } from "@/lib/thaiSpeech";
import { useUserData } from "@/components/UserDataProvider";

const DURATIONS = [
  { label: "1 นาที", seconds: 60 },
  { label: "3 นาที", seconds: 180 },
  { label: "5 นาที", seconds: 300 },
  { label: "10 นาที", seconds: 600 },
];

const SAMPLE_W = 64;
const SAMPLE_H = 48;
const SAMPLE_MS = 400;
const PROMPT_MS = 9000;
const MOVEMENT_THRESHOLD = 10;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CameraMovementGame() {
  const { addSessionRecord } = useUserData();

  const [phase, setPhase] = useState("setup"); // setup | countdown | playing | paused | finished
  const [duration, setDuration] = useState(180);
  const [timeLeft, setTimeLeft] = useState(180);
  const [countdown, setCountdown] = useState(3);
  const [rawPoints, setRawPoints] = useState(0);
  const [pausedUsed, setPausedUsed] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [cameraError, setCameraError] = useState("");
  const [finalPoints, setFinalPoints] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const prevFrameRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  // Pick a duration, ask for the camera, then count down before starting
  async function handleStart() {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setTimeLeft(duration);
      setRawPoints(0);
      setPausedUsed(false);
      setPromptIndex(0);
      prevFrameRef.current = null;
      setCountdown(3);
      setPhase("countdown");
    } catch (err) {
      setCameraError(
        "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตให้เว็บไซต์ใช้กล้อง แล้วลองอีกครั้ง"
      );
    }
  }

  // Countdown 3-2-1 then start playing
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("playing");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const finishSession = useCallback(
    (reachedZero) => {
      stopCamera();
      stopSpeaking();
      const elapsed = reachedZero ? duration : duration - timeLeft;
      const final = pausedUsed ? Math.round(rawPoints * 0.95) : rawPoints;
      setFinalPoints(final);
      addSessionRecord({
        dateISO: new Date().toISOString(),
        durationSec: elapsed,
        points: final,
        paused: pausedUsed,
      });
      setPhase("finished");
    },
    [addSessionRecord, duration, pausedUsed, rawPoints, stopCamera, timeLeft]
  );

  // Main playing loop: countdown timer, movement sampling, spoken prompts
  useEffect(() => {
    if (phase !== "playing") return undefined;

    speakThai(MOVEMENT_PROMPTS[promptIndex % MOVEMENT_PROMPTS.length].th);

    const timerId = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const promptId = setInterval(() => {
      setPromptIndex((i) => {
        const next = (i + 1) % MOVEMENT_PROMPTS.length;
        speakThai(MOVEMENT_PROMPTS[next].th);
        return next;
      });
    }, PROMPT_MS);

    const sampleId = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, SAMPLE_W, SAMPLE_H);
      const frame = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H);

      if (prevFrameRef.current) {
        let diffSum = 0;
        const prev = prevFrameRef.current.data;
        const cur = frame.data;
        for (let i = 0; i < cur.length; i += 4) {
          diffSum +=
            Math.abs(cur[i] - prev[i]) +
            Math.abs(cur[i + 1] - prev[i + 1]) +
            Math.abs(cur[i + 2] - prev[i + 2]);
        }
        const avgDiff = diffSum / (SAMPLE_W * SAMPLE_H * 3);
        if (avgDiff > MOVEMENT_THRESHOLD) {
          setRawPoints((p) => p + Math.min(40, Math.round(avgDiff)));
        }
      }
      prevFrameRef.current = frame;
    }, SAMPLE_MS);

    return () => {
      clearInterval(timerId);
      clearInterval(promptId);
      clearInterval(sampleId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Timer hit zero while playing -> end the session
  useEffect(() => {
    if (phase === "playing" && timeLeft === 0) {
      finishSession(true);
    }
  }, [phase, timeLeft, finishSession]);

  function handlePauseToggle() {
    if (phase === "playing") {
      setPausedUsed(true);
      stopSpeaking();
      setPhase("paused");
    } else if (phase === "paused") {
      setPhase("playing");
    }
  }

  function handlePlayAgain() {
    setPhase("setup");
  }

  const currentPrompt = MOVEMENT_PROMPTS[promptIndex % MOVEMENT_PROMPTS.length];

  return (
    <div className="flex flex-col gap-5">
      <canvas
        ref={canvasRef}
        width={SAMPLE_W}
        height={SAMPLE_H}
        className="hidden"
        aria-hidden="true"
      />

      {phase === "setup" && (
        <Card tone="matcha">
          <h2 className="mb-3 font-display text-xl font-bold">เลือกเวลาเล่น</h2>
          <div className="mb-4 grid grid-cols-2 gap-3">
            {DURATIONS.map((d) => (
              <button
                key={d.seconds}
                onClick={() => setDuration(d.seconds)}
                className={`tap-target rounded-2xl border-2 py-4 text-lg font-semibold transition-colors ${
                  duration === d.seconds
                    ? "border-azuki bg-azuki text-cream"
                    : "border-ink/15 bg-white text-ink hover:border-matcha"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="mb-4 flex items-start gap-2 rounded-2xl bg-white/70 p-3 text-sm text-ink/70">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-matcha-dark" aria-hidden="true" />
            <p>
              กล้องจะแสดงให้เห็นเฉพาะตัวคุณเท่านั้น เราไม่บันทึกหรือส่งวิดีโอของคุณไปที่ใดทั้งสิ้น
            </p>
          </div>

          {cameraError && (
            <p role="alert" className="mb-3 text-sm font-semibold text-azuki-dark">
              {cameraError}
            </p>
          )}

          <Button variant="primary" fullWidth icon={Camera} onClick={handleStart}>
            เปิดกล้องแล้วเริ่มเล่น
          </Button>
        </Card>
      )}

      {phase === "countdown" && (
        <Card tone="mustard" className="flex flex-col items-center gap-3 py-10">
          <VideoPreview videoRef={videoRef} />
          <p className="font-display text-6xl font-bold text-azuki-dark">
            {countdown > 0 ? countdown : "ไป!"}
          </p>
        </Card>
      )}

      {(phase === "playing" || phase === "paused") && (
        <div className="flex flex-col gap-4">
          <VideoPreview videoRef={videoRef} />

          <Card tone="mustard" className="text-center">
            <p className="text-sm text-ink/60">ทำตามคำแนะนำ</p>
            <p className="font-display text-2xl font-bold text-azuki-dark">
              {currentPrompt.th}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center">
              <p className="text-sm text-ink/60">เวลาที่เหลือ</p>
              <p className="font-display text-3xl font-bold">{formatTime(timeLeft)}</p>
            </Card>
            <Card className="text-center" tone="azuki">
              <p className="text-sm text-ink/60">แต้มระหว่างเล่น</p>
              <p className="font-display text-3xl font-bold">{rawPoints}</p>
            </Card>
          </div>

          {phase === "paused" && (
            <p className="text-center text-sm font-semibold text-azuki-dark">
              หยุดชั่วคราว (แต้มสุดท้ายจะถูกหักออก 5%)
            </p>
          )}

          <div className="flex gap-3">
            <Button
              variant="mustard"
              fullWidth
              icon={phase === "playing" ? Pause : Play}
              onClick={handlePauseToggle}
            >
              {phase === "playing" ? "หยุดชั่วคราว" : "เล่นต่อ"}
            </Button>
            <Button variant="outline" fullWidth icon={Square} onClick={() => finishSession(false)}>
              จบเกม
            </Button>
          </div>
        </div>
      )}

      {phase === "finished" && (
        <Card tone="matcha" className="flex flex-col items-center gap-4 py-8 text-center">
          <h2 className="font-display text-2xl font-bold text-azuki-dark">เยี่ยมมาก!</h2>
          <p className="text-lg">คุณได้รับแต้มทั้งหมด</p>
          <p className="font-display text-5xl font-bold text-azuki-dark">{finalPoints}</p>
          {pausedUsed && (
            <p className="text-sm text-ink/60">(หักแต้ม 5% เนื่องจากมีการหยุดชั่วคราว)</p>
          )}
          <Button variant="primary" icon={PlayCircle} onClick={handlePlayAgain}>
            เล่นอีกครั้ง
          </Button>
        </Card>
      )}
    </div>
  );
}

function VideoPreview({ videoRef }) {
  return (
    <div className="overflow-hidden rounded-3xl border-4 border-matcha bg-ink/80 shadow-soft">
      <video
        ref={videoRef}
        muted
        playsInline
        className="mirror aspect-[4/3] w-full object-cover"
      />
    </div>
  );
}
