"use client";

import { useMemo, useState } from "react";
import { Lock, Coins, Trophy, Check } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import AvatarSVG from "@/components/AvatarSVG";
import { useApp } from "@/context/AppContext";
import { AVATAR_CATEGORIES, SEED_LEADERBOARD } from "@/lib/constants";
import { getAllUsersForLeaderboard } from "@/lib/storage";

export default function ProfilePage() {
  const { user, spendCoins, equipItem } = useApp();
  const [tab, setTab] = useState("dress"); // "dress" | "board"
  const [category, setCategory] = useState(AVATAR_CATEGORIES[0].key);

  const activeCategory = AVATAR_CATEGORIES.find((c) => c.key === category);

  const leaderboard = useMemo(() => {
    const real = getAllUsersForLeaderboard();
    const combined = [...SEED_LEADERBOARD, ...real];
    combined.sort((a, b) => b.totalPoints - a.totalPoints);
    return combined;
  }, [user]);

  function handlePick(option) {
    const owned = user.inventory.includes(option.id);
    if (owned) {
      equipItem(category, option.id);
      return;
    }
    if (user.coins >= option.cost) {
      spendCoins(option.cost, category, option.id);
      equipItem(category, option.id);
    }
  }

  return (
    <RequireAuth>
      <TopBar title="โปรไฟล์ของฉัน" />
      <main className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <div className="mb-5 flex rounded-xl border-2 border-matcha-600 overflow-hidden">
          <button
            onClick={() => setTab("dress")}
            className={`flex-1 py-3 font-bold ${tab === "dress" ? "bg-matcha-600 text-cream" : "bg-white text-matcha-700"}`}
          >
            แต่งตัวละคร
          </button>
          <button
            onClick={() => setTab("board")}
            className={`flex-1 py-3 font-bold ${tab === "board" ? "bg-matcha-600 text-cream" : "bg-white text-matcha-700"}`}
          >
            กระดานผู้นำ
          </button>
        </div>

        {tab === "dress" ? (
          <>
            <div className="flex flex-col items-center rounded-xl2 border-4 border-mustard-400 bg-mustard-50 p-5">
              <AvatarSVG avatar={user.avatar} size={190} />
              <p className="mt-2 font-display text-xl font-bold text-ink">{user.username}</p>
              <div className="mt-1 flex items-center gap-1 text-azuki-700">
                <Coins size={20} />
                <span className="font-bold">{user.coins.toLocaleString("th-TH")} แต้มสำหรับแลกของ</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {AVATAR_CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`rounded-full border-2 px-4 py-2 font-bold ${
                    category === c.key ? "border-matcha-700 bg-matcha-600 text-cream" : "border-matcha-400 bg-white text-matcha-700"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {activeCategory.options.map((opt) => {
                const owned = user.inventory.includes(opt.id);
                const equipped = user.avatar[category] === opt.id;
                const affordable = user.coins >= opt.cost;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handlePick(opt)}
                    disabled={!owned && !affordable}
                    className={`relative flex flex-col items-center gap-1 rounded-xl2 border-2 p-3 text-center disabled:opacity-50 ${
                      equipped ? "border-azuki-600 bg-azuki-50" : "border-matcha-400 bg-white"
                    }`}
                  >
                    {equipped && (
                      <span className="absolute right-1 top-1 rounded-full bg-azuki-600 p-1 text-cream">
                        <Check size={14} />
                      </span>
                    )}
                    <span
                      className="h-10 w-10 rounded-full border-2 border-ink/20"
                      style={{ background: opt.colorClass && opt.colorClass !== "transparent" ? opt.colorClass : "#EEE" }}
                    />
                    <span className="text-sm font-bold text-ink">{opt.label}</span>
                    {owned ? (
                      <span className="text-xs text-matcha-700">{equipped ? "กำลังสวมใส่" : "เลือกใช้"}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-azuki-700">
                        {!affordable && <Lock size={12} />} {opt.cost.toLocaleString("th-TH")} แต้ม
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-xl2 border-2 border-matcha-400 bg-white/70 p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Trophy size={22} className="text-mustard-600" /> อันดับคะแนนสะสม
            </h2>
            <ol className="space-y-2">
              {leaderboard.map((p, i) => {
                const isMe = p.id === user.id;
                return (
                  <li
                    key={p.id}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                      isMe ? "border-2 border-azuki-600 bg-azuki-50" : "bg-matcha-50"
                    }`}
                  >
                    <span className="flex items-center gap-3 font-bold text-ink">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha-600 text-cream">
                        {i + 1}
                      </span>
                      {p.username}
                      {isMe && <span className="text-xs text-azuki-700">(คุณ)</span>}
                    </span>
                    <span className="font-display font-bold text-azuki-700">{p.totalPoints.toLocaleString("th-TH")}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </main>
      <BottomNav />
    </RequireAuth>
  );
}
