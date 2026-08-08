import { findOption } from "@/lib/constants";

/**
 * Hand-drawn layered SVG avatar (no external art assets needed).
 * Reads the six category ids on `avatar` and colors/shapes each layer.
 */
export default function AvatarSVG({ avatar, size = 180 }) {
  const skin = findOption("body", avatar.body)?.colorClass || "#E3A97B";
  const hair = findOption("hair", avatar.hair)?.colorClass || "#D9D9D9";
  const outfit = findOption("outfit", avatar.outfit)?.colorClass || "#7C9473";
  const accessory = avatar.accessory;
  const headShape = avatar.head;
  const face = avatar.face;

  const headRx = headShape === "head_square" ? 26 : headShape === "head_oval" ? 30 : 34;
  const headRy = headShape === "head_oval" ? 40 : 34;

  return (
    <svg viewBox="0 0 200 220" width={size} height={size} role="img" aria-label="อวตารของคุณ">
      {/* body / shirt */}
      <path d="M40 210 C40 150 60 130 100 130 C140 130 160 150 160 210 Z" fill={outfit} stroke="#3A2F22" strokeWidth="3" />
      {/* neck */}
      <rect x="88" y="108" width="24" height="26" fill={skin} />
      {/* hair back layer (for bun) */}
      {avatar.hair === "hair_bun" && <circle cx="100" cy="58" r="14" fill={hair} stroke="#3A2F22" strokeWidth="2" />}
      {/* head */}
      <ellipse cx="100" cy="90" rx={headRx} ry={headRy} fill={skin} stroke="#3A2F22" strokeWidth="3" />
      {/* hair top */}
      {avatar.hair !== "hair_bald" && (
        <path
          d={`M${100 - headRx - 2} 82 Q100 ${90 - headRy - 26} ${100 + headRx + 2} 82 Q${100 + headRx - 4} 55 100 52 Q${100 - headRx + 4} 55 ${100 - headRx - 2} 82 Z`}
          fill={hair}
          stroke="#3A2F22"
          strokeWidth="2"
        />
      )}
      {/* face */}
      <circle cx={100 - 12} cy={92} r="3.2" fill="#3A2F22" />
      <circle cx={100 + 12} cy={92} r="3.2" fill="#3A2F22" />
      {face === "face_wink" ? (
        <path d={`M${100 - 15} 92 h6`} stroke="#3A2F22" strokeWidth="2.4" strokeLinecap="round" />
      ) : null}
      <path d={`M${100 - 12} 104 Q100 114 ${100 + 12} 104`} stroke="#9C3D2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      {face === "face_glasses" && (
        <g stroke="#3A2F22" strokeWidth="2.2" fill="none">
          <circle cx={100 - 12} cy="92" r="9" />
          <circle cx={100 + 12} cy="92" r="9" />
          <path d="M91 92 h18" />
        </g>
      )}
      {/* accessories */}
      {accessory === "accessory_hat" && (
        <path d={`M${100 - headRx - 10} 66 Q100 40 ${100 + headRx + 10} 66 Z`} fill="#D6A526" stroke="#3A2F22" strokeWidth="2" />
      )}
      {accessory === "accessory_scarf" && (
        <path d="M76 122 Q100 138 124 122 L120 140 Q100 148 80 140 Z" fill="#9C3D2E" stroke="#3A2F22" strokeWidth="2" />
      )}
      {accessory === "accessory_cane" && (
        <path d="M158 150 L172 205 M172 205 Q172 195 162 195" stroke="#6F9552" strokeWidth="5" fill="none" strokeLinecap="round" />
      )}
      {/* arms */}
      <path d="M42 165 Q25 180 32 205" stroke={outfit} strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M158 165 Q175 180 168 205" stroke={outfit} strokeWidth="16" fill="none" strokeLinecap="round" />
    </svg>
  );
}
