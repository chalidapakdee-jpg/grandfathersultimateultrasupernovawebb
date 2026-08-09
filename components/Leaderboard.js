"use client";

import { Trophy } from "lucide-react";
import Card from "@/components/Card";
import MOCK_LEADERBOARD from "@/lib/mockLeaderboard";
import { useAuth } from "@/components/AuthProvider";
import { useUserData } from "@/components/UserDataProvider";

const MEDAL_TONE = ["text-mustard-dark", "text-ink/40", "text-azuki-dark"];

export default function Leaderboard() {
  const { currentUser } = useAuth();
  const { points } = useUserData();

  const board = [...MOCK_LEADERBOARD, { name: currentUser, points, isYou: true }].sort(
    (a, b) => b.points - a.points
  );

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Trophy size={22} className="text-mustard-dark" aria-hidden="true" />
        <h2 className="font-display text-lg font-bold">กระดานผู้นำ</h2>
      </div>
      <ul className="flex flex-col divide-y divide-ink/10">
        {board.map((entry, idx) => (
          <li
            key={`${entry.name}-${idx}`}
            className={`flex items-center justify-between py-3 ${
              entry.isYou ? "rounded-xl bg-azuki-light/30 px-2" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`font-display w-7 text-center text-lg font-bold ${
                  MEDAL_TONE[idx] ?? "text-ink/50"
                }`}
              >
                {idx + 1}
              </span>
              <span className={entry.isYou ? "font-bold text-azuki-dark" : ""}>
                {entry.name} {entry.isYou && "(คุณ)"}
              </span>
            </div>
            <span className="font-semibold">{entry.points.toLocaleString("th-TH")}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
