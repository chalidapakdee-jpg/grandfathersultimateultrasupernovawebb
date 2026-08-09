"use client";

import { useRouter } from "next/navigation";
import { LogOut, Trash2, UserX, Type } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAuth } from "@/components/AuthProvider";
import { useUserData } from "@/components/UserDataProvider";

const FONT_OPTIONS = [
  { key: "small", label: "เล็ก" },
  { key: "medium", label: "กลาง" },
  { key: "large", label: "ใหญ่" },
  { key: "xlarge", label: "ใหญ่พิเศษ" },
];

export default function SettingsPage() {
  const { logout, deleteAccount } = useAuth();
  const { settings, updateSettings, clearHistory } = useUserData();
  const router = useRouter();

  function handleClearHistory() {
    if (window.confirm("ต้องการลบประวัติการเล่นทั้งหมดใช่หรือไม่?")) {
      clearHistory();
    }
  }

  function handleDeleteAccount() {
    if (
      window.confirm(
        "ต้องการลบบัญชีผู้ใช้นี้ใช่หรือไม่? ข้อมูลทั้งหมดจะหายไปและไม่สามารถกู้คืนได้"
      )
    ) {
      deleteAccount();
      router.replace("/login");
    }
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <TopBar />
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        <h1 className="mb-4 font-display text-2xl font-bold text-azuki-dark">ตั้งค่า</h1>

        <Card className="mb-4">
          <div className="mb-3 flex items-center gap-2">
            <Type size={22} className="text-matcha-dark" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold">ขนาดตัวอักษร</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FONT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => updateSettings({ fontSize: opt.key })}
                className={`tap-target rounded-2xl border-2 py-3 font-semibold transition-colors ${
                  settings.fontSize === opt.key
                    ? "border-azuki bg-azuki text-cream"
                    : "border-ink/15 bg-white hover:border-matcha"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-4 flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold">บัญชีผู้ใช้</h2>
          <Button variant="outline" fullWidth icon={LogOut} onClick={handleLogout}>
            ออกจากระบบ
          </Button>
          <Button variant="outline" fullWidth icon={Trash2} onClick={handleClearHistory}>
            ลบประวัติการเล่น
          </Button>
          <Button
            variant="primary"
            fullWidth
            icon={UserX}
            onClick={handleDeleteAccount}
            className="!bg-azuki-dark hover:!bg-azuki-dark"
          >
            ลบบัญชีผู้ใช้ถาวร
          </Button>
        </Card>
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
}
