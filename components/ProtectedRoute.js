"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace("/login");
    }
  }, [loading, currentUser, router]);

  if (loading || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-display text-lg text-matcha-dark">กำลังโหลด...</p>
      </div>
    );
  }

  return children;
}
