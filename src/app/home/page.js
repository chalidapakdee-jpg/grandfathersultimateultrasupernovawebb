"use client";

import Link from "next/link";
import { History, Gamepad2, Settings, User, Trophy } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import Mascot from "@/components/Mascot";
import { useApp } from "@/context/AppContext";

const CARDS = [
  {
    href: "/history",
    title: "ประวัติการใช้งาน",
    desc: "ดูคะแนนสะสม วันที่เล่น และความสม่ำเสมอของคุณ",
    icon: History,
    accent: "bg-matcha-100 border-matcha-500 text-matcha-800",
  },
  {
    href: "/game",
    title: "เกมการเคลื่อนไหว",
    desc: "ออกกำลังกายเบา ๆ ตามจังหวะ ด้วยกล้องของคุณ",
    icon: Gamepad2,
    accent: "bg-azuki-100 border-azuki-500 text-azuki-800",
  },
  {
    href: "/profile",
    title: "โปรไฟล์ของฉัน",
    desc: "แต่งตัวละคร ดูอันดับ และแลกของรางวัล",
    icon: User,
    accent: "bg-mustard-100 border-mustard-500 text-mustard-800",
  },
  {
    href: "/settings",
    title: "ตั้งค่า",
    desc: "ปรับขนาดตัวอักษร ออกจากระบบ และอื่น ๆ",
    icon: Settings,
    accent: "bg-matcha-100 border-matcha-500 text-matcha-800",
  },
];

export default function HomePage() {
  const { user } = useApp();

  return (
    <RequireAuth>
      <TopBar title="Grand Father's Ultimate Ultra Supernova Webb" />
      <main className="mx-auto max-w-xl px-4 pb-28 pt-6">
        <Mascot
          size={100}
          speechTh={`สวัสดีค่ะ/ครับ คุณ${user?.username || ""} วันนี้มาขยับร่างกายเบา ๆ กันไหมคะ`}
        />

        <section className="mt-6 rounded-xl2 border-2 border-mustard-400 bg-mustard-50 p-5">
          <h2 className="mb-2 font-display text-lg font-bold text-ink">วิธีใช้งานแอปนี้</h2>
          <ol className="mb-3 list-decimal space-y-1 pl-5 font-body text-ink/90">
            <li>กด &ldquo;เกมการเคลื่อนไหว&rdquo; แล้วเลือกระยะเวลาที่ต้องการเล่น</li>
            <li>อนุญาตให้ใช้กล้อง แล้วทำท่าทางตามคำแนะนำที่พูดเป็นภาษาไทย</li>
            <li>เก็บคะแนนได้เรื่อย ๆ ดูผลย้อนหลังได้ที่ &ldquo;ประวัติการใช้งาน&rdquo;</li>
          </ol>
          <p className="font-body text-ink/80">
            เราตั้งใจสร้างแอปนี้ขึ้นเพื่อสุขภาพกายและสุขภาพใจที่ดีของผู้สูงวัยทุกท่าน
          </p>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map(({ href, title, desc, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-xl2 border-4 p-5 shadow-soft transition-transform hover:scale-[1.02] ${accent}`}
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/70">
                <Icon size={34} strokeWidth={2.2} />
              </span>
              <span>
                <span className="block font-display text-lg font-bold">{title}</span>
                <span className="block font-body text-sm opacity-80">{desc}</span>
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-6 flex items-center justify-between rounded-xl2 border-2 border-matcha-400 bg-white/60 p-4">
          <div className="flex items-center gap-2 text-matcha-700">
            <Trophy size={22} />
            <span className="font-bold">คะแนนสะสมของคุณ</span>
          </div>
          <span className="font-display text-2xl font-bold text-azuki-700">
            {(user?.totalPoints || 0).toLocaleString("th-TH")}
          </span>
        </section>
      </main>
      <BottomNav />
    </RequireAuth>
  );
}
