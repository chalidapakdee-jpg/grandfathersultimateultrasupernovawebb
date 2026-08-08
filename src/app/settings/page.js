"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, Type, UserX } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useApp } from "@/context/AppContext";
import { FONT_SCALES } from "@/lib/constants";

export default function SettingsPage() {
  const { user, updateUser, logout, wipeHistory, deleteAccount } = useApp();
  const router = useRouter();
  const [confirmKind, setConfirmKind] = useState(null); // "history" | "account" | "logout" | null

  function closeConfirm() {
    setConfirmKind(null);
  }

  function handleConfirm() {
    if (confirmKind === "history") wipeHistory();
    if (confirmKind === "account") {
      deleteAccount();
      router.replace("/login");
    }
    if (confirmKind === "logout") {
      logout();
      router.replace("/login");
    }
    closeConfirm();
  }

  return (
    <RequireAuth>
      <TopBar title="ตั้งค่า" />
      <main className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <section className="mb-6 rounded-xl2 border-2 border-matcha-400 bg-white/70 p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Type size={22} /> ขนาดตัวอักษร
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(FONT_SCALES).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => updateUser({ fontSize: key })}
                aria-pressed={user?.fontSize === key}
                className={`rounded-xl border-2 py-3 font-bold ${
                  user?.fontSize === key
                    ? "border-matcha-700 bg-matcha-600 text-cream"
                    : "border-matcha-400 bg-white text-matcha-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <button
            onClick={() => setConfirmKind("logout")}
            className="flex w-full items-center gap-3 rounded-xl2 border-2 border-matcha-500 bg-matcha-50 p-4 font-bold text-matcha-800"
          >
            <LogOut size={22} /> ออกจากระบบ
          </button>

          <button
            onClick={() => setConfirmKind("history")}
            className="flex w-full items-center gap-3 rounded-xl2 border-2 border-mustard-500 bg-mustard-50 p-4 font-bold text-mustard-800"
          >
            <Trash2 size={22} /> ลบประวัติการใช้งานทั้งหมด
          </button>

          <button
            onClick={() => setConfirmKind("account")}
            className="flex w-full items-center gap-3 rounded-xl2 border-2 border-azuki-500 bg-azuki-50 p-4 font-bold text-azuki-800"
          >
            <UserX size={22} /> ลบบัญชีผู้ใช้ของฉัน
          </button>
        </section>
      </main>

      <ConfirmDialog
        open={confirmKind === "logout"}
        title="ออกจากระบบ?"
        description="คุณสามารถเข้าสู่ระบบใหม่ได้ทุกเมื่อ"
        confirmLabel="ออกจากระบบ"
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
      <ConfirmDialog
        open={confirmKind === "history"}
        title="ลบประวัติการใช้งานทั้งหมด?"
        description="คะแนนสะสมและรายการเล่นย้อนหลังทั้งหมดจะถูกลบ การกระทำนี้ย้อนกลับไม่ได้"
        confirmLabel="ลบประวัติ"
        danger
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
      <ConfirmDialog
        open={confirmKind === "account"}
        title="ลบบัญชีผู้ใช้ของฉัน?"
        description="ข้อมูลทั้งหมดของคุณ รวมถึงคะแนน โปรไฟล์ และประวัติ จะถูกลบออกจากอุปกรณ์นี้อย่างถาวร"
        confirmLabel="ลบบัญชี"
        danger
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />

      <BottomNav />
    </RequireAuth>
  );
}
