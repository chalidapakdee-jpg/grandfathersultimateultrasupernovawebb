"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Mascot from "@/components/Mascot";

export default function LoginPage() {
  const { login, register, isAuthed, ready } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && isAuthed) router.replace("/home");
  }, [ready, isAuthed, router]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result = mode === "login" ? login(username, password) : register(username, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/home");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-4 py-10">
      <Mascot
        size={130}
        speechTh={
          mode === "login"
            ? "สวัสดีค่ะ/ครับ เข้าสู่ระบบเพื่อเริ่มออกกำลังกายกันนะคะ"
            : "ยินดีต้อนรับ! สมัครสมาชิกใหม่กันเลยค่ะ"
        }
      />

      <h1 className="text-center font-display text-2xl font-bold text-matcha-700">
        Grand Father&apos;s Ultimate Ultra Supernova Webb
      </h1>
      <p className="text-center font-body text-ink/70 -mt-4">แอปออกกำลังกายเบา ๆ เพื่อผู้สูงวัย</p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl2 border-4 border-matcha-600 bg-white/70 p-6 shadow-soft"
      >
        <div className="mb-4 flex rounded-xl border-2 border-matcha-600 overflow-hidden" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => setMode("login")}
            className={`flex-1 py-3 font-bold ${mode === "login" ? "bg-matcha-600 text-cream" : "bg-white text-matcha-700"}`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            onClick={() => setMode("register")}
            className={`flex-1 py-3 font-bold ${mode === "register" ? "bg-matcha-600 text-cream" : "bg-white text-matcha-700"}`}
          >
            สมัครสมาชิก
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block font-bold text-ink">ชื่อผู้ใช้</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="w-full rounded-xl border-2 border-matcha-400 bg-white px-4 py-3 text-lg outline-none focus:border-matcha-600"
            placeholder="เช่น คุณตาสมชาย"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block font-bold text-ink">รหัสผ่าน</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full rounded-xl border-2 border-matcha-400 bg-white px-4 py-3 text-lg outline-none focus:border-matcha-600"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-azuki-50 border-2 border-azuki-400 px-3 py-2 font-bold text-azuki-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-azuki-600 py-4 text-xl font-bold text-cream shadow-soft hover:bg-azuki-700"
        >
          {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </button>

        <p className="mt-4 text-center text-sm text-ink/60">
          บัญชีของคุณถูกเก็บไว้ในเครื่องนี้เท่านั้น (ยังไม่รองรับการซิงค์ข้ามอุปกรณ์ในเวอร์ชันนี้)
        </p>
      </form>
    </main>
  );
}
