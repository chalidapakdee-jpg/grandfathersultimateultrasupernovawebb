"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlayCircle, History, User, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/home", label: "หน้าหลัก", icon: Home },
  { href: "/game", label: "เล่นเกม", icon: PlayCircle },
  { href: "/record", label: "ประวัติ", icon: History },
  { href: "/profile", label: "โปรไฟล์", icon: User },
  { href: "/settings", label: "ตั้งค่า", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`tap-target flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-semibold transition-colors ${
                active ? "text-azuki" : "text-ink/50 hover:text-ink/80"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                size={26}
                strokeWidth={active ? 2.5 : 2}
                fill={active ? "currentColor" : "none"}
                aria-hidden="true"
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
