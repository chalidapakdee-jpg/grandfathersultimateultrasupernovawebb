"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import AvatarBuilder from "@/components/AvatarBuilder";
import Leaderboard from "@/components/Leaderboard";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <TopBar />
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        <h1 className="mb-4 font-display text-2xl font-bold text-azuki-dark">โปรไฟล์</h1>
        <div className="flex flex-col gap-4">
          <AvatarBuilder />
          <Leaderboard />
        </div>
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
}
