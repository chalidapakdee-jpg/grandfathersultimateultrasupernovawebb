"use client";

import { Trophy, CalendarClock, Repeat, Clock } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { useUserData } from "@/components/UserDataProvider";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_TH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m} นาที ${s} วินาที`;
}

function formatDateTh(iso) {
  return new Date(iso).toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildLast14Days(history) {
  const days = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = 13; i >= 0; i--) {
    const dayStart = new Date(now.getTime() - i * DAY_MS);
    const dayEnd = new Date(dayStart.getTime() + DAY_MS);
    const count = history.filter((h) => {
      const t = new Date(h.dateISO).getTime();
      return t >= dayStart.getTime() && t < dayEnd.getTime();
    }).length;
    days.push({ label: WEEKDAY_TH[dayStart.getDay()], count });
  }
  return days;
}

export default function RecordPage() {
  const { points, history } = useUserData();
  const days = buildLast14Days(history);
  const maxCount = Math.max(1, ...days.map((d) => d.count));
  const twoWeekCount = days.reduce((sum, d) => sum + d.count, 0);
  const lastPlayed = history[0] ? formatDateTh(history[0].dateISO) : "ยังไม่เคยเล่น";

  return (
    <ProtectedRoute>
      <TopBar />
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        <h1 className="mb-4 font-display text-2xl font-bold text-azuki-dark">
          ประวัติการเล่น
        </h1>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <StatCard icon={Trophy} label="แต้มสะสมทั้งหมด" value={points.toLocaleString("th-TH")} tone="mustard" />
          <StatCard icon={Repeat} label="จำนวนครั้งทั้งหมด" value={`${history.length} ครั้ง`} tone="matcha" />
          <StatCard icon={CalendarClock} label="เล่นใน 2 สัปดาห์นี้" value={`${twoWeekCount} ครั้ง`} tone="azuki" />
          <StatCard icon={Clock} label="เล่นล่าสุด" value={lastPlayed} tone="mustard" />
        </div>

        <Card className="mb-4">
          <h2 className="mb-3 font-display text-lg font-bold">ความถี่ 14 วันล่าสุด</h2>
          <div className="flex items-end justify-between gap-1" style={{ height: "7rem" }}>
            {days.map((d, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg bg-matcha"
                  style={{ height: `${(d.count / maxCount) * 5.5 + 0.15}rem` }}
                  aria-hidden="true"
                />
                <span className="text-[10px] text-ink/50">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-lg font-bold">รายการที่เล่นผ่านมา</h2>
          {history.length === 0 ? (
            <p className="text-ink/60">ยังไม่มีประวัติการเล่น ลองไปที่หน้าเกมดูสิ!</p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/10">
              {history.map((h) => (
                <li key={h.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">{formatDateTh(h.dateISO)}</p>
                    <p className="text-sm text-ink/60">
                      {formatDuration(h.durationSec)}
                      {h.paused ? " · หยุดชั่วคราว" : ""}
                    </p>
                  </div>
                  <p className="font-display text-xl font-bold text-azuki-dark">
                    +{h.points}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
}
