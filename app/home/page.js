"use client";

import Image from "next/image";
import Link from "next/link";
import { PlayCircle, History, User, Settings, Flame, Trophy } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import { useUserData } from "@/components/UserDataProvider";

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

function useTwoWeekCount(history) {
  const cutoff = Date.now() - TWO_WEEKS_MS;
  return history.filter((h) => new Date(h.dateISO).getTime() >= cutoff).length;
}

export default function HomePage() {
  const { points, history } = useUserData();
  const twoWeekCount = useTwoWeekCount(history);

  return (
    <ProtectedRoute>
      <TopBar />
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        <Card tone="matcha" className="mb-6 flex items-center gap-4">
          <Image
            src="/images/mascot.jpg"
            alt="คุณปู่มาสคอต"
            width={96}
            height={96}
            className="h-24 w-24 shrink-0 rounded-full border-4 border-white object-cover shadow-soft"
          />
          <div className="relative rounded-3xl rounded-bl-none bg-white/90 p-4 shadow-soft">
            <p className="text-base leading-relaxed">
              สวัสดีครับ! เราสร้างแอปนี้ขึ้นเพื่อสุขภาพกายและใจที่ดีของผู้สูงวัย
              ทุกวันแตะปุ่ม &ldquo;เริ่มเล่นเกม&rdquo; แล้วขยับตามคำแนะนำที่พูดเป็นภาษาไทยได้เลย
              ใช้เวลาไม่นาน แต่ทำได้ทุกวัน
            </p>
          </div>
        </Card>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <StatCard icon={Trophy} label="แต้มสะสมทั้งหมด" value={points.toLocaleString("th-TH")} tone="mustard" />
          <StatCard icon={Flame} label="เล่นใน 2 สัปดาห์นี้" value={`${twoWeekCount} ครั้ง`} tone="azuki" />
        </div>

        <Link href="/game" className="mb-6 block">
          <Button variant="primary" fullWidth icon={PlayCircle} className="py-5 text-xl">
            เริ่มเล่นเกมขยับร่างกาย
          </Button>
        </Link>

        <div className="grid grid-cols-3 gap-3">
          <Link href="/record">
            <Card className="flex flex-col items-center gap-2 py-6 text-center hover:shadow-none">
              <History size={28} className="text-matcha-dark" aria-hidden="true" />
              <span className="text-sm font-semibold">ประวัติการเล่น</span>
            </Card>
          </Link>
          <Link href="/profile">
            <Card className="flex flex-col items-center gap-2 py-6 text-center hover:shadow-none">
              <User size={28} className="text-azuki-dark" aria-hidden="true" />
              <span className="text-sm font-semibold">โปรไฟล์</span>
            </Card>
          </Link>
          <Link href="/settings">
            <Card className="flex flex-col items-center gap-2 py-6 text-center hover:shadow-none">
              <Settings size={28} className="text-ink/70" aria-hidden="true" />
              <span className="text-sm font-semibold">ตั้งค่า</span>
            </Card>
          </Link>
        </div>
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
}
