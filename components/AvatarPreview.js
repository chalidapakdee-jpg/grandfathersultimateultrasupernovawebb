import { AVATAR_CATEGORIES } from "@/lib/avatarItems";

function colorFor(categoryKey, index) {
  const category = AVATAR_CATEGORIES.find((c) => c.key === categoryKey);
  return category?.options[index]?.color ?? "transparent";
}

export default function AvatarPreview({ profile, size = 200 }) {
  const skin = colorFor("skin", profile.skin);
  const hairColor = colorFor("hair", profile.hair);
  const outfit = colorFor("outfit", profile.outfit);
  const accessoryColor = colorFor("accessory", profile.accessory);

  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={(size * 240) / 200}
      role="img"
      aria-label="ตัวละครของคุณ"
    >
      {/* body / shirt */}
      <rect x="45" y="150" width="110" height="80" rx="28" fill={outfit} stroke="#2E2A22" strokeWidth="2" />
      {/* neck */}
      <rect x="88" y="120" width="24" height="30" fill={skin} />

      {/* head */}
      <circle cx="100" cy="85" r="55" fill={skin} stroke="#2E2A22" strokeWidth="2" />

      {/* hair */}
      {profile.hair === 1 && (
        <path d="M45 75 A55 45 0 0 1 155 75 L150 55 A52 40 0 0 0 50 55 Z" fill={hairColor} />
      )}
      {profile.hair === 2 && (
        <path d="M40 78 A60 50 0 0 1 160 78 L155 45 A58 42 0 0 0 45 45 Z" fill={hairColor} />
      )}
      {profile.hair === 3 && (
        <>
          <path d="M45 70 A55 42 0 0 1 155 70 L150 50 A52 38 0 0 0 50 50 Z" fill={hairColor} />
          <circle cx="100" cy="28" r="14" fill={hairColor} />
        </>
      )}

      {/* eyes */}
      {profile.face === 2 ? (
        <>
          <line x1="75" y1="82" x2="88" y2="82" stroke="#2E2A22" strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="82" r="4" fill="#2E2A22" />
        </>
      ) : (
        <>
          <circle cx="80" cy="82" r="4" fill="#2E2A22" />
          <circle cx="120" cy="82" r="4" fill="#2E2A22" />
        </>
      )}

      {/* mouth */}
      {profile.face === 1 ? (
        <line x1="85" y1="108" x2="115" y2="108" stroke="#2E2A22" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path
          d="M82 104 Q100 118 118 104"
          fill="none"
          stroke="#2E2A22"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* glasses (face style 3) */}
      {profile.face === 3 && (
        <g stroke="#2E2A22" strokeWidth="3" fill="none">
          <circle cx="80" cy="82" r="14" />
          <circle cx="120" cy="82" r="14" />
          <line x1="94" y1="82" x2="106" y2="82" />
        </g>
      )}

      {/* accessories */}
      {profile.accessory === 1 && (
        <path d="M42 60 A58 46 0 0 1 158 60 L158 48 A58 46 0 0 0 42 48 Z" fill={accessoryColor} stroke="#2E2A22" strokeWidth="2" />
      )}
      {profile.accessory === 2 && (
        <rect x="66" y="74" width="68" height="16" rx="8" fill={accessoryColor} />
      )}
      {profile.accessory === 3 && (
        <path d="M60 148 Q100 168 140 148 L140 160 Q100 178 60 160 Z" fill={accessoryColor} />
      )}
    </svg>
  );
}
