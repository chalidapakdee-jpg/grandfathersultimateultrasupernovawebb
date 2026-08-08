"use client";

import Image from "next/image";

export default function TopBar({ title }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b-4 border-matcha-700 bg-matcha-500 px-4 py-3 text-cream shadow-soft">
      <Image src="/logo.svg" alt="ตราสัญลักษณ์แอป" width={40} height={40} priority />
      <h1 className="font-display text-xl font-bold leading-tight">{title}</h1>
    </header>
  );
}
