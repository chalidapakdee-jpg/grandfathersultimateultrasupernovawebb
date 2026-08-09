"use client";

import { useState } from "react";
import { Lock, Check } from "lucide-react";
import Card from "@/components/Card";
import AvatarPreview from "@/components/AvatarPreview";
import { AVATAR_CATEGORIES, priceFor, itemKey } from "@/lib/avatarItems";
import { useUserData } from "@/components/UserDataProvider";

export default function AvatarBuilder() {
  const { profile, points, ownedItems, updateProfile, purchaseItem } = useUserData();
  const [errorFor, setErrorFor] = useState(null);

  function handlePick(categoryKey, index) {
    const key = itemKey(categoryKey, index);
    if (ownedItems.includes(key)) {
      updateProfile(categoryKey, index);
      setErrorFor(null);
      return;
    }
    const result = purchaseItem(categoryKey, index);
    if (result.ok) {
      updateProfile(categoryKey, index);
      setErrorFor(null);
    } else {
      setErrorFor(key);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card tone="mustard" className="flex flex-col items-center gap-2">
        <AvatarPreview profile={profile} size={180} />
        <p className="text-sm text-ink/70">
          แต้มคงเหลือ: <span className="font-bold text-azuki-dark">{points.toLocaleString("th-TH")}</span>
        </p>
      </Card>

      {AVATAR_CATEGORIES.map((category) => (
        <Card key={category.key}>
          <h2 className="mb-3 font-display text-lg font-bold">{category.label}</h2>
          <div className="grid grid-cols-4 gap-3">
            {category.options.map((option, index) => {
              const key = itemKey(category.key, index);
              const owned = ownedItems.includes(key);
              const selected = profile[category.key] === index;
              const price = priceFor(index);
              return (
                <button
                  key={key}
                  onClick={() => handlePick(category.key, index)}
                  className={`tap-target relative flex flex-col items-center gap-1 rounded-2xl border-2 p-2 transition-colors ${
                    selected ? "border-azuki bg-azuki-light/30" : "border-ink/15 bg-white hover:border-matcha"
                  }`}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20"
                    style={{ backgroundColor: option.color === "transparent" ? "#fff" : option.color }}
                  >
                    {selected && <Check size={16} className="text-white drop-shadow" aria-hidden="true" />}
                  </span>
                  <span className="text-[11px] leading-tight">{option.name}</span>
                  {!owned && (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-azuki-dark">
                      <Lock size={10} aria-hidden="true" />
                      {price.toLocaleString("th-TH")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {errorFor && errorFor.startsWith(category.key) && (
            <p role="alert" className="mt-2 text-sm font-semibold text-azuki-dark">
              แต้มไม่พอสำหรับไอเทมนี้
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
