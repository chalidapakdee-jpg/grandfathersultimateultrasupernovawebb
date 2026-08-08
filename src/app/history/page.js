"use client";

import { useMemo } from "react";
import { Trophy, CalendarClock, Repeat, ListChecks } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import { useApp } from "@/context/AppContext";

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

function formatDateTh(iso) {
  return new Date(iso).toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const { user } = useApp();
  const history = user?.history || [];

  const stats = useMemo(() => {
    const now = Date.now();
    const last2Weeks = history.filter((h) => now - new Date(h.date).getTime() <= TWO_WEEKS_MS);
    return {
      totalPoints: user?.totalPoints || 0,
      timesPlayed: history.length,
      last2WeeksCount: last2Weeks.length,
      lastPlayed: history[0]?.date,
    };
  }, [history, user]);

  return (
    <RequireAuth>
      <TopBar title="ประวัติการใช้งาน" />
      <main className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="คะแนนสะสมทั้งหมด" value={stats.totalPoints.toLocaleString("th-TH")} icon={Trophy} accent="azuki" />
          <StatCard label="เล่นไปแล้วทั้งหมด" value={`${stats.timesPlayed} ครั้ง`} icon={ListChecks} accent="matcha" />
          <StatCard label="ใน 2 สัปดาห์ล่าสุด" value={`${stats.last2WeeksCount} ครั้ง`} icon={Repeat} accent="mustard" />
          <StatCard
            label="เล่นล่าสุดเมื่อ"
            value={stats.lastPlayed ? formatDateTh(stats.lastPlayed) : "ยังไม่เคยเล่น"}
            icon={CalendarClock}
            accent="matcha"
          />
        </div>

        <h2 className="mt-8 mb-3 font-display text-lg font-bold text-ink">รายการที่เล่นผ่านมา</h2>

        {history.length === 0 ? (
          <p className="rounded-xl2 border-2 border-dashed border-matcha-400 bg-matcha-50 p-6 text-center font-body text-ink/70">
            ยังไม่มีประวัติการเล่น ลองไปที่เมนู &ldquo;เกมการเคลื่อนไหว&rdquo; เพื่อเริ่มเล่นกันเลยค่ะ
          </p>
        ) : (
          <ul className="space-y-3">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between rounded-xl2 border-2 border-matcha-300 bg-white/70 p-4"
              >
                <div>
                  <p className="font-bold text-ink">{formatDateTh(h.date)}</p>
                  <p className="text-sm text-ink/70">
                    เล่น {h.durationMinutes} นาที
                    {h.paused ? " · หยุดพักระหว่างเล่น" : ""}
                  </p>
                </div>
                <span className="font-display text-xl font-bold text-azuki-700">+{h.pointsEarned}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
      <BottomNav />
    </RequireAuth>
  );
}
