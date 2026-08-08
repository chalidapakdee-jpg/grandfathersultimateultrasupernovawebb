"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Gamepad2, Home, Settings, User } from "lucide-react";

const ITEMS = [
  { href: "/home", label: "หน้าหลัก", icon: Home },
  { href: "/history", label: "ประวัติ", icon: History },
  { href: "/game", label: "เล่นเกม", icon: Gamepad2, emphasize: true },
  { href: "/profile", label: "โปรไฟล์", icon: User },
  { href: "/settings", label: "ตั้งค่า", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t-4 border-matcha-700 bg-cream/95 backdrop-blur px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 shadow-soft"
      aria-label="เมนูหลัก"
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-between">
        {ITEMS.map(({ href, label, icon: Icon, emphasize }) => {
          const active = pathname?.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={[
                  "flex flex-col items-center justify-center gap-1 rounded-2xl mx-1 py-2 transition-colors",
                  emphasize
                    ? "bg-azuki-500 text-cream -mt-4 shadow-soft border-4 border-cream"
                    : active
                    ? "bg-matcha-200 text-matcha-800"
                    : "text-ink/70 hover:bg-matcha-50",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={emphasize ? 30 : 24} strokeWidth={2.4} />
                <span className={emphasize ? "text-xs font-bold" : "text-xs font-semibold"}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
