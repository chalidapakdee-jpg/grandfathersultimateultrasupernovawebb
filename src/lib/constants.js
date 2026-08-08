// Font-size scale used across the whole app. "lg" is the default because
// the audience is elderly users — never default to small text.
export const FONT_SCALES = {
  sm: { label: "เล็ก", rem: "16px" },
  md: { label: "ปกติ", rem: "19px" },
  lg: { label: "ใหญ่", rem: "22px" },
  xl: { label: "ใหญ่พิเศษ", rem: "26px" },
};

// Duration options for a movement-game session.
export const DURATION_OPTIONS = [
  { minutes: 3, label: "3 นาที (สั้น ๆ)" },
  { minutes: 5, label: "5 นาที" },
  { minutes: 10, label: "10 นาที" },
  { minutes: 15, label: "15 นาที (เต็มอิ่ม)" },
];

// Avatar shop — Duolingo-style parts. Starter items cost 0 and are owned
// by every new account (see storage.js STARTER_AVATAR).
export const AVATAR_CATEGORIES = [
  {
    key: "body",
    label: "รูปร่าง",
    options: [
      { id: "body_tan", label: "ผิวสีแทน", cost: 0, colorClass: "#E3A97B" },
      { id: "body_fair", label: "ผิวขาว", cost: 0, colorClass: "#F4D9BC" },
      { id: "body_deep", label: "ผิวสีเข้ม", cost: 300, colorClass: "#8B5A34" },
      { id: "body_olive", label: "ผิวสีน้ำผึ้ง", cost: 300, colorClass: "#C98B55" },
    ],
  },
  {
    key: "head",
    label: "รูปหน้า",
    options: [
      { id: "head_round", label: "หน้ากลม", cost: 0 },
      { id: "head_oval", label: "หน้ารูปไข่", cost: 0 },
      { id: "head_square", label: "หน้าเหลี่ยม", cost: 300 },
    ],
  },
  {
    key: "hair",
    label: "ทรงผม",
    options: [
      { id: "hair_silver", label: "ผมสีเงิน", cost: 0, colorClass: "#D9D9D9" },
      { id: "hair_white", label: "ผมสีขาว", cost: 0, colorClass: "#F2F2F2" },
      { id: "hair_bald", label: "ศีรษะล้าน", cost: 0, colorClass: "transparent" },
      { id: "hair_black", label: "ผมสีดำ", cost: 500, colorClass: "#2E2A26" },
      { id: "hair_bun", label: "มวยผม", cost: 800, colorClass: "#E8E8E8" },
    ],
  },
  {
    key: "face",
    label: "สีหน้า",
    options: [
      { id: "face_smile", label: "ยิ้มร่าเริง", cost: 0 },
      { id: "face_glasses", label: "สวมแว่นตา", cost: 400 },
      { id: "face_wink", label: "ยิ้มขยิบตา", cost: 600 },
    ],
  },
  {
    key: "outfit",
    label: "เสื้อผ้า",
    options: [
      { id: "outfit_matcha_shirt", label: "เสื้อสีมัทฉะ", cost: 0, colorClass: "#7C9473" },
      { id: "outfit_azuki_shirt", label: "เสื้อสีแดงอะซึกิ", cost: 700, colorClass: "#9C3D2E" },
      { id: "outfit_mustard_vest", label: "เสื้อกั๊กสีมัสตาร์ด", cost: 1200, colorClass: "#D6A526" },
      { id: "outfit_thai_pattern", label: "เสื้อลายไทย", cost: 2500, colorClass: "#6F9552" },
    ],
  },
  {
    key: "accessory",
    label: "เครื่องประดับ",
    options: [
      { id: "accessory_none", label: "ไม่ใส่", cost: 0 },
      { id: "accessory_hat", label: "หมวกสาน", cost: 900, colorClass: "#D6A526" },
      { id: "accessory_scarf", label: "ผ้าพันคอ", cost: 1000, colorClass: "#9C3D2E" },
      { id: "accessory_cane", label: "ไม้เท้าลาย", cost: 1800, colorClass: "#6F9552" },
    ],
  },
];

export function findOption(categoryKey, optionId) {
  const cat = AVATAR_CATEGORIES.find((c) => c.key === categoryKey);
  if (!cat) return null;
  return cat.options.find((o) => o.id === optionId) || null;
}

// Seed leaderboard so the page never looks empty for a brand-new install.
export const SEED_LEADERBOARD = [
  { id: "seed_1", username: "ป้าสมศรี", totalPoints: 218400 },
  { id: "seed_2", username: "ลุงประยูร", totalPoints: 176200 },
  { id: "seed_3", username: "คุณยายทองดี", totalPoints: 154900 },
  { id: "seed_4", username: "ตาแก้ว", totalPoints: 98300 },
  { id: "seed_5", username: "ป้าอำไพ", totalPoints: 61200 },
];
