"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play, X, Volume2, ShieldCheck } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ConfirmDialog from "@/components/ConfirmDialog";
import PoseCamera from "@/components/PoseCamera";
import { useApp } from "@/context/AppContext";
import { DURATION_OPTIONS } from "@/lib/constants";
import { pickRoundOrder } from "@/lib/movements";

const INSTRUCT_MS = 3000; // time to listen to the Thai voice instruction
const ACTIVE_MS = 9000; // time to hold the movement and be scored
const TICK_MS = 200;

function speakThai(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "th-TH";
    utter.rate = 0.92;
    window.speechSynthesis.speak(utter);
  } catch (e) {
    // Speech synthesis may be unavailable on some devices — the game still
    // works with on-screen text only.
  }
}

export default function GamePage() {
  const { recordSession } = useApp();
  const router = useRouter();

  const [stage, setStage] = useState("setup"); // setup | playing | finished
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [rounds, setRounds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [subPhase, setSubPhase] = useState("instruct"); // instruct | active
  const [subElapsed, setSubElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [everPaused, setEverPaused] = useState(false);
  const [roundScores, setRoundScores] = useState([]);
  const [finalPoints, setFinalPoints] = useState(0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const holdFrames = useRef(0);
  const totalFrames = useRef(0);
  const subElapsedRef = useRef(0);
  const pausedRef = useRef(false);
  const roundScoresRef = useRef([]);

  const currentMovement = rounds[roundIndex];

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  function startGame(minutes) {
    const totalSeconds = minutes * 60;
    const perRoundSeconds = (INSTRUCT_MS + ACTIVE_MS) / 1000;
    const count = Math.max(4, Math.round(totalSeconds / perRoundSeconds));
    setRounds(pickRoundOrder(count));
    setRoundIndex(0);
    setSubPhase("instruct");
    setSubElapsed(0);
    subElapsedRef.current = 0;
    setPaused(false);
    pausedRef.current = false;
    setEverPaused(false);
    setRoundScores([]);
    roundScoresRef.current = [];
    setDurationMinutes(minutes);
    setStage("playing");
  }

  // Speak the instruction out loud each time a new round begins.
  useEffect(() => {
    if (stage !== "playing" || subPhase !== "instruct") return;
    if (!currentMovement) return;
    speakThai(currentMovement.instructionTh);
    holdFrames.current = 0;
    totalFrames.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, roundIndex]);

  const finishGame = useCallback(
    (scores) => {
      const raw = scores.reduce((s, v) => s + v, 0);
      const total = Math.round(everPaused ? raw * 0.95 : raw);
      setFinalPoints(total);
      recordSession({
        durationMinutes,
        pointsEarned: total,
        paused: everPaused,
        movementsCompleted: scores.length,
      });
      setStage("finished");
    },
    [durationMinutes, everPaused, recordSession]
  );

  // finishGame's identity changes whenever `everPaused` flips (first pause
  // of the session). Reading it through a ref keeps that change from
  // tearing down and restarting the interval below mid-round.
  const finishGameRef = useRef(finishGame);
  useEffect(() => {
    finishGameRef.current = finishGame;
  }, [finishGame]);

  // Master game clock — a simple interval that only advances while playing
  // and not paused. Kept deliberately simple (not requestAnimationFrame)
  // since round timing only needs ~200ms precision for a wellness game.
  // Every setState call here is a direct call (never nested inside another
  // updater function) so nothing here can run twice under Strict Mode.
  useEffect(() => {
    if (stage !== "playing") return undefined;
    subElapsedRef.current = 0;

    const interval = setInterval(() => {
      if (pausedRef.current) return;

      subElapsedRef.current += TICK_MS;
      const limit = subPhase === "instruct" ? INSTRUCT_MS : ACTIVE_MS;
      setSubElapsed(subElapsedRef.current);

      if (subElapsedRef.current < limit) return;

      if (subPhase === "instruct") {
        setSubPhase("active");
        return;
      }

      const ratio = totalFrames.current > 0 ? holdFrames.current / totalFrames.current : 0;
      const score = Math.round(Math.min(1, ratio / 0.4) * 100);
      const nextScores = [...roundScoresRef.current, score];
      roundScoresRef.current = nextScores;
      setRoundScores(nextScores);

      if (roundIndex + 1 >= rounds.length) {
        finishGameRef.current(nextScores);
      } else {
        setRoundIndex((i) => i + 1);
        setSubPhase("instruct");
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [stage, subPhase, roundIndex, rounds.length]);

  const handlePose = useCallback(
    (keypoints) => {
      if (stage !== "playing" || subPhase !== "active" || paused || !currentMovement) return;
      totalFrames.current += 1;
      if (keypoints && currentMovement.check(keypoints)) {
        holdFrames.current += 1;
      }
    },
    [stage, subPhase, paused, currentMovement]
  );

  // Track "has this session ever been paused" as its own effect rather than
  // inside the setPaused updater, so nothing here runs as a side effect of
  // React re-invoking an updater function.
  useEffect(() => {
    if (paused) setEverPaused(true);
  }, [paused]);

  function togglePause() {
    setPaused((p) => !p);
  }

  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = useMemo(() => {
    const perRoundMs = INSTRUCT_MS + ACTIVE_MS;
    const doneRoundsMs = roundIndex * perRoundMs;
    const inRoundMs = subPhase === "instruct" ? subElapsed : INSTRUCT_MS + subElapsed;
    return Math.min(totalSeconds, Math.round((doneRoundsMs + inRoundMs) / 1000));
  }, [roundIndex, subPhase, subElapsed, totalSeconds]);

  const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const ss = String(elapsedSeconds % 60).padStart(2, "0");

  return (
    <RequireAuth>
      <TopBar title="เกมการเคลื่อนไหว" />

      {stage === "setup" && (
        <main className="mx-auto max-w-xl px-4 pb-28 pt-6">
          <h2 className="mb-3 font-display text-xl font-bold text-ink">เลือกระยะเวลาที่จะเล่น</h2>
          <div className="grid grid-cols-2 gap-3">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d.minutes}
                onClick={() => startGame(d.minutes)}
                className="rounded-xl2 border-4 border-matcha-500 bg-matcha-50 p-5 text-center font-bold text-matcha-800 shadow-soft hover:bg-matcha-100"
              >
                <span className="block font-display text-3xl">{d.minutes}</span>
                <span className="text-sm">{d.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl2 border-2 border-mustard-400 bg-mustard-50 p-4">
            <ShieldCheck size={28} className="mt-1 shrink-0 text-mustard-700" />
            <p className="font-body text-sm text-ink/90">
              ภาพจากกล้องของคุณจะปรากฏบนหน้าจอของคุณเท่านั้น เพื่อให้ระบบช่วยตรวจจับการเคลื่อนไหว
              เราไม่บันทึกหรือส่งภาพนี้ออกไปที่ใดทั้งสิ้น เว้นแต่คุณจะบันทึกหน้าจอด้วยตนเอง คุณสามารถกดหยุดพักได้ทุกเมื่อ
              (การหยุดพักจะทำให้ได้คะแนนรวมลดลงเล็กน้อย 5%)
            </p>
          </div>
        </main>
      )}

      {stage === "playing" && currentMovement && (
        <main className="mx-auto max-w-xl px-4 pb-10 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-matcha-700">
              {mm}:{ss} / {String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:{String(totalSeconds % 60).padStart(2, "0")}
            </span>
            <button
              onClick={() => setShowQuitConfirm(true)}
              aria-label="ออกจากเกม"
              className="rounded-full border-2 border-azuki-500 p-2 text-azuki-600 hover:bg-azuki-50"
            >
              <X size={22} />
            </button>
          </div>

          <PoseCamera active={subPhase === "active" && !paused} onPose={handlePose} />

          <div className="mt-4 rounded-xl2 border-4 border-matcha-600 bg-matcha-50 p-5 text-center">
            <p className="mb-1 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-matcha-700">
              <Volume2 size={18} /> {subPhase === "instruct" ? "ฟังคำแนะนำ" : "ทำท่านี้ค้างไว้!"}
            </p>
            <p className="font-display text-2xl font-bold text-ink">{currentMovement.nameTh}</p>
            <p className="mt-1 font-body text-ink/80">{currentMovement.instructionTh}</p>
          </div>

          <button
            onClick={togglePause}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl2 bg-azuki-600 py-4 text-xl font-bold text-cream shadow-soft hover:bg-azuki-700"
          >
            {paused ? <Play size={24} /> : <Pause size={24} />}
            {paused ? "เล่นต่อ" : "หยุดพัก"}
          </button>

          {paused && (
            <p className="mt-3 text-center font-bold text-azuki-700">หยุดพักอยู่ — กดปุ่มด้านบนเพื่อเล่นต่อเมื่อพร้อม</p>
          )}
        </main>
      )}

      {stage === "finished" && (
        <main className="mx-auto max-w-xl px-4 pb-28 pt-8 text-center">
          <h2 className="font-display text-2xl font-bold text-matcha-700">เก่งมากค่ะ/ครับ!</h2>
          <p className="mt-2 font-body text-ink/80">คุณออกกำลังกายครบ {durationMinutes} นาทีแล้ว</p>
          <p className="mt-6 font-display text-5xl font-bold text-azuki-700">+{finalPoints.toLocaleString("th-TH")}</p>
          <p className="font-body text-ink/70">คะแนนที่ได้รับ</p>
          {everPaused && <p className="mt-2 text-sm text-ink/60">(หักคะแนน 5% เนื่องจากมีการหยุดพักระหว่างเล่น)</p>}

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => setStage("setup")}
              className="rounded-xl2 bg-matcha-600 py-4 text-lg font-bold text-cream shadow-soft hover:bg-matcha-700"
            >
              เล่นอีกครั้ง
            </button>
            <button
              onClick={() => router.push("/home")}
              className="rounded-xl2 border-2 border-matcha-500 py-4 text-lg font-bold text-matcha-700 hover:bg-matcha-50"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </main>
      )}

      <ConfirmDialog
        open={showQuitConfirm}
        title="ออกจากเกม?"
        description="คะแนนของรอบนี้จะไม่ถูกบันทึก"
        confirmLabel="ออกจากเกม"
        danger
        onConfirm={() => {
          setShowQuitConfirm(false);
          setStage("setup");
        }}
        onCancel={() => setShowQuitConfirm(false)}
      />

      {stage !== "playing" && <BottomNav />}
    </RequireAuth>
  );
}
