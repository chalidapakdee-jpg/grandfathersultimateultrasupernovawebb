"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";

export default function RootPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(currentUser ? "/home" : "/login");
  }, [loading, currentUser, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
      <Image
        src="/images/logo.png"
        alt="Grandfather's Ultimate Ultra SuperNova"
        width={220}
        height={220}
        className="h-40 w-40 object-contain"
        priority
      />
      <p className="font-display text-lg font-semibold text-matcha-dark">
        กำลังเตรียมความพร้อม...
      </p>
    </main>
  );
}
