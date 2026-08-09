"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function LoginPage() {
  const { currentUser, loading, login, register } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && currentUser) {
      router.replace("/home");
    }
  }, [loading, currentUser, router]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result =
      mode === "login" ? login(username, password) : register(username, password);
    if (!result.ok) {
      setError(result.error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 py-10">
      <Image
        src="/images/logo.png"
        alt="Grandfather's Ultimate Ultra SuperNova"
        width={260}
        height={260}
        className="h-48 w-48 object-contain"
        priority
      />

      <Card className="w-full max-w-sm" tone="mustard">
        <h1 className="mb-1 text-center font-display text-2xl font-bold text-azuki-dark">
          {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </h1>
        <p className="mb-5 text-center text-sm text-ink/70">
          ขยับร่างกายเบา ๆ ทุกวัน เพื่อสุขภาพกายและใจที่ดี
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-base font-semibold">ชื่อผู้ใช้</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="tap-target rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-lg outline-none focus:border-matcha"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-base font-semibold">รหัสผ่าน</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="tap-target rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-lg outline-none focus:border-matcha"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm font-semibold text-azuki-dark">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            icon={mode === "login" ? LogIn : UserPlus}
          >
            {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className="tap-target mt-4 w-full text-center text-base font-semibold text-matcha-dark underline underline-offset-4"
        >
          {mode === "login"
            ? "ยังไม่มีบัญชี? สมัครสมาชิกที่นี่"
            : "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ"}
        </button>
      </Card>

      <p className="max-w-sm text-center text-xs text-ink/50">
        บัญชีนี้ถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น (แอปนี้เป็นเวอร์ชันสาธิตแบบ front-end only)
      </p>
    </main>
  );
}
