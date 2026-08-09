"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import CameraMovementGame from "@/components/CameraMovementGame";

export default function GamePage() {
  return (
    <ProtectedRoute>
      <TopBar />
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        <h1 className="mb-4 font-display text-2xl font-bold text-azuki-dark">
          เกมขยับร่างกาย
        </h1>
        <CameraMovementGame />
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
}
