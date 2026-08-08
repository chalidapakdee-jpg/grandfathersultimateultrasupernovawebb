"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

/** Wrap any page that needs a logged-in user. */
export default function RequireAuth({ children }) {
  const { isAuthed, ready } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthed) router.replace("/login");
  }, [ready, isAuthed, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-body text-ink/70">กำลังโหลด...</p>
      </div>
    );
  }
  if (!isAuthed) return null;
  return children;
}
