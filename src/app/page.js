"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Mascot from "@/components/Mascot";

export default function RootPage() {
  const { ready, isAuthed } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(isAuthed ? "/home" : "/login");
  }, [ready, isAuthed, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <Mascot size={140} speechTh="สวัสดีค่ะ/ครับ กำลังเตรียมแอปให้พร้อม รอสักครู่นะคะ" />
    </div>
  );
}
