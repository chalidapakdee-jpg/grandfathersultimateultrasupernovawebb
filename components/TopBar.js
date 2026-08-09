"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useUserData } from "@/components/UserDataProvider";

export default function TopBar() {
  const { logout, currentUser } = useAuth();
  const { points } = useUserData();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="Grandfather's"
          width={44}
          height={44}
          className="h-11 w-11 object-contain"
          priority
        />
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-azuki-dark">
            Grandfather&apos;s
          </p>
          <p className="text-xs text-ink/60">สวัสดี, {currentUser}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-pill bg-mustard px-4 py-2 text-sm font-bold text-ink shadow-soft">
          {points.toLocaleString("th-TH")} แต้ม
        </div>
        <button
          onClick={logout}
          aria-label="ออกจากระบบ"
          className="tap-target flex items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-azuki"
        >
          <LogOut size={22} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
